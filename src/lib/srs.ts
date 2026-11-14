import type { Progress } from "@/db/schema";

const MIN = 60_000;
const DAY = 86_400_000;

type SrsState = Pick<
  Progress,
  "intervalDays" | "ease" | "reps" | "lapses" | "wrongCount" | "correctStreak" | "priority"
>;

export const FRESH: SrsState = {
  intervalDays: 0,
  ease: 2.5,
  reps: 0,
  lapses: 0,
  wrongCount: 0,
  correctStreak: 0,
  priority: false,
};

/**
 * Simplified SM-2. A wrong answer brings the item back in 10 minutes and keeps it
 * prioritised until it is answered correctly twice in a row.
 */
export function schedule(prev: SrsState, correct: boolean, now = new Date()) {
  if (!correct) {
    return {
      intervalDays: 0,
      ease: Math.max(1.3, prev.ease - 0.2),
      reps: 0,
      lapses: prev.lapses + 1,
      wrongCount: prev.wrongCount + 1,
      correctStreak: 0,
      priority: true,
      dueAt: new Date(now.getTime() + 10 * MIN),
      lastReviewedAt: now,
    };
  }
  const reps = prev.reps + 1;
  const intervalDays =
    reps === 1 ? 1 : reps === 2 ? 3 : Math.round(Math.max(prev.intervalDays, 1) * prev.ease);
  const correctStreak = prev.correctStreak + 1;
  return {
    intervalDays,
    ease: Math.min(3, prev.ease + 0.05),
    reps,
    lapses: prev.lapses,
    wrongCount: prev.wrongCount,
    correctStreak,
    priority: prev.priority && correctStreak < 2,
    dueAt: new Date(now.getTime() + intervalDays * DAY),
    lastReviewedAt: now,
  };
}

/** Newly learned items are first reviewed the next day. */
export function firstDue(now = new Date()) {
  return new Date(now.getTime() + DAY);
}
