"use client";

import { Check } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { enableLanguage, setLanguages } from "@/app/actions/learn";
import { LANG_CODES, LANGS, type Lang } from "@/lib/langs";

/** Toggle cards for the languages a member is learning. At least one stays on. */
export function LanguagePicker({ langs, learned }: { langs: Lang[]; learned: Partial<Record<Lang, number>> }) {
  const [optimistic, setOptimistic] = useOptimistic(langs);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const toggle = (l: Lang) => {
    const on = optimistic.includes(l);
    if (on && optimistic.length === 1) {
      setError("Cần bật ít nhất một ngôn ngữ.");
      return;
    }
    const next = on ? optimistic.filter((x) => x !== l) : LANG_CODES.filter((x) => x === l || optimistic.includes(x));
    setError(null);
    start(async () => {
      setOptimistic(next);
      const res = await setLanguages(next);
      if (res.error) setError(res.error);
    });
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {LANG_CODES.map((l) => {
          const cfg = LANGS[l];
          const on = optimistic.includes(l);
          return (
            <button
              key={l}
              type="button"
              role="switch"
              aria-checked={on}
              onClick={() => toggle(l)}
              className={`flex items-center gap-3 rounded-2xl border-[1.5px] p-3 text-left transition ${
                on ? "border-accent bg-accent-soft" : "border-line hover:border-ink/40"
              }`}
            >
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-2xl font-bold ${
                  on ? "bg-ink text-surface" : "bg-surface-2 text-muted"
                } ${cfg.font ? `${cfg.font} text-xl` : "text-sm"}`}
              >
                {cfg.short}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{cfg.name}</span>
                <span className="block truncate text-xs text-muted">
                  {cfg.levelSummary}
                  {learned[l] ? ` · đã học ${learned[l]} mục` : ""}
                </span>
              </span>
              <span
                aria-hidden
                className={`grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] transition ${
                  on ? "border-accent-deep bg-accent text-accent-ink" : "border-line"
                }`}
              >
                {on && <Check size={14} strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
      <p className={`mt-3 text-sm ${error ? "font-semibold text-bad" : "text-muted"}`} aria-live="polite">
        {error ??
          (pending
            ? "Đang lưu..."
            : "Ngôn ngữ đang tắt sẽ ẩn khỏi menu và không đưa vào ôn tập. Tiến độ đã học vẫn được giữ nguyên.")}
      </p>
    </div>
  );
}

/** Inline button shown on a language page the user has turned off. */
export function EnableLanguageButton({ lang }: { lang: Lang }) {
  const [pending, start] = useTransition();
  return (
    <button className="btn btn-primary btn-sm" disabled={pending} onClick={() => start(() => enableLanguage(lang))}>
      {pending ? "Đang bật..." : `Bật ${LANGS[lang].name}`}
    </button>
  );
}
