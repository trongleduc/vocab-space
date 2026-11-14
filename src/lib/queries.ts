import "server-only";
import { and, asc, count, desc, eq, ilike, isNull, lte, or, sql, type SQL } from "drizzle-orm";
import { connection } from "next/server";
import { cache } from "react";
import { db, schema } from "@/db";
import type { Item, ItemKind } from "@/db/schema";
import { addDays, dayIn } from "./dates";
import { computeStreak, rankFor, streakTier } from "./gamification";
import { LANGS, type Lang } from "./langs";
import { activeDays } from "./progress";
import { getSettings } from "./settings";
import { findTarget, shuffle } from "./text";

const { items, progress, activity } = schema;

export type ItemWithStatus = Item & { learnedOn: string | null; priority: boolean };

const withStatus = (userId: number) =>
  db
    .select({
      item: items,
      learnedOn: progress.learnedOn,
      priority: progress.priority,
    })
    .from(items)
    .leftJoin(progress, and(eq(progress.itemId, items.id), eq(progress.userId, userId)));

const flatten = (rows: { item: Item; learnedOn: string | null; priority: boolean | null }[]): ItemWithStatus[] =>
  rows.map((r) => ({ ...r.item, learnedOn: r.learnedOn, priority: Boolean(r.priority) }));

const LEVEL_ORDER = sql`case
  when ${items.level} ~ '^HSK[0-9]' then substring(${items.level} from 4 for 1)::int
  when ${items.level} = 'B1' then 1 when ${items.level} = 'B2' then 2
  when ${items.level} = 'C1' then 3 when ${items.level} = 'C2' then 4
  else 99 end`;

export const getToday = cache(async () => {
  await connection();
  const { timezone } = await getSettings();
  return dayIn(timezone);
});

/** Header/dashboard numbers for one user. */
export const getStats = cache(async (userId: number) => {
  await connection();
  const settings = await getSettings();
  const today = await getToday();
  const [days, learnedRows, dueRows, weekRows] = await Promise.all([
    activeDays(userId),
    db
      .select({ kind: items.kind, n: count() })
      .from(progress)
      .innerJoin(items, eq(items.id, progress.itemId))
      .where(eq(progress.userId, userId))
      .groupBy(items.kind),
    db
      .select({ kind: items.kind, n: count() })
      .from(progress)
      .innerJoin(items, eq(items.id, progress.itemId))
      .where(and(eq(progress.userId, userId), lte(progress.dueAt, new Date())))
      .groupBy(items.kind),
    db
      .select()
      .from(activity)
      .where(and(eq(activity.userId, userId), sql`${activity.day} > ${addDays(today, -7)}`)),
  ]);
  const { streak, activeToday } = computeStreak(days, today, addDays(today, -1));
  const learned = Object.fromEntries(learnedRows.map((r) => [r.kind, r.n])) as Partial<Record<ItemKind, number>>;
  const due = Object.fromEntries(dueRows.map((r) => [r.kind, r.n])) as Partial<Record<ItemKind, number>>;
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(today, i - 6);
    const row = weekRows.find((r) => r.day === day);
    return { day, learned: row?.learned ?? 0, reviewed: row?.reviewed ?? 0 };
  });
  const total = Object.values(learned).reduce((a, b) => a + (b ?? 0), 0);
  return {
    today,
    streak,
    activeToday,
    tier: streakTier(streak),
    learned,
    total,
    due,
    dueTotal: Object.values(due).reduce((a, b) => a + (b ?? 0), 0),
    week,
    ranks: {
      zh: rankFor(learned.zh_word ?? 0, settings.rankScales.zh),
      en: rankFor(learned.en_word ?? 0, settings.rankScales.en),
    },
    nextMilestone: settings.milestones.find((m) => m > total) ?? null,
  };
});

/** Today's set: items learned today plus the next unlearned ones, up to the daily quota. */
export async function getDailyItems(userId: number, kind: ItemKind) {
  const settings = await getSettings();
  const today = await getToday();
  const quota = settings.daily[kind];
  const learnedToday = flatten(
    await withStatus(userId)
      .where(and(eq(items.kind, kind), eq(progress.learnedOn, today)))
      .orderBy(LEVEL_ORDER, asc(items.sortOrder), asc(items.id)),
  );
  const remaining = Math.max(0, quota - learnedToday.length);
  const upcoming = remaining
    ? flatten(
        await withStatus(userId)
          .where(and(eq(items.kind, kind), isNull(progress.itemId)))
          .orderBy(LEVEL_ORDER, asc(items.sortOrder), asc(items.id))
          .limit(remaining),
      )
    : [];
  return { quota, done: learnedToday.length, items: [...learnedToday, ...upcoming] };
}

export type BrowseFilter = {
  kind: ItemKind;
  level?: string;
  topic?: string;
  letter?: string;
  q?: string;
  status?: "learned" | "new";
  page?: number;
};

export const PAGE_SIZE = 24;

export async function browseItems(userId: number, f: BrowseFilter) {
  const where: SQL[] = [eq(items.kind, f.kind)];
  if (f.level) where.push(eq(items.level, f.level));
  if (f.topic) where.push(eq(items.topic, f.topic));
  if (f.letter) where.push(eq(items.letter, f.letter));
  if (f.q) {
    const like = `%${f.q}%`;
    where.push(or(ilike(items.term, like), ilike(items.meaning, like), ilike(items.reading, like))!);
  }
  if (f.status === "learned") where.push(sql`${progress.itemId} is not null`);
  if (f.status === "new") where.push(isNull(progress.itemId));
  const page = Math.max(1, f.page ?? 1);
  const [rows, [{ n }]] = await Promise.all([
    withStatus(userId)
      .where(and(...where))
      .orderBy(LEVEL_ORDER, asc(items.sortOrder), asc(items.id))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db
      .select({ n: count() })
      .from(items)
      .leftJoin(progress, and(eq(progress.itemId, items.id), eq(progress.userId, userId)))
      .where(and(...where)),
  ]);
  return { items: flatten(rows), total: n, page, pages: Math.max(1, Math.ceil(n / PAGE_SIZE)) };
}

export async function getFacets(kind: ItemKind) {
  const [topics, letters, levels] = await Promise.all([
    db
      .selectDistinct({ v: items.topic })
      .from(items)
      .where(and(eq(items.kind, kind), sql`${items.topic} is not null and ${items.topic} <> ''`))
      .orderBy(asc(items.topic)),
    db.selectDistinct({ v: items.letter }).from(items).where(eq(items.kind, kind)).orderBy(asc(items.letter)),
    db.selectDistinct({ v: items.level }).from(items).where(eq(items.kind, kind)),
  ]);
  return {
    topics: topics.map((t) => t.v!).filter(Boolean),
    letters: letters.map((t) => t.v!).filter(Boolean),
    levels: levels.map((t) => t.v!).filter(Boolean),
  };
}

/** Learned items grouped by the day they were learned. */
export async function getHistory(userId: number, kinds: ItemKind[], limitDays = 30) {
  const rows = await db
    .select({ item: items, learnedOn: progress.learnedOn, priority: progress.priority })
    .from(progress)
    .innerJoin(items, eq(items.id, progress.itemId))
    .where(and(eq(progress.userId, userId), sql`${items.kind} in ${kinds}`))
    .orderBy(desc(progress.learnedOn), asc(items.id))
    .limit(1000);
  const groups = new Map<string, ItemWithStatus[]>();
  for (const r of flatten(rows)) {
    const list = groups.get(r.learnedOn!) ?? [];
    list.push(r);
    groups.set(r.learnedOn!, list);
  }
  return [...groups.entries()].slice(0, limitDays).map(([day, list]) => ({ day, items: list }));
}

/* ---------- Practice data ---------- */

export type QuizQuestion = {
  id: number;
  kind: ItemKind;
  term: string;
  reading: string | null;
  meaning: string;
  pos: string | null;
  prepositions: string | null;
  priority: boolean;
  example: { text: string; reading?: string; translation: string } | null;
  choices: string[];
};

async function distractorPool(kind: ItemKind, size: number) {
  return db
    .select({ id: items.id, term: items.term, meaning: items.meaning })
    .from(items)
    .where(eq(items.kind, kind))
    .orderBy(sql`random()`)
    .limit(size);
}

async function toQuestions(rows: ItemWithStatus[], field: "meaning" | "term"): Promise<QuizQuestion[]> {
  const kinds = [...new Set(rows.map((r) => r.kind))];
  const pools = new Map(await Promise.all(kinds.map(async (k) => [k, await distractorPool(k, 60)] as const)));
  return rows.map((r) => {
    const pool = (pools.get(r.kind) ?? []).filter((p) => p.id !== r.id && p[field] !== r[field]);
    const wrong = [...new Set(shuffle(pool).map((p) => p[field]))].slice(0, 3);
    return {
      id: r.id,
      kind: r.kind,
      term: r.term,
      reading: r.reading,
      meaning: r.meaning,
      pos: r.pos,
      prepositions: r.prepositions,
      priority: r.priority,
      example: r.examples[0] ?? null,
      choices: shuffle([r[field], ...wrong]),
    };
  });
}

/** Due reviews, wrong answers first. */
export async function getReviewQuestions(userId: number, lang?: Lang, anyLearned = false) {
  await connection();
  const settings = await getSettings();
  const where: SQL[] = anyLearned ? [] : [lte(progress.dueAt, new Date())];
  if (lang) where.push(sql`${items.kind} in ${[LANGS[lang].wordKind, LANGS[lang].extraKind]}`);
  const rows = flatten(
    await db
      .select({ item: items, learnedOn: progress.learnedOn, priority: progress.priority })
      .from(progress)
      .innerJoin(items, eq(items.id, progress.itemId))
      .where(and(eq(progress.userId, userId), ...where))
      .orderBy(desc(progress.priority), anyLearned ? sql`random()` : asc(progress.dueAt))
      .limit(settings.reviewBatch),
  );
  return toQuestions(rows, "meaning");
}

export type PracticeSource = "today" | "learned" | "mistakes" | "level";

export async function getPracticeItems(
  userId: number,
  lang: Lang,
  source: PracticeSource,
  opts: { level?: string; limit?: number } = {},
) {
  const kind = LANGS[lang].wordKind;
  const limit = opts.limit ?? 20;
  if (source === "today") {
    const { items: list } = await getDailyItems(userId, kind);
    return shuffle(list);
  }
  const where: SQL[] = [eq(items.kind, kind)];
  if (source === "learned") where.push(sql`${progress.itemId} is not null`);
  if (source === "mistakes") where.push(sql`(${progress.priority} or ${progress.wrongCount} > 0)`);
  if (source === "level" && opts.level) where.push(eq(items.level, opts.level));
  return flatten(
    await withStatus(userId)
      .where(and(...where))
      .orderBy(source === "mistakes" ? desc(progress.priority) : sql`random()`, sql`random()`)
      .limit(limit),
  );
}

export async function getFlashcards(userId: number, lang: Lang, source: PracticeSource, level?: string) {
  const list = await getPracticeItems(userId, lang, source, { level, limit: 30 });
  return toQuestions(list, "meaning");
}

export type ClozeQuestion = {
  id: number;
  term: string;
  reading: string | null;
  meaning: string;
  before: string;
  answer: string;
  after: string;
  sentenceReading: string | null;
  translation: string;
  choices: string[];
};

/** Fill-in-the-blank questions from example sentences of learned words. */
export async function getClozeQuestions(userId: number, lang: Lang, source: PracticeSource, level?: string) {
  const list = (await getPracticeItems(userId, lang, source, { level, limit: 40 })).filter(
    (i) => i.examples.length > 0,
  );
  const pool = await distractorPool(LANGS[lang].wordKind, 80);
  const out: ClozeQuestion[] = [];
  for (const item of list) {
    const ex = shuffle(item.examples).find((e) => findTarget(e.text, item.term));
    if (!ex) continue;
    const t = findTarget(ex.text, item.term)!;
    const wrong = [...new Set(shuffle(pool.filter((p) => p.id !== item.id && p.term !== item.term)).map((p) => p.term))].slice(0, 3);
    out.push({
      id: item.id,
      term: item.term,
      reading: item.reading,
      meaning: item.meaning,
      before: t.before,
      answer: t.target,
      after: t.after,
      sentenceReading: ex.reading ?? null,
      translation: ex.translation,
      choices: shuffle([item.term, ...wrong]),
    });
    if (out.length >= 15) break;
  }
  return out;
}

export async function countItems(kind: ItemKind) {
  const [{ n }] = await db.select({ n: count() }).from(items).where(eq(items.kind, kind));
  return n;
}
