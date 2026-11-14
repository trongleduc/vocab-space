"use server";

import { refresh } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isLang } from "@/lib/langs";
import { recordAnswers, recordLearned, unlearnToday, type Answer } from "@/lib/progress";
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

/** Due reviews; with `anyLearned`, a random batch of learned items for extra practice. */
export async function fetchReview(lang?: string, anyLearned = false) {
  const user = await requireUser();
  return getReviewQuestions(user.id, lang && isLang(lang) ? lang : undefined, anyLearned);
}
