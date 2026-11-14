/**
 * Seeds the admin account and starter content. Safe to re-run: existing users are kept
 * and items are skipped when the same term already exists for that kind.
 *
 *   npm run db:seed
 *   ADMIN_NAME="Admin" ADMIN_PASSWORD="..." npm run db:seed
 */
import { randomBytes } from "node:crypto";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const bcrypt = (await import("bcryptjs")).default;
  const { eq } = await import("drizzle-orm");
  const { db, schema } = await import("./index");
  const { letterOf } = await import("../lib/text");
  const { ZH_WORDS } = await import("./seed-data/zh-words");
  const { ZH_PHRASES } = await import("./seed-data/zh-phrases");
  const { EN_WORDS } = await import("./seed-data/en-words");
  const { EN_IDIOMS } = await import("./seed-data/en-idioms");
  type NewItem = typeof schema.items.$inferInsert;

  // ----- Admin -----
  const existingUsers = await db.select({ id: schema.users.id }).from(schema.users).limit(1);
  if (existingUsers.length === 0) {
    const name = process.env.ADMIN_NAME || "Admin";
    const password = process.env.ADMIN_PASSWORD || randomBytes(6).toString("base64url");
    await db.insert(schema.users).values({ name, role: "admin", passwordHash: await bcrypt.hash(password, 10) });
    console.log(`\nCreated admin account\n  name:     ${name}\n  password: ${password}\n  (change it after logging in)\n`);
  } else {
    console.log("Users already exist, skipping admin creation.");
  }

  // ----- Items -----
  const items: NewItem[] = [
    ...ZH_WORDS.map(([term, reading, meaning, level, topic, pos, ex], i) => ({
      kind: "zh_word" as const,
      term,
      reading,
      meaning,
      level,
      topic,
      pos,
      examples: ex.map(([text, r, translation]) => ({ text, reading: r, translation })),
      sortOrder: i,
    })),
    ...ZH_PHRASES.map(([term, reading, meaning, topic, note], i) => ({
      kind: "zh_phrase" as const,
      term,
      reading,
      meaning,
      topic,
      note,
      pos: "câu",
      sortOrder: i,
    })),
    ...EN_WORDS.map(([term, reading, meaning, level, topic, pos, preps, ex], i) => ({
      kind: "en_word" as const,
      term,
      reading,
      meaning,
      level,
      topic,
      pos,
      prepositions: preps || null,
      examples: ex.map(([text, translation]) => ({ text, translation })),
      sortOrder: i,
    })),
    ...EN_IDIOMS.map(([term, meaning, topic, note, ex], i) => ({
      kind: "en_idiom" as const,
      term,
      meaning,
      topic,
      note,
      pos: "idiom",
      examples: ex.map(([text, translation]) => ({ text, translation })),
      sortOrder: i,
    })),
  ].map((it: NewItem) => ({ ...it, letter: letterOf(it.term, it.reading) }));

  let added = 0;
  for (const kind of ["zh_word", "zh_phrase", "en_word", "en_idiom"] as const) {
    const existing = new Set(
      (await db.select({ term: schema.items.term }).from(schema.items).where(eq(schema.items.kind, kind))).map((r) => r.term),
    );
    const fresh = items.filter((it) => it.kind === kind && !existing.has(it.term));
    if (fresh.length) await db.insert(schema.items).values(fresh);
    added += fresh.length;
    console.log(`${kind}: +${fresh.length} (had ${existing.size})`);
  }
  console.log(`Done. ${added} items added.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
