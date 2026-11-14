"use server";

import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { createSession, destroySession, requireUser } from "@/lib/auth";

export type FormState = { error?: string; ok?: string } | undefined;

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = Number(formData.get("userId"));
  const password = String(formData.get("password") ?? "");
  if (!userId || !password) return { error: "Chọn tên và nhập mật khẩu." };

  const [user] = await db
    .select()
    .from(schema.users)
    .where(and(eq(schema.users.id, userId), eq(schema.users.active, true)))
    .limit(1);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { error: "Mật khẩu chưa đúng." };
  }
  await createSession(user.id);
  redirect("/");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 4) return { error: "Mật khẩu mới cần ít nhất 4 ký tự." };
  const [row] = await db.select().from(schema.users).where(eq(schema.users.id, user.id)).limit(1);
  if (!row || !(await bcrypt.compare(current, row.passwordHash))) return { error: "Mật khẩu hiện tại chưa đúng." };
  await db
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(next, 10) })
    .where(eq(schema.users.id, user.id));
  return { ok: "Đã đổi mật khẩu." };
}
