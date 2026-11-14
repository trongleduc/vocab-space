import {
  boolean,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  real,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { ITEM_KINDS, type ItemKind } from "@/lib/kinds";

export { ITEM_KINDS, type ItemKind };

export type Example = {
  /** Sentence. Wrap the target word in [brackets] so it can be highlighted and blanked out. */
  text: string;
  /** Pinyin for Chinese, optional for English. */
  reading?: string;
  /** Vietnamese translation. */
  translation: string;
};

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "member"] }).notNull().default("member"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    /** sha256 of the cookie token. */
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const items = pgTable(
  "items",
  {
    id: serial("id").primaryKey(),
    kind: text("kind", { enum: ITEM_KINDS }).notNull(),
    term: text("term").notNull(),
    /** Pinyin (Chinese) or IPA (English). */
    reading: text("reading"),
    /** Vietnamese meaning. */
    meaning: text("meaning").notNull(),
    /** HSK1..HSK6, HSK7-9 for Chinese; B1..C2 for English. */
    level: text("level"),
    topic: text("topic"),
    pos: text("pos"),
    /** English only: prepositions/collocations that go with the word, separated by ";". */
    prepositions: text("prepositions"),
    /** Usage note, e.g. when a daily phrase is appropriate. */
    note: text("note"),
    examples: jsonb("examples").$type<Example[]>().notNull().default([]),
    /** First letter used for A–Z browsing (pinyin without tones for Chinese). */
    letter: text("letter"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("items_kind_level_idx").on(t.kind, t.level, t.sortOrder),
    index("items_kind_topic_idx").on(t.kind, t.topic),
    index("items_kind_letter_idx").on(t.kind, t.letter),
  ],
);

export const progress = pgTable(
  "progress",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: integer("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    /** Local day (settings timezone) the item was first learned. */
    learnedOn: date("learned_on", { mode: "string" }).notNull(),
    intervalDays: real("interval_days").notNull().default(0),
    ease: real("ease").notNull().default(2.5),
    reps: integer("reps").notNull().default(0),
    lapses: integer("lapses").notNull().default(0),
    wrongCount: integer("wrong_count").notNull().default(0),
    correctStreak: integer("correct_streak").notNull().default(0),
    /** Set after a wrong answer; prioritised in reviews until answered right twice in a row. */
    priority: boolean("priority").notNull().default(false),
    dueAt: timestamp("due_at", { withTimezone: true }).notNull(),
    lastReviewedAt: timestamp("last_reviewed_at", { withTimezone: true }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemId] }),
    index("progress_user_due_idx").on(t.userId, t.dueAt),
    index("progress_user_learned_idx").on(t.userId, t.learnedOn),
  ],
);

export const activity = pgTable(
  "activity",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    day: date("day", { mode: "string" }).notNull(),
    learned: integer("learned").notNull().default(0),
    reviewed: integer("reviewed").notNull().default(0),
    correct: integer("correct").notNull().default(0),
    wrong: integer("wrong").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.day] })],
);

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

export type User = typeof users.$inferSelect;
export type Item = typeof items.$inferSelect;
export type Progress = typeof progress.$inferSelect;
