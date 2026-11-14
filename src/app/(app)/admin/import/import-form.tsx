"use client";

import { Upload } from "lucide-react";
import { useActionState } from "react";
import { importItems } from "@/app/actions/admin";
import { FormMessage } from "@/components/form-message";
import { ITEM_KINDS } from "@/lib/kinds";
import { KIND_LABEL } from "@/lib/langs";

export function ImportForm() {
  const [state, action, pending] = useActionState(importItems, undefined);
  return (
    <form action={action} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ITEM_KINDS.map((k, i) => (
          <label key={k} className="chip cursor-pointer has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-surface">
            <input type="radio" name="kind" value={k} defaultChecked={i === 0} className="sr-only" />
            {KIND_LABEL[k]}
          </label>
        ))}
      </div>
      <textarea
        name="data"
        required
        rows={16}
        placeholder="Dán dữ liệu vào đây..."
        className="field han font-mono text-sm"
      />
      <FormMessage state={state} />
      <button className="btn btn-primary" disabled={pending}>
        <Upload size={16} /> {pending ? "Đang nhập..." : "Nhập dữ liệu"}
      </button>
    </form>
  );
}
