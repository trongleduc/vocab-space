/** Plain constants shared by the Drizzle schema and client code (no Drizzle import here). */

export const LANG_CODES = ["zh", "en", "ko", "ja"] as const;
export type Lang = (typeof LANG_CODES)[number];

/** Languages a member starts with. Existing accounts were created when only these existed. */
export const DEFAULT_LANGS: Lang[] = ["zh", "en"];

export const ITEM_KINDS = [
  "zh_word",
  "zh_phrase",
  "en_word",
  "en_idiom",
  "ko_word",
  "ko_phrase",
  "ja_word",
  "ja_phrase",
] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

/** Upper bound for any daily quota, personal or global. */
export const MAX_DAILY = 100;

/** A member's own daily quotas. Kinds that are not set use the admin default. */
export type DailyOverrides = Partial<Record<ItemKind, number>>;

/** Keep known kinds with whole numbers in 0..MAX_DAILY. */
export function normalizeDaily(raw: unknown): DailyOverrides {
  const src = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const out: DailyOverrides = {};
  for (const k of ITEM_KINDS) {
    const v = src[k];
    if (typeof v === "number" && Number.isFinite(v)) out[k] = Math.min(MAX_DAILY, Math.max(0, Math.round(v)));
  }
  return out;
}

export function isLang(v: unknown): v is Lang {
  return typeof v === "string" && (LANG_CODES as readonly string[]).includes(v);
}

/** Known languages from a stored value, in canonical order. Falls back to the defaults when empty. */
export function normalizeLangs(raw: unknown): Lang[] {
  const list = Array.isArray(raw) ? raw : [];
  const out = LANG_CODES.filter((l) => list.includes(l));
  return out.length ? out : [...DEFAULT_LANGS];
}
