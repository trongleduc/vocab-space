import { cacheLife, cacheTag } from "next/cache";
import { db, schema } from "@/db";
import { DEFAULT_RANK_SCALES, type RankScale } from "./gamification";
import type { ItemKind, Lang } from "./kinds";

export type DailyQuota = Record<ItemKind, number>;

export type AppSettings = {
  appName: string;
  timezone: string;
  daily: DailyQuota;
  reviewBatch: number;
  milestones: number[];
  rankScales: Record<Lang, RankScale>;
};

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "Vocab Space",
  timezone: "Asia/Ho_Chi_Minh",
  daily: {
    zh_word: 10,
    zh_phrase: 3,
    en_word: 10,
    en_idiom: 3,
    ko_word: 10,
    ko_phrase: 3,
    ja_word: 10,
    ja_phrase: 3,
  },
  reviewBatch: 10,
  milestones: [10, 50, 100, 250, 500, 1000, 2000, 3000, 5000, 10000],
  rankScales: DEFAULT_RANK_SCALES,
};

export async function getSettings(): Promise<AppSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag("settings");
  const rows = await db.select().from(schema.settings);
  const stored = Object.fromEntries(rows.map((r) => [r.key, r.value])) as Partial<AppSettings>;
  // Nested maps are merged so languages added later get their defaults.
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    daily: { ...DEFAULT_SETTINGS.daily, ...(stored.daily ?? {}) },
    rankScales: { ...DEFAULT_SETTINGS.rankScales, ...(stored.rankScales ?? {}) },
  };
}
