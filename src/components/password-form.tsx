"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/auth";
import { FormMessage } from "./form-message";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="space-y-3">
      <input name="current" type="password" required placeholder="Mật khẩu hiện tại" className="field" autoComplete="current-password" />
      <input name="next" type="password" required minLength={4} placeholder="Mật khẩu mới" className="field" autoComplete="new-password" />
      <FormMessage state={state} />
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Đang lưu..." : "Đổi mật khẩu"}
      </button>
    </form>
  );
}
