import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { db, schema } from "@/db";
import { normalizeDaily, normalizeLangs, type DailyOverrides, type Lang } from "./kinds";

export const SESSION_COOKIE = "vs_session";
const SESSION_DAYS = 30;

const hash = (token: string) => createHash("sha256").update(token).digest("hex");

export type SessionUser = {
  id: number;
  name: string;
  role: "admin" | "member";
  langs: Lang[];
  daily: DailyOverrides;
};

export async function createSession(userId: number) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  await db.insert(schema.sessions).values({ id: hash(token), userId, expiresAt });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await db.delete(schema.sessions).where(eq(schema.sessions.id, hash(token)));
  store.delete(SESSION_COOKIE);
}

/** Current user for this request, or null. Deduplicated per request. */
export const getUser = cache(async (): Promise<SessionUser | null> => {
  // Session checks compare against the current time, so they must run per request.
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [row] = await db
    .select({
      id: schema.users.id,
      name: schema.users.name,
      role: schema.users.role,
      langs: schema.users.langs,
      daily: schema.users.daily,
    })
    .from(schema.sessions)
    .innerJoin(schema.users, eq(schema.users.id, schema.sessions.userId))
    .where(
      and(
        eq(schema.sessions.id, hash(token)),
        gt(schema.sessions.expiresAt, new Date()),
        eq(schema.users.active, true),
      ),
    )
    .limit(1);
  return row ? { ...row, langs: normalizeLangs(row.langs), daily: normalizeDaily(row.daily) } : null;
});

export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
