"use client";

import { Minus, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { setDailyGoals } from "@/app/actions/learn";
import { MAX_DAILY, type DailyOverrides, type ItemKind } from "@/lib/kinds";
import { LANGS, type Lang } from "@/lib/langs";

/** Empty string = use the admin default. */
type Draft = Partial<Record<ItemKind, string>>;

const toDraft = (own: DailyOverrides, kinds: ItemKind[]): Draft =>
  Object.fromEntries(kinds.map((k) => [k, own[k] === undefined ? "" : String(own[k])]));

/** Per-member daily quotas for each language they learn, with the admin default as fallback. */
export function DailyGoalForm({
  langs,
  own,
  defaults,
}: {
  langs: Lang[];
  own: DailyOverrides;
  defaults: Record<ItemKind, number>;
}) {
  const kinds = langs.flatMap((l) => [LANGS[l].wordKind, LANGS[l].extraKind]);
  const [draft, setDraft] = useState<Draft>(() => toDraft(own, kinds));
  const [saved, setSaved] = useState<Draft>(() => toDraft(own, kinds));
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const valueOf = (k: ItemKind) => (draft[k] === "" || draft[k] === undefined ? defaults[k] : Number(draft[k]));
  const set = (k: ItemKind, v: string) => {
    setMessage(null);
    setDraft((d) => ({ ...d, [k]: v }));
  };
  const step = (k: ItemKind, delta: number) => set(k, String(Math.min(MAX_DAILY, Math.max(0, valueOf(k) + delta))));
  const dirty = kinds.some((k) => (draft[k] ?? "") !== (saved[k] ?? ""));

  const save = (next: Draft) =>
    start(async () => {
      const changes = Object.fromEntries(
        kinds.map((k) => {
          const raw = next[k] ?? "";
          const n = Number(raw);
          // Typing the default number back is the same as using the default.
          return [k, raw === "" || !Number.isFinite(n) || n === defaults[k] ? null : n];
        }),
      );
      await setDailyGoals(changes);
      const clean = Object.fromEntries(kinds.map((k) => [k, changes[k] === null ? "" : String(changes[k])]));
      setDraft(clean);
      setSaved(clean);
      setMessage("Đã lưu. Danh sách hôm nay đã cập nhật theo số mới.");
    });

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {langs.map((l) => {
          const cfg = LANGS[l];
          return (
            <div key={l} className="rounded-2xl border-[1.5px] border-line p-4">
              <p className="mb-3 font-bold">{cfg.name}</p>
              <div className="space-y-3">
                {(
                  [
                    [cfg.wordKind, "Từ mới"],
                    [cfg.extraKind, cfg.extraLabel],
                  ] as const
                ).map(([k, label]) => (
                  <div key={k} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-muted">
                        {draft[k] === "" ? `Mặc định (${defaults[k]})` : `Mặc định là ${defaults[k]}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        className="btn btn-sm btn-icon"
                        onClick={() => step(k, -1)}
                        disabled={valueOf(k) <= 0}
                        aria-label={`Bớt ${label.toLowerCase()} ${cfg.name}`}
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={MAX_DAILY}
                        value={draft[k] ?? ""}
                        placeholder={String(defaults[k])}
                        onChange={(e) => set(k, e.target.value)}
                        className="field min-h-9 w-16 px-2 text-center font-mono tabular-nums"
                        aria-label={`${label} ${cfg.name} mỗi ngày`}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-icon"
                        onClick={() => step(k, 1)}
                        disabled={valueOf(k) >= MAX_DAILY}
                        aria-label={`Thêm ${label.toLowerCase()} ${cfg.name}`}
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={() => save(draft)} disabled={pending || !dirty}>
          {pending ? "Đang lưu..." : "Lưu"}
        </button>
        <button
          className="btn"
          onClick={() => save(Object.fromEntries(kinds.map((k) => [k, ""])))}
          disabled={pending || kinds.every((k) => (saved[k] ?? "") === "")}
        >
          Dùng mặc định
        </button>
        <p className="text-sm text-muted" aria-live="polite">
          {message ?? `Tối đa ${MAX_DAILY} mỗi loại. Đặt 0 để tạm ngừng nhận mục mới.`}
        </p>
      </div>
    </div>
  );
}
