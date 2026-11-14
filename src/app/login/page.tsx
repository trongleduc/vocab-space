import { asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { db, schema } from "@/db";
import { getUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";
import { LoginForm } from "./login-form";

export const metadata = { title: "Đăng nhập" };

async function Login() {
  if (await getUser()) redirect("/");
  const [settings, users] = await Promise.all([
    getSettings(),
    db
      .select({ id: schema.users.id, name: schema.users.name })
      .from(schema.users)
      .where(eq(schema.users.active, true))
      .orderBy(asc(schema.users.name)),
  ]);
  return <LoginForm users={users} appName={settings.appName} />;
}

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-10">
      <Suspense fallback={<div className="size-8 animate-spin rounded-full border-[3px] border-line border-t-ink" />}>
        <Login />
      </Suspense>
    </main>
  );
}
