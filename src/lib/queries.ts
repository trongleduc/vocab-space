import "server-only";
import { and, asc, count, desc, eq, ilike, isNull, lte, or, sql, type SQL } from "drizzle-orm";
import { connection } from "next/server";
import { cache } from "react";
import { db, schema } from "@/db";
import type { Item, ItemKind } from "@/db/schema";
import { addDays, dayIn } from "./dates";
import { rankFor, streakTier } from "./gamification";
import type { SessionUser } from "./auth";
import { kindsOf, LANG_CODES, LANGS, levelRank, type Lang } from "./langs";
import { streakState } from "./progress";
import { getSettings, quotaFor } from "./settings";
import { familyPrefix, grammarCloze } from "./en-grammar";
import { findTarget, shuffle } from "./text";

const { items, progress, activity } = schema;

/** What the read models need to know about the member: who they are and their own quotas. */
type Learner = Pick<SessionUser, "id" | "daily">;

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

/** Easy → hard within one kind: HSK1..7-9, B1..C2, TOPIK1..6, N5..N1. */
export const LEVEL_ORDER = sql`case
  when ${items.level} ~ '^HSK[0-9]' then substring(${items.level} from 4 for 1)::int
  when ${items.level} ~ '^TOPIK[1-6]$' then substring(${items.level} from 6 for 1)::int
  when ${items.level} ~ '^N[1-5]$' then 6 - substring(${items.level} from 2 for 1)::int
  when ${items.level} = 'B1' then 1 when ${items.level} = 'B2' then 2
  when ${items.level} = 'C1' then 3 when ${items.level} = 'C2' then 4
  else 99 end`;

export const getToday = cache(async () => {
  await connection();
  const { timezone } = await getSettings();
  return dayIn(timezone);
});

/**
 * Header/dashboard numbers for the signed-in user. Due counts only cover the languages the
 * user is learning; learned totals and ranks cover everything, so turning a language off
 * never takes away progress.
 */
export const getStats = cache(async (user: SessionUser) => {
  await connection();
  const userId = user.id;
  const settings = await getSettings();
  const today = await getToday();
  const [streakInfo, learnedRows, dueRows, weekRows] = await Promise.all([
    streakState(userId, today),
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
  const { streak, activeToday, freezes, toNextFreeze, lost } = streakInfo;
  const learned = Object.fromEntries(learnedRows.map((r) => [r.kind, r.n])) as Partial<Record<ItemKind, number>>;
  const due = Object.fromEntries(dueRows.map((r) => [r.kind, r.n])) as Partial<Record<ItemKind, number>>;
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(today, i - 6);
    const row = weekRows.find((r) => r.day === day);
    return { day, learned: row?.learned ?? 0, reviewed: row?.reviewed ?? 0 };
  });
  const total = Object.values(learned).reduce((a, b) => a + (b ?? 0), 0);
  const ranks = Object.fromEntries(
    LANG_CODES.map((l) => [l, rankFor(learned[LANGS[l].wordKind] ?? 0, settings.rankScales[l])]),
  ) as Record<Lang, ReturnType<typeof rankFor>>;
  return {
    today,
    streak,
    activeToday,
    freezes,
    toNextFreeze,
    lost,
    tier: streakTier(streak),
    learned,
    total,
    due,
    dueTotal: kindsOf(user.langs).reduce((a, k) => a + (due[k] ?? 0), 0),
    week,
    ranks,
    nextMilestone: settings.milestones.find((m) => m > total) ?? null,
  };
});

/**
 * Today's set: items learned today plus the next unlearned ones, up to the daily quota.
 * The set is returned in curriculum order, not grouped by status, so marking or unmarking
 * an item never moves it (marking one swaps nothing in or out of the set).
 */
export async function getDailyItems(user: Learner, kind: ItemKind) {
  const userId = user.id;
  const settings = await getSettings();
  const today = await getToday();
  const quota = quotaFor(settings, user.daily, kind);
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
  const list = [...learnedToday, ...upcoming].sort(
    (a, b) => levelRank(a.kind, a.level) - levelRank(b.kind, b.level) || a.sortOrder - b.sortOrder || a.id - b.id,
  );
  return { quota, done: learnedToday.length, items: list };
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

/** Due reviews from the given languages, wrong answers first. */
export async function getReviewQuestions(userId: number, langs: Lang[], anyLearned = false) {
  await connection();
  const settings = await getSettings();
  if (!langs.length) return [];
  const where: SQL[] = anyLearned ? [] : [lte(progress.dueAt, new Date())];
  where.push(sql`${items.kind} in ${kindsOf(langs)}`);
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
  user: Learner,
  lang: Lang,
  source: PracticeSource,
  opts: { level?: string; limit?: number } = {},
) {
  const kind = LANGS[lang].wordKind;
  const limit = opts.limit ?? 20;
  if (source === "today") {
    const { items: list } = await getDailyItems(user, kind);
    return shuffle(list);
  }
  const where: SQL[] = [eq(items.kind, kind)];
  if (source === "learned") where.push(sql`${progress.itemId} is not null`);
  if (source === "mistakes") where.push(sql`(${progress.priority} or ${progress.wrongCount} > 0)`);
  if (source === "level" && opts.level) where.push(eq(items.level, opts.level));
  return flatten(
    await withStatus(user.id)
      .where(and(...where))
      .orderBy(source === "mistakes" ? desc(progress.priority) : sql`random()`, sql`random()`)
      .limit(limit),
  );
}

export async function getFlashcards(user: Learner, lang: Lang, source: PracticeSource, level?: string) {
  const list = await getPracticeItems(user, lang, source, { level, limit: 30 });
  return toQuestions(list, "meaning");
}

export type ClozeQuestion = {
  id: number;
  term: string;
  reading: string | null;
  meaning: string;
  before: string;
  /** Text revealed in the blank. */
  answer: string;
  after: string;
  sentenceReading: string | null;
  translation: string;
  choices: string[];
  /** The choice that is right (the dictionary form in "term" mode, the blank text in "grammar" mode). */
  correct: string;
  /** Instruction line above the sentence. */
  prompt: string;
  /** Grammar note shown after answering. */
  explain: string | null;
  /** Collocations of the word ("arrive at (a place); arrive in (a city)"). */
  pattern: string | null;
};

/** Fill-in-the-blank questions from example sentences of learned words. */
export async function getClozeQuestions(user: Learner, lang: Lang, source: PracticeSource, level?: string) {
  const cfg = LANGS[lang];
  const list = (await getPracticeItems(user, lang, source, { level, limit: 40 })).filter(
    (i) => i.examples.length > 0,
  );
  const picked: { item: ItemWithStatus; ex: Item["examples"][number]; t: NonNullable<ReturnType<typeof findTarget>> }[] = [];
  for (const item of list) {
    const ex = shuffle(item.examples).find((e) => findTarget(e.text, item.term));
    if (!ex) continue;
    picked.push({ item, ex, t: findTarget(ex.text, item.term)! });
    if (picked.length >= 15) break;
  }
  const base = ({ item, ex }: (typeof picked)[number]) => ({
    id: item.id,
    term: item.term,
    reading: item.reading,
    meaning: item.meaning,
    sentenceReading: ex.reading ?? null,
    translation: ex.translation,
    pattern: item.prepositions,
  });

  if (cfg.cloze === "grammar") {
    const prefixes = [
      ...new Set(picked.map((p) => familyPrefix(p.item.term)?.replace(/[%_\\]/g, "")).filter((p): p is string => !!p)),
    ];
    const [pool, family] = await Promise.all([
      db
        .select({ term: items.term, reading: items.reading, pos: items.pos })
        .from(items)
        .where(eq(items.kind, cfg.wordKind))
        .orderBy(sql`random()`)
        .limit(200),
      prefixes.length
        ? db
            .select({ term: items.term, pos: items.pos })
            .from(items)
            .where(and(eq(items.kind, cfg.wordKind), or(...prefixes.map((p) => ilike(items.term, `${p}%`)))))
        : Promise.resolve([]),
    ]);
    return picked.map((p): ClozeQuestion => {
      const g = grammarCloze(p.item, { before: p.t.before, target: p.t.target, after: p.t.after }, pool, family);
      return { ...base(p), ...g, correct: g.answer };
    });
  }

  const pool = await distractorPool(cfg.wordKind, 80);
  return picked.map((p): ClozeQuestion => {
    const { item, t } = p;
    const wrong = [...new Set(shuffle(pool.filter((x) => x.id !== item.id && x.term !== item.term)).map((x) => x.term))].slice(0, 3);
    return {
      ...base(p),
      pattern: null,
      before: t.before,
      answer: t.target,
      after: t.after,
      choices: shuffle([item.term, ...wrong]),
      correct: item.term,
      prompt: "Điền từ phù hợp vào chỗ trống",
      explain: null,
    };
  });
}

export async function countItems(kind: ItemKind) {
  const [{ n }] = await db.select({ n: count() }).from(items).where(eq(items.kind, kind));
  return n;
}
