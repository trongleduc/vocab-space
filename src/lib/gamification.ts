import { addDays } from "./dates";
import type { Lang } from "./langs";

/* ---------- Streak colour tiers ---------- */

export type StreakTier = { min: number; name: string };

/** Accent colour tiers of the whole UI (colours live in globals.css, keyed by data-tier). Tier 0 is black/white. */
export const STREAK_TIERS: StreakTier[] = [
  { min: 0, name: "Đen trắng" },
  { min: 2, name: "Đốm lửa" },
  { min: 7, name: "Lửa cam" },
  { min: 14, name: "Lửa đỏ" },
  { min: 30, name: "Lửa hồng" },
  { min: 60, name: "Lửa tím" },
  { min: 100, name: "Lửa xanh" },
];

export function streakTier(streak: number) {
  let index = 0;
  STREAK_TIERS.forEach((t, i) => {
    if (streak >= t.min) index = i;
  });
  return { index, ...STREAK_TIERS[index], next: STREAK_TIERS[index + 1] ?? null };
}

/** Every this many active days in one chain earns one streak freeze. */
export const FREEZE_EVERY = 20;
/** Days after a streak is lost during which the member can still spend a freeze to bring it back. */
export const RESTORE_WINDOW = 3;

/** One use of a freeze: the day it was used and the missed days it bridged. */
export type StreakSave = { on: string; days: string[] };

export type StreakState = {
  /** Active days in the current chain. Bridged days keep a chain together but do not count. */
  streak: number;
  activeToday: boolean;
  /** Freezes earned so far minus those used. Earned freezes survive a broken chain. */
  freezes: number;
  /** Active days still needed in the current chain for the next freeze. */
  toNextFreeze: number;
  /** The most recently lost chain while it can still be restored, with the missed days a freeze would bridge. */
  lost: { streak: number; days: string[]; deadline: string; daysLeft: number } | null;
};

const dayNumber = (day: string) => Date.parse(`${day}T00:00:00Z`) / 86_400_000;

function dayRange(from: string, to: string) {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}

export function normalizeSaves(raw: unknown): StreakSave[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((s) =>
    s && typeof s === "object" && typeof s.on === "string" && Array.isArray(s.days)
      ? [{ on: s.on, days: s.days.filter((d: unknown): d is string => typeof d === "string") }]
      : [],
  );
}

/**
 * Streak replayed from the activity history plus the days bridged by freezes the member chose
 * to use. A chain earns one freeze for every FREEZE_EVERY active days. Freezes are never spent
 * automatically: when a chain breaks, the member has RESTORE_WINDOW days (counted from the day
 * it was lost) to spend one, which bridges the missed days and joins the lost chain to whatever
 * came after it. Today does not count as missed until it is over.
 */
export function computeStreak(activeDays: string[], today: string, saves: StreakSave[] = []): StreakState {
  const active = new Set(activeDays.filter((d) => d <= today));
  const bridged = saves.flatMap((s) => s.days).filter((d) => d < today);
  const days = [...new Set([...active, ...bridged])].sort();

  let streak = 0;
  let earned = 0;
  let prev: string | null = null;
  let broken: { end: string; streak: number } | null = null;
  for (const day of days) {
    if (prev && dayNumber(day) - dayNumber(prev) > 1) {
      broken = { end: prev, streak };
      streak = 0;
    }
    if (active.has(day)) {
      streak++;
      if (streak % FREEZE_EVERY === 0) earned++;
    }
    prev = day;
  }
  if (prev && dayNumber(today) - dayNumber(prev) > 1) {
    broken = { end: prev, streak };
    streak = 0;
  }

  let lost: StreakState["lost"] = null;
  if (broken && broken.streak > 0) {
    const firstMissed = addDays(broken.end, 1);
    // Lost once the first missed day is over; restorable on that day and the two after it.
    const deadline = addDays(firstMissed, RESTORE_WINDOW);
    if (today <= deadline) {
      const next = days.find((d) => d > broken.end);
      lost = {
        streak: broken.streak,
        days: dayRange(firstMissed, addDays(next ?? today, -1)),
        deadline,
        daysLeft: dayNumber(deadline) - dayNumber(today) + 1,
      };
    }
  }

  return {
    streak,
    activeToday: active.has(today),
    freezes: Math.max(0, earned - saves.length),
    toNextFreeze: FREEZE_EVERY - (streak % FREEZE_EVERY),
    lost,
  };
}

/* ---------- Knight ranks (HSK 3.0 / CEFR) ---------- */

export type Rank = {
  index: number;
  title: string;
  level: string;
  metal: string;
  color: string;
  learned: number;
  floor: number;
  nextAt: number | null;
  nextLevel: string | null;
};

export const KNIGHT_TITLES = [
  { title: "Lính mới", metal: "Gỗ", color: "#8a7f72" },
  { title: "Hiệp sĩ tập sự", metal: "Sắt", color: "#6b7785" },
  { title: "Hiệp sĩ đồng", metal: "Đồng", color: "#b0703c" },
  { title: "Hiệp sĩ bạc", metal: "Bạc", color: "#9aa5b1" },
  { title: "Hiệp sĩ vàng", metal: "Vàng", color: "#d4a017" },
  { title: "Hiệp sĩ bạch kim", metal: "Bạch kim", color: "#3fb4b4" },
  { title: "Hiệp sĩ kim cương", metal: "Kim cương", color: "#4c8df6" },
  { title: "Hiệp sĩ huyền thoại", metal: "Huyền thoại", color: "#e8590c" },
];

export type RankScale = { level: string; words: number }[];

/**
 * Cumulative vocabulary needed per level. HSK 3.0 numbers are the official word counts
 * (GF0025-2021). CEFR, TOPIK and JLPT publish no official word lists, so those are commonly
 * cited estimates (JLPT follows the old test specification: 800 / 1,500 / 6,000 / 10,000,
 * with N3 in between). Admins can override all of them in settings.
 */
export const DEFAULT_RANK_SCALES: Record<Lang, RankScale> = {
  zh: [
    { level: "HSK1", words: 500 },
    { level: "HSK2", words: 1272 },
    { level: "HSK3", words: 2245 },
    { level: "HSK4", words: 3245 },
    { level: "HSK5", words: 4316 },
    { level: "HSK6", words: 5456 },
    { level: "HSK7-9", words: 11092 },
  ],
  en: [
    { level: "B1", words: 400 },
    { level: "B1+", words: 1000 },
    { level: "B2", words: 2000 },
    { level: "B2+", words: 3000 },
    { level: "C1", words: 4500 },
    { level: "C1+", words: 6000 },
    { level: "C2", words: 8000 },
  ],
  ko: [
    { level: "TOPIK1", words: 800 },
    { level: "TOPIK2", words: 2000 },
    { level: "TOPIK3", words: 3500 },
    { level: "TOPIK4", words: 5000 },
    { level: "TOPIK5", words: 6500 },
    { level: "TOPIK6", words: 8000 },
  ],
  ja: [
    { level: "N5", words: 800 },
    { level: "N4", words: 1500 },
    { level: "N3", words: 3750 },
    { level: "N2", words: 6000 },
    { level: "N1", words: 10000 },
  ],
};

export function rankFor(learned: number, scale: RankScale): Rank {
  let reached = 0;
  scale.forEach((s, i) => {
    if (learned >= s.words) reached = i + 1;
  });
  const index = scale.length
    ? Math.round((reached / scale.length) * (KNIGHT_TITLES.length - 1))
    : 0;
  const t = KNIGHT_TITLES[index];
  const next = scale[reached] ?? null;
  return {
    index,
    title: t.title,
    metal: t.metal,
    color: t.color,
    level: reached === 0 ? "Chưa xếp hạng" : scale[reached - 1].level,
    learned,
    floor: reached === 0 ? 0 : scale[reached - 1].words,
    nextAt: next?.words ?? null,
    nextLevel: next?.level ?? null,
  };
}

/* ---------- Celebrations ---------- */

export type Celebration =
  | {
      type: "streak";
      days: number;
      tierUp?: { index: number; name: string };
      /** The member just spent a freeze to bring this streak back. */
      restored?: boolean;
      /** A new freeze was earned today. */
      earnedFreeze?: boolean;
      /** Freezes left after today. */
      freezes?: number;
    }
  | { type: "milestone"; count: number }
  | { type: "goal"; lang: Lang; count: number }
  | { type: "rank"; lang: Lang; level: string; title: string; color: string; index: number };

export function crossedMilestones(before: number, after: number, milestones: number[]) {
  return milestones.filter((m) => before < m && after >= m);
}
