import "server-only";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { addDays, dayIn } from "./dates";
import { computeStreak, crossedMilestones, type Celebration } from "./gamification";
import { getSettings } from "./settings";
import { FRESH, firstDue, schedule } from "./srs";

const { progress, activity } = schema;

async function totalLearned(userId: number) {
  const [row] = await db.select({ n: count() }).from(progress).where(eq(progress.userId, userId));
  return row.n;
}

export async function activeDays(userId: number, limit = 400) {
  const rows = await db
    .select({ day: activity.day })
    .from(activity)
    .where(and(eq(activity.userId, userId), sql`${activity.learned} + ${activity.reviewed} > 0`))
    .orderBy(desc(activity.day))
    .limit(limit);
  return rows.map((r) => r.day);
}

/** Add to today's activity row. Returns true when this is the first activity of the day. */
async function bumpActivity(
  userId: number,
  day: string,
  delta: { learned?: number; reviewed?: number; correct?: number; wrong?: number },
) {
  const v = { learned: 0, reviewed: 0, correct: 0, wrong: 0, ...delta };
  const rows = await db.execute<{ inserted: boolean }>(sql`
    insert into activity (user_id, day, learned, reviewed, correct, wrong)
    values (${userId}, ${day}, ${v.learned}, ${v.reviewed}, ${v.correct}, ${v.wrong})
    on conflict (user_id, day) do update set
      learned = activity.learned + excluded.learned,
      reviewed = activity.reviewed + excluded.reviewed,
      correct = activity.correct + excluded.correct,
      wrong = activity.wrong + excluded.wrong
    returning (xmax = 0) as inserted
  `);
  return Boolean(rows.rows[0]?.inserted);
}

async function celebrationsAfter(
  userId: number,
  firstOfDay: boolean,
  learnedBefore: number,
  learnedAfter: number,
  today: string,
): Promise<Celebration[]> {
  const settings = await getSettings();
  const out: Celebration[] = [];
  if (firstOfDay) {
    const { streak } = computeStreak(await activeDays(userId), today, addDays(today, -1));
    if (streak >= 2) out.push({ type: "streak", days: streak });
  }
  for (const m of crossedMilestones(learnedBefore, learnedAfter, settings.milestones)) {
    out.push({ type: "milestone", count: m });
  }
  return out;
}

export async function recordLearned(userId: number, itemIds: number[]) {
  if (!itemIds.length) return { added: 0, celebrations: [] as Celebration[] };
  const { timezone } = await getSettings();
  const today = dayIn(timezone);
  const before = await totalLearned(userId);
  const now = new Date();
  const inserted = await db
    .insert(progress)
    .values(itemIds.map((itemId) => ({ userId, itemId, learnedOn: today, dueAt: firstDue(now) })))
    .onConflictDoNothing()
    .returning({ itemId: progress.itemId });
  if (!inserted.length) return { added: 0, celebrations: [] as Celebration[] };
  const firstOfDay = await bumpActivity(userId, today, { learned: inserted.length });
  const celebrations = await celebrationsAfter(userId, firstOfDay, before, before + inserted.length, today);
  return { added: inserted.length, celebrations };
}

/** Undo "learned" for items marked today only. */
export async function unlearnToday(userId: number, itemId: number) {
  const { timezone } = await getSettings();
  const today = dayIn(timezone);
  const removed = await db
    .delete(progress)
    .where(and(eq(progress.userId, userId), eq(progress.itemId, itemId), eq(progress.learnedOn, today), eq(progress.reps, 0)))
    .returning({ itemId: progress.itemId });
  if (removed.length) {
    await db
      .update(activity)
      .set({ learned: sql`greatest(${activity.learned} - 1, 0)` })
      .where(and(eq(activity.userId, userId), eq(activity.day, today)));
  }
}

export type Answer = { itemId: number; correct: boolean };

/** Grade answers from reviews, flashcards and exercises. Unknown items enter the SRS queue. */
export async function recordAnswers(userId: number, answers: Answer[]) {
  if (!answers.length) return { celebrations: [] as Celebration[] };
  // Keep only the last answer per item.
  const byItem = new Map(answers.map((a) => [a.itemId, a.correct]));
  const ids = [...byItem.keys()];
  const { timezone } = await getSettings();
  const today = dayIn(timezone);
  const now = new Date();

  const existing = await db
    .select()
    .from(progress)
    .where(and(eq(progress.userId, userId), inArray(progress.itemId, ids)));
  const prevById = new Map(existing.map((p) => [p.itemId, p]));
  const before = await totalLearned(userId);
  const fresh = ids.filter((id) => !prevById.has(id)).length;

  const rows = ids.map((itemId) => {
    const prev = prevById.get(itemId);
    const next = schedule(prev ?? FRESH, byItem.get(itemId)!, now);
    return { userId, itemId, learnedOn: prev?.learnedOn ?? today, ...next };
  });

  await db
    .insert(progress)
    .values(rows)
    .onConflictDoUpdate({
      target: [progress.userId, progress.itemId],
      set: {
        intervalDays: sql`excluded.interval_days`,
        ease: sql`excluded.ease`,
        reps: sql`excluded.reps`,
        lapses: sql`excluded.lapses`,
        wrongCount: sql`excluded.wrong_count`,
        correctStreak: sql`excluded.correct_streak`,
        priority: sql`excluded.priority`,
        dueAt: sql`excluded.due_at`,
        lastReviewedAt: sql`excluded.last_reviewed_at`,
      },
    });

  const correct = [...byItem.values()].filter(Boolean).length;
  const firstOfDay = await bumpActivity(userId, today, {
    learned: fresh,
    reviewed: ids.length,
    correct,
    wrong: ids.length - correct,
  });
  const celebrations = await celebrationsAfter(userId, firstOfDay, before, before + fresh, today);
  return { celebrations };
}
