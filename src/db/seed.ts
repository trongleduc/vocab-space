/**
 * Seeds the admin account and content. Safe to re-run: existing users are kept and items are
 * skipped when the same term already exists for that kind.
 *
 * Content: hand-written starter sets (with topics and examples) plus the full official lists in
 * seed-data/zh-hsk30.json (HSK 3.0, 11,092 words, Ministry of Education list via
 * github.com/ivankra/hsk30) and seed-data/en-cefr.json (CEFR B1–C2 from CEFR-J 1.5 and the Octanove
 * C1/C2 profile, CC BY-SA 4.0, via github.com/openlanguageprofiles/olp-en-cefrj) and
 * seed-data/ja-jlpt.json (JLPT N5–N1 from github.com/jamsinclair/open-anki-jlpt-decks, MIT; JLPT has
 * published no official list since 2010). Vietnamese meanings, IPA, Hán Việt readings and the
 * HSK 1–3 / B1 / N5–N4 examples in those files were machine-written; romaji was generated from kana. Hand-written
 * entries win over list entries with the same term. Existing Chinese words get their level synced
 * to the official HSK 3.0 level.
 *
 *   npm run db:seed
 *   ADMIN_NAME="Admin" ADMIN_PASSWORD="..." npm run db:seed
 */
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const bcrypt = (await import("bcryptjs")).default;
  const { eq, sql } = await import("drizzle-orm");
  const { db, schema } = await import("./index");
  const { letterOf } = await import("../lib/text");
  const { ZH_WORDS } = await import("./seed-data/zh-words");
  const { ZH_PHRASES } = await import("./seed-data/zh-phrases");
  const { EN_WORDS } = await import("./seed-data/en-words");
  const { EN_IDIOMS } = await import("./seed-data/en-idioms");
  const { KO_WORDS } = await import("./seed-data/ko-words");
  const { KO_PHRASES } = await import("./seed-data/ko-phrases");
  const { JA_WORDS } = await import("./seed-data/ja-words");
  const { JA_PHRASES } = await import("./seed-data/ja-phrases");
  const { ITEM_KINDS } = await import("../lib/kinds");
  type NewItem = typeof schema.items.$inferInsert;
  type ListRow = [string, string, string, string, string, string | null, string[] | null, number];
  const readList = (file: string) => {
    const path = join(process.cwd(), "src/db/seed-data", file);
    return existsSync(path) ? (JSON.parse(readFileSync(path, "utf8")) as ListRow[]) : [];
  };
  const ZH_HSK30 = readList("zh-hsk30.json");
  const EN_CEFR = readList("en-cefr.json");
  const JA_JLPT = readList("ja-jlpt.json");
  /** List entries come after the hand-written ones within a level. */
  const LIST_ORDER = 10_000;

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
    ...ZH_PHRASES.map(([term, reading, meaning, topic, note, ex], i) => ({
      kind: "zh_phrase" as const,
      term,
      reading,
      meaning,
      topic,
      note,
      pos: topic === "Thành ngữ" ? "thành ngữ" : "câu",
      examples: (ex ?? []).map(([text, r, translation]) => ({ text, reading: r, translation })),
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
    ...([
      ["ko", KO_WORDS],
      ["ja", JA_WORDS],
    ] as const).flatMap(([lang, rows]) =>
      rows.map(([term, reading, meaning, level, topic, pos, note, ex], i) => ({
        kind: `${lang}_word` as const,
        term,
        reading,
        meaning,
        level,
        topic,
        pos,
        note: note || null,
        examples: ex.map(([text, r, translation]) => ({ text, reading: r, translation })),
        sortOrder: i,
      })),
    ),
    ...([
      ["ko", KO_PHRASES],
      ["ja", JA_PHRASES],
    ] as const).flatMap(([lang, rows]) =>
      rows.map(([term, reading, meaning, topic, note, ex], i) => ({
        kind: `${lang}_phrase` as const,
        term,
        reading,
        meaning,
        topic,
        note: note || null,
        pos: topic === "Thành ngữ" ? "thành ngữ" : "câu",
        examples: (ex ?? []).map(([text, r, translation]) => ({ text, reading: r, translation })),
        sortOrder: i,
      })),
    ),
    // Rows with an empty meaning are words that were already hand-written; they only feed the level sync.
    ...ZH_HSK30.filter((r) => r[2]).map(([term, reading, meaning, level, pos, note, ex, order]) => ({
      kind: "zh_word" as const,
      term,
      reading,
      meaning,
      level,
      pos,
      note,
      examples: ex ? [{ text: ex[0], reading: ex[1], translation: ex[2] }] : [],
      sortOrder: LIST_ORDER + order,
    })),
    ...JA_JLPT.map(([term, reading, meaning, level, pos, note, ex, order]) => ({
      kind: "ja_word" as const,
      term,
      reading,
      meaning,
      level,
      pos,
      note,
      examples: ex ? [{ text: ex[0], reading: ex[1], translation: ex[2] }] : [],
      sortOrder: LIST_ORDER + order,
    })),
    ...EN_CEFR.map(([term, reading, meaning, level, pos, note, ex, order]) => ({
      kind: "en_word" as const,
      term,
      reading,
      meaning,
      level,
      pos,
      note,
      examples: ex ? [{ text: ex[0], translation: ex[1] }] : [],
      sortOrder: LIST_ORDER + order,
    })),
  ].map((it: NewItem) => ({ ...it, letter: letterOf(it.term, it.reading, it.kind.slice(0, 2)) }));

  // Terms compare case-insensitively ("Internet" = "internet"); the first occurrence wins.
  const key = (term: string) => term.toLowerCase();
  let added = 0;
  for (const kind of ITEM_KINDS) {
    const seen = new Set(
      (await db.select({ term: schema.items.term }).from(schema.items).where(eq(schema.items.kind, kind))).map((r) =>
        key(r.term),
      ),
    );
    const had = seen.size;
    const fresh = items.filter((it) => it.kind === kind && !seen.has(key(it.term)) && seen.add(key(it.term)));
    // Postgres caps one statement at 65,535 parameters; 500 rows stays far below it.
    for (let i = 0; i < fresh.length; i += 500) await db.insert(schema.items).values(fresh.slice(i, i + 500));
    added += fresh.length;
    console.log(`${kind}: +${fresh.length} (had ${had})`);
  }
  console.log(`Done. ${added} items added.`);

  // ----- Official HSK 3.0 levels for Chinese words that were added before the full list -----
  let synced = 0;
  for (let i = 0; i < ZH_HSK30.length; i += 1000) {
    const values = sql.join(
      ZH_HSK30.slice(i, i + 1000).map(([term, , , level]) => sql`(${term}, ${level})`),
      sql`, `,
    );
    const res = await db.execute(sql`
      update items set level = v.level
      from (values ${values}) as v(term, level)
      where items.kind = 'zh_word' and items.term = v.term and items.level is distinct from v.level
    `);
    synced += res.rowCount ?? 0;
  }
  console.log(`HSK 3.0 levels synced: ${synced} Chinese words updated.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
