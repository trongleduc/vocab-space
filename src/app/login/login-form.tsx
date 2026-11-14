"use client";

import { ArrowLeft, BookOpen } from "lucide-react";
import { useActionState, useState } from "react";
import { login } from "@/app/actions/auth";
import { FormMessage } from "@/components/form-message";
import { ThemeToggle } from "@/components/theme-toggle";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function LoginForm({ users, appName }: { users: { id: number; name: string }[]; appName: string }) {
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(null);
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-ink text-surface shadow-[0_3px_0_var(--muted)]">
            <BookOpen size={20} strokeWidth={2.4} />
          </span>
          <span className="text-xl font-extrabold tracking-tight">{appName}</span>
        </div>
        <ThemeToggle />
      </div>

      <div className="card p-6 sm:p-8">
        {!selected ? (
          <div className="animate-rise">
            <h1 className="text-2xl font-extrabold">Bạn là ai?</h1>
            <p className="mt-1 text-muted">Chọn tên của bạn để đăng nhập.</p>
            {users.length === 0 ? (
              <p className="mt-6 rounded-xl bg-surface-2 p-4 text-sm text-muted">
                Chưa có tài khoản nào. Chạy <code className="font-mono">npm run db:seed</code> để tạo tài khoản quản trị.
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setSelected(u)}
                    className="btn h-auto flex-col gap-2 py-4"
                  >
                    <span className="grid size-12 place-items-center rounded-full bg-surface-2 text-base font-bold">
                      {initials(u.name)}
                    </span>
                    <span className="max-w-full truncate text-sm">{u.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form action={action} className="animate-rise">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
            >
              <ArrowLeft size={15} /> Chọn tên khác
            </button>
            <div className="flex items-center gap-3">
              <span className="grid size-14 place-items-center rounded-full bg-ink text-lg font-bold text-surface">
                {initials(selected.name)}
              </span>
              <div>
                <p className="text-sm text-muted">Đăng nhập với tên</p>
                <h1 className="text-2xl font-extrabold">{selected.name}</h1>
              </div>
            </div>
            <input type="hidden" name="userId" value={selected.id} />
            <label className="mt-6 block text-sm font-semibold" htmlFor="password">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="field mt-1.5"
            />
            <div className="mt-3">
              <FormMessage state={state} />
            </div>
            <button className="btn btn-primary mt-4 w-full" disabled={pending}>
              {pending ? "Đang vào..." : "Vào học"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
