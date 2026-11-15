"use client";

import { KeyRound, PencilLine, Trash2 } from "lucide-react";
import { useActionState, useRef, useState, useTransition } from "react";
import { createUser, deleteUser, renameUser, resetPassword, updateUser } from "@/app/actions/admin";
import { FormMessage } from "@/components/form-message";

export function CreateUserForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: Parameters<typeof createUser>[0], fd: FormData) => {
    const res = await createUser(prev, fd);
    if (res?.ok) ref.current?.reset();
    return res;
  }, undefined);
  return (
    <form ref={ref} action={action} className="space-y-3">
      <input name="name" required placeholder="Tên hiển thị" className="field" />
      <input name="password" required minLength={4} placeholder="Mật khẩu cấp cho thành viên" className="field" />
      <select name="role" className="field" defaultValue="member">
        <option value="member">Thành viên</option>
        <option value="admin">Quản trị viên</option>
      </select>
      <FormMessage state={state} />
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Đang tạo..." : "Tạo tài khoản"}
      </button>
    </form>
  );
}

export function UserRow({
  user,
  isMe,
  learned,
  lastActive,
}: {
  user: { id: number; name: string; role: "admin" | "member"; active: boolean };
  isMe: boolean;
  learned: number;
  lastActive: string | null;
}) {
  const [open, setOpen] = useState<"none" | "password" | "rename">("none");
  const [pending, start] = useTransition();
  const [state, action, resetting] = useActionState(resetPassword, undefined);
  const [renameState, renameAction, renaming] = useActionState(
    async (prev: Parameters<typeof renameUser>[0], fd: FormData) => {
      const res = await renameUser(prev, fd);
      if (res?.ok) setOpen("none");
      return res;
    },
    undefined,
  );
  const toggle = (panel: "password" | "rename") => setOpen((o) => (o === panel ? "none" : panel));

  // Narrow card: 6-column grid → [Đổi tên][Mật khẩu] / [Cấp admin][Khóa][Xóa]. Wide card: 5 equal columns.
  // Sized by the card (container query), not the viewport, so it holds in the narrow column next to the sidebar too.
  const wide = "@lg:col-span-1 px-2 whitespace-nowrap";
  const toggleBtn = (panel: "password" | "rename") =>
    `btn btn-sm w-full col-span-3 ${wide} ${open === panel ? "btn-primary" : ""}`;

  return (
    <div className="@container p-4">
      <div className={`flex items-start gap-3 ${user.active ? "" : "opacity-60"}`}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-2 font-bold">
          {user.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold">{user.name}</span>
            {user.role === "admin" && (
              <span className="rounded-md bg-ink px-1.5 py-0.5 text-[11px] font-bold text-surface">Admin</span>
            )}
            {!user.active && <span className="text-xs font-semibold text-bad">Đã khóa</span>}
            {isMe && <span className="text-xs text-muted">(bạn)</span>}
          </div>
          <p className="text-sm text-muted">
            {learned} mục đã học{lastActive ? ` · hoạt động gần nhất ${lastActive}` : ""}
          </p>
          {open === "none" && renameState?.ok && <p className="text-sm font-medium text-good">{renameState.ok}</p>}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-6 gap-1.5 @lg:grid-cols-5">
        <button className={toggleBtn("rename")} aria-expanded={open === "rename"} onClick={() => toggle("rename")}>
          <PencilLine size={14} /> Đổi tên
        </button>
        <button className={toggleBtn("password")} aria-expanded={open === "password"} onClick={() => toggle("password")}>
          <KeyRound size={14} /> Mật khẩu
        </button>
        {!isMe && (
          <>
            <button
              className={`btn btn-sm w-full col-span-2 ${wide}`}
              disabled={pending}
              onClick={() => start(() => updateUser(user.id, { role: user.role === "admin" ? "member" : "admin" }))}
            >
              {user.role === "admin" ? "Hạ quyền" : "Cấp admin"}
            </button>
            <button
              className={`btn btn-sm w-full col-span-2 ${wide}`}
              disabled={pending}
              onClick={() => start(() => updateUser(user.id, { active: !user.active }))}
            >
              {user.active ? "Khóa" : "Mở khóa"}
            </button>
            <button
              className={`btn btn-sm btn-bad w-full col-span-2 ${wide}`}
              disabled={pending}
              onClick={() => {
                if (confirm(`Xóa tài khoản ${user.name} và toàn bộ tiến độ học?`)) start(() => deleteUser(user.id));
              }}
            >
              <Trash2 size={14} /> Xóa
            </button>
          </>
        )}
      </div>
      {open === "rename" && (
        <form action={renameAction} className="mt-3 flex flex-wrap gap-2 animate-rise">
          <input type="hidden" name="id" value={user.id} />
          <input
            name="name"
            required
            maxLength={40}
            defaultValue={user.name}
            autoFocus
            placeholder="Tên mới"
            className="field min-h-10 flex-1"
          />
          <button className="btn btn-sm btn-primary h-10" disabled={renaming}>
            {renaming ? "Đang lưu..." : "Lưu tên"}
          </button>
          <div className="w-full">
            <FormMessage state={renameState} />
          </div>
        </form>
      )}
      {open === "password" && (
        <form action={action} className="mt-3 flex flex-wrap gap-2 animate-rise">
          <input type="hidden" name="id" value={user.id} />
          <input name="password" required minLength={4} placeholder="Mật khẩu mới" className="field min-h-10 flex-1" />
          <button className="btn btn-sm btn-primary h-10" disabled={resetting}>
            Đặt lại
          </button>
          <div className="w-full">
            <FormMessage state={state} />
          </div>
        </form>
      )}
    </div>
  );
}
