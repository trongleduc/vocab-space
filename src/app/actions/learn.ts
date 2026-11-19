"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { db, schema } from "@/db";
import { requireUser } from "@/lib/auth";
import { ITEM_KINDS, normalizeDaily } from "@/lib/kinds";
import { isLang, LANG_CODES } from "@/lib/langs";
import { recordAnswers, recordLearned, restoreStreak, unlearnToday, type Answer } from "@/lib/progress";
import { getReviewQuestions } from "@/lib/queries";

export async function markLearned(itemIds: number[]) {
  const user = await requireUser();
  const ids = itemIds.filter((n) => Number.isInteger(n) && n > 0).slice(0, 200);
  const result = await recordLearned(user.id, ids);
  refresh();
  return result;
}

export async function unmarkLearned(itemId: number) {
  const user = await requireUser();
  await unlearnToday(user.id, itemId);
  refresh();
}

export async function submitAnswers(answers: Answer[]) {
  const user = await requireUser();
  const clean = answers
    .filter((a) => Number.isInteger(a.itemId) && a.itemId > 0)
    .map((a) => ({ itemId: a.itemId, correct: Boolean(a.correct) }))
    .slice(0, 200);
  const result = await recordAnswers(user.id, clean);
  refresh();
  return result;
}

/** Spend a streak freeze to bring back the most recently lost streak. */
export async function spendFreeze() {
  const user = await requireUser();
  const result = await restoreStreak(user.id);
  refresh();
  return result;
}

/**
 * Due reviews from one language, or from every language the user is learning;
 * with `anyLearned`, a random batch of learned items for extra practice.
 */
export async function fetchReview(lang?: string, anyLearned = false) {
  const user = await requireUser();
  return getReviewQuestions(user.id, lang && isLang(lang) ? [lang] : user.langs, anyLearned);
}

/** Turn languages on or off for the current user. At least one must stay on. */
export async function setLanguages(langs: string[]) {
  const user = await requireUser();
  const next = LANG_CODES.filter((l) => langs.includes(l));
  if (!next.length) return { error: "Cần bật ít nhất một ngôn ngữ." };
  await db.update(schema.users).set({ langs: next }).where(eq(schema.users.id, user.id));
  refresh();
  return { ok: true as const };
}

export async function enableLanguage(lang: string) {
  const user = await requireUser();
  if (!isLang(lang)) return;
  await setLanguages([...user.langs, lang]);
}

/**
 * Save the member's own daily quotas. A number sets that kind, null goes back to the admin
 * default, and kinds not mentioned keep their current value (e.g. languages that are off).
 */
export async function setDailyGoals(changes: Record<string, number | null>) {
  const user = await requireUser();
  const next: Record<string, unknown> = { ...user.daily };
  for (const k of ITEM_KINDS) {
    if (!(k in changes)) continue;
    const v = changes[k];
    if (v === null) delete next[k];
    else if (typeof v === "number" && Number.isFinite(v)) next[k] = v;
  }
  await db.update(schema.users).set({ daily: normalizeDaily(next) }).where(eq(schema.users.id, user.id));
  refresh();
  return { ok: true as const };
}
