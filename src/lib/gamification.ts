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

/** Consecutive active days ending today (or yesterday, if nothing has been done yet today). */
export function computeStreak(activeDays: string[], today: string, yesterday: string) {
  const set = new Set(activeDays);
  const activeToday = set.has(today);
  if (!activeToday && !set.has(yesterday)) return { streak: 0, activeToday };
  let streak = 0;
  const cursor = new Date(`${activeToday ? today : yesterday}T00:00:00Z`);
  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return { streak, activeToday };
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
  | { type: "streak"; days: number; tierUp?: { index: number; name: string } }
  | { type: "milestone"; count: number }
  | { type: "goal"; lang: Lang; count: number }
  | { type: "rank"; lang: Lang; level: string; title: string; color: string; index: number };

export function crossedMilestones(before: number, after: number, milestones: number[]) {
  return milestones.filter((m) => before < m && after >= m);
}
