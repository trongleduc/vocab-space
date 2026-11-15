"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useTransition } from "react";
import { deleteItem, saveItem } from "@/app/actions/admin";
import { FormMessage } from "@/components/form-message";
import type { Item, ItemKind } from "@/db/schema";
import { LANGS, langOfKind } from "@/lib/langs";

export function ItemForm({ item, kind }: { item: Item | null; kind: ItemKind }) {
  const [state, action, pending] = useActionState(saveItem, undefined);
  const k = item?.kind ?? kind;
  const lang = langOfKind(k);
  const cfg = LANGS[lang];
  const examples = (item?.examples ?? [])
    .map((e) => [e.text, e.reading ?? "", e.translation].join(" | "))
    .join("\n");

  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="kind" value={k} />
      <label className="space-y-1">
        <span className="text-sm font-semibold">{k.endsWith("word") ? "Từ" : "Câu / cụm"}</span>
        <input name="term" required defaultValue={item?.term} className={`field ${cfg.font}`} />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-semibold">{cfg.readingLabel}</span>
        <input
          name="reading"
          defaultValue={item?.reading ?? ""}
          placeholder={lang === "ja" ? "たべる · taberu" : undefined}
          className={`field ${cfg.font}`}
        />
      </label>
      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-semibold">Nghĩa tiếng Việt</span>
        <input name="meaning" required defaultValue={item?.meaning} className="field" />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-semibold">Cấp độ</span>
        <input name="level" list={`levels-${lang}`} defaultValue={item?.level ?? ""} className="field" />
        <datalist id={`levels-${lang}`}>
          {cfg.levels.map((l) => (
            <option key={l} value={l} />
          ))}
        </datalist>
      </label>
      <label className="space-y-1">
        <span className="text-sm font-semibold">Chủ đề</span>
        <input name="topic" defaultValue={item?.topic ?? ""} className="field" />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-semibold">Từ loại</span>
        <input name="pos" defaultValue={item?.pos ?? ""} placeholder="danh từ, động từ, ..." className="field" />
      </label>
      <label className="space-y-1">
        <span className="text-sm font-semibold">Thứ tự</span>
        <input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? 0} className="field" />
      </label>
      {k === "en_word" && (
        <label className="space-y-1 sm:col-span-2">
          <span className="text-sm font-semibold">Giới từ đi kèm</span>
          <input
            name="prepositions"
            defaultValue={item?.prepositions ?? ""}
            placeholder="depend on sb/sth; independent of"
            className="field"
          />
          <span className="text-xs text-muted">Ngăn cách bằng dấu chấm phẩy.</span>
        </label>
      )}
      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-semibold">Cách dùng / ghi chú</span>
        <input name="note" defaultValue={item?.note ?? ""} placeholder="Dùng khi..." className="field" />
      </label>
      <label className="space-y-1 sm:col-span-2">
        <span className="text-sm font-semibold">Câu ví dụ</span>
        <textarea
          name="examples"
          defaultValue={examples}
          rows={4}
          placeholder={cfg.examplePlaceholder}
          className={`field font-mono text-sm ${cfg.font}`}
        />
        <span className="text-xs text-muted">
          Mỗi dòng một câu: câu | phiên âm | nghĩa. Bao từ cần điền trong bài tập bằng [ngoặc vuông].
        </span>
      </label>
      <div className="sm:col-span-2">
        <FormMessage state={state} />
      </div>
      <div className="sm:col-span-2">
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Đang lưu..." : item ? "Lưu thay đổi" : "Thêm"}
        </button>
      </div>
    </form>
  );
}

export function DeleteItemButton({ id, term }: { id: number; term: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      className="btn btn-sm btn-bad btn-icon"
      aria-label={`Xóa ${term}`}
      disabled={pending}
      onClick={() => {
        if (confirm(`Xóa "${term}"? Tiến độ học của mục này cũng sẽ bị xóa.`)) start(() => deleteItem(id));
      }}
    >
      <Trash2 size={14} />
    </button>
  );
}
