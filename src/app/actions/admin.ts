"use server";

import bcrypt from "bcryptjs";
import { and, eq, ne } from "drizzle-orm";
import { refresh, updateTag } from "next/cache";
import { db, schema } from "@/db";
import { ITEM_KINDS, type Example, type ItemKind } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { AppSettings } from "@/lib/settings";
import { letterOf } from "@/lib/text";
import type { FormState } from "./auth";

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

/* ---------- Users ---------- */

export async function createUser(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = str(fd, "name");
  const password = str(fd, "password");
  const role = str(fd, "role") === "admin" ? "admin" : "member";
  if (!name) return { error: "Nhập tên thành viên." };
  if (password.length < 4) return { error: "Mật khẩu cần ít nhất 4 ký tự." };
  const exists = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.name, name));
  if (exists.length) return { error: "Tên này đã tồn tại." };
  await db.insert(schema.users).values({ name, role, passwordHash: await bcrypt.hash(password, 10) });
  refresh();
  return { ok: `Đã tạo tài khoản ${name}.` };
}

export async function resetPassword(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const password = str(fd, "password");
  if (password.length < 4) return { error: "Mật khẩu cần ít nhất 4 ký tự." };
  await db
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(password, 10) })
    .where(eq(schema.users.id, id));
  await db.delete(schema.sessions).where(eq(schema.sessions.userId, id));
  return { ok: "Đã đặt lại mật khẩu." };
}

export async function renameUser(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const name = str(fd, "name").replace(/\s+/g, " ");
  if (!name) return { error: "Tên không được để trống." };
  if (name.length > 40) return { error: "Tên tối đa 40 ký tự." };
  const [taken] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(and(eq(schema.users.name, name), ne(schema.users.id, id)))
    .limit(1);
  if (taken) return { error: "Tên này đã có người dùng." };
  await db.update(schema.users).set({ name }).where(eq(schema.users.id, id));
  refresh();
  return { ok: `Đã đổi tên thành ${name}.` };
}

export async function updateUser(id: number, patch: { active?: boolean; role?: "admin" | "member" }) {
  const me = await requireAdmin();
  if (id === me.id && (patch.active === false || patch.role === "member")) {
    throw new Error("Không thể tự khóa hoặc hạ quyền chính mình.");
  }
  await db.update(schema.users).set(patch).where(eq(schema.users.id, id));
  if (patch.active === false) await db.delete(schema.sessions).where(eq(schema.sessions.userId, id));
  refresh();
}

export async function deleteUser(id: number) {
  const me = await requireAdmin();
  if (id === me.id) throw new Error("Không thể xóa chính mình.");
  await db.delete(schema.users).where(eq(schema.users.id, id));
  refresh();
}

/* ---------- Items ---------- */

function parseExamples(raw: string): Example[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      if (parts.length >= 3) return { text: parts[0], reading: parts[1] || undefined, translation: parts[2] };
      return { text: parts[0], translation: parts[1] ?? "" };
    });
}

function itemFromForm(fd: FormData) {
  const kind = str(fd, "kind") as ItemKind;
  if (!ITEM_KINDS.includes(kind)) throw new Error("Loại không hợp lệ");
  const term = str(fd, "term");
  const reading = str(fd, "reading") || null;
  return {
    kind,
    term,
    reading,
    meaning: str(fd, "meaning"),
    level: str(fd, "level") || null,
    topic: str(fd, "topic") || null,
    pos: str(fd, "pos") || null,
    prepositions: str(fd, "prepositions") || null,
    note: str(fd, "note") || null,
    examples: parseExamples(str(fd, "examples")),
    sortOrder: Number(fd.get("sortOrder") || 0),
    letter: letterOf(term, reading),
  };
}

export async function saveItem(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const id = Number(fd.get("id") || 0);
  const data = itemFromForm(fd);
  if (!data.term || !data.meaning) return { error: "Cần có từ và nghĩa." };
  if (id) await db.update(schema.items).set(data).where(eq(schema.items.id, id));
  else await db.insert(schema.items).values(data);
  refresh();
  return { ok: id ? "Đã lưu thay đổi." : `Đã thêm "${data.term}".` };
}

export async function deleteItem(id: number) {
  await requireAdmin();
  await db.delete(schema.items).where(eq(schema.items.id, id));
  refresh();
}

type ImportRow = {
  term: string;
  reading?: string;
  meaning: string;
  level?: string;
  topic?: string;
  pos?: string;
  prepositions?: string;
  note?: string;
  examples?: Example[];
};

/**
 * Accepts either a JSON array of ImportRow, or one item per line:
 * term | reading | meaning | level | topic | pos | prepositions | examples
 * where examples are separated by ";;" and each example is "text :: reading :: translation".
 */
function parseImport(raw: string): ImportRow[] {
  const text = raw.trim();
  if (text.startsWith("[")) {
    const data = JSON.parse(text) as ImportRow[];
    if (!Array.isArray(data)) throw new Error("JSON phải là một mảng");
    return data;
  }
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((line) => {
      const [term, reading, meaning, level, topic, pos, prepositions, examples] = line.split("|").map((p) => p.trim());
      return {
        term,
        reading,
        meaning,
        level,
        topic,
        pos,
        prepositions,
        examples: (examples ?? "")
          .split(";;")
          .map((e) => e.trim())
          .filter(Boolean)
          .map((e) => {
            const [t, r, tr] = e.split("::").map((p) => p.trim());
            return tr === undefined ? { text: t, translation: r ?? "" } : { text: t, reading: r || undefined, translation: tr };
          }),
      };
    });
}

export async function importItems(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const kind = str(fd, "kind") as ItemKind;
  if (!ITEM_KINDS.includes(kind)) return { error: "Chọn loại dữ liệu." };
  let rows: ImportRow[];
  try {
    rows = parseImport(str(fd, "data"));
  } catch (e) {
    return { error: `Không đọc được dữ liệu: ${(e as Error).message}` };
  }
  const valid = rows.filter((r) => r.term && r.meaning);
  if (!valid.length) return { error: "Không có dòng hợp lệ (cần ít nhất từ và nghĩa)." };
  const existing = await db.select({ term: schema.items.term }).from(schema.items).where(eq(schema.items.kind, kind));
  const seen = new Set(existing.map((e) => e.term));
  const fresh = valid.filter((r) => !seen.has(r.term) && seen.add(r.term));
  for (let i = 0; i < fresh.length; i += 200) {
    await db.insert(schema.items).values(
      fresh.slice(i, i + 200).map((r, j) => ({
        kind,
        term: r.term,
        reading: r.reading || null,
        meaning: r.meaning,
        level: r.level || null,
        topic: r.topic || null,
        pos: r.pos || null,
        prepositions: r.prepositions || null,
        note: r.note || null,
        examples: r.examples ?? [],
        letter: letterOf(r.term, r.reading),
        sortOrder: 1000 + i + j,
      })),
    );
  }
  refresh();
  const skipped = valid.length - fresh.length;
  return { ok: `Đã nhập ${fresh.length} mục${skipped ? `, bỏ qua ${skipped} mục trùng` : ""}.` };
}

/* ---------- Settings ---------- */

const nums = (s: string) =>
  s
    .split(/[,\s]+/)
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b);

function parseScale(s: string) {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [level, words] = l.split(/[:=]/).map((p) => p.trim());
      return { level, words: Number(words) };
    })
    .filter((r) => r.level && r.words > 0);
}

export async function saveSettings(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const quota = (k: string) => Math.min(100, Math.max(0, Number(fd.get(k) || 0)));
  const value: AppSettings = {
    appName: str(fd, "appName") || "Vocab Space",
    timezone: str(fd, "timezone") || "Asia/Ho_Chi_Minh",
    daily: {
      zh_word: quota("zh_word"),
      zh_phrase: quota("zh_phrase"),
      en_word: quota("en_word"),
      en_idiom: quota("en_idiom"),
    },
    reviewBatch: Math.min(50, Math.max(3, Number(fd.get("reviewBatch") || 10))),
    milestones: nums(str(fd, "milestones")),
    rankScales: { zh: parseScale(str(fd, "rankZh")), en: parseScale(str(fd, "rankEn")) },
  };
  try {
    new Intl.DateTimeFormat("en", { timeZone: value.timezone });
  } catch {
    return { error: "Múi giờ không hợp lệ (ví dụ: Asia/Ho_Chi_Minh)." };
  }
  if (!value.rankScales.zh.length || !value.rankScales.en.length) return { error: "Thang xếp hạng không được để trống." };
  await Promise.all(
    Object.entries(value).map(([key, v]) =>
      db
        .insert(schema.settings)
        .values({ key, value: v })
        .onConflictDoUpdate({ target: schema.settings.key, set: { value: v } }),
    ),
  );
  updateTag("settings");
  return { ok: "Đã lưu cài đặt." };
}
