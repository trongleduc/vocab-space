"use client";

import { Check, ChevronDown, Flag } from "lucide-react";
import { useState, useTransition } from "react";
import { markLearned, unmarkLearned } from "@/app/actions/learn";
import { fontOfKind, isExtraKind } from "@/lib/langs";
import type { ItemWithStatus } from "@/lib/queries";
import { useCelebrate } from "./celebrate";
import { ExampleLine } from "./example";
import { SpeakButton } from "./speak";

export function LearnButton({
  itemId,
  learnedOn,
  today,
  size = "sm",
}: {
  itemId: number;
  learnedOn: string | null;
  today: string;
  size?: "sm" | "md";
}) {
  const [learned, setLearned] = useState(Boolean(learnedOn));
  const [pending, start] = useTransition();
  const [pressed, setPressed] = useState(false);
  const { celebrate, burst } = useCelebrate();
  const canUndo = !learnedOn || learnedOn === today;

  const toggle = (el: HTMLButtonElement) => {
    if (learned) {
      if (!canUndo) return;
      setLearned(false);
      start(async () => {
        await unmarkLearned(itemId);
      });
      return;
    }
    setLearned(true);
    setPressed(true);
    setTimeout(() => setPressed(false), 450);
    burst(el);
    start(async () => {
      const res = await markLearned([itemId]);
      celebrate(res.celebrations);
    });
  };

  return (
    <button
      type="button"
      onClick={(e) => toggle(e.currentTarget)}
      disabled={pending || (learned && !canUndo)}
      className={`btn ${size === "sm" ? "btn-sm" : ""} ${learned ? "" : "btn-primary"} ${pressed ? "animate-pop" : ""}`}
      title={learned ? (canUndo ? "Bỏ đánh dấu" : "Đã học") : "Đánh dấu đã học"}
      style={learned ? { color: "var(--good)" } : undefined}
    >
      {learned ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" className="check-draw" />
          </svg>
          Đã học
        </>
      ) : (
        <>
          <Check size={16} strokeWidth={2.6} />
          Học xong
        </>
      )}
    </button>
  );
}

export function LevelBadge({ level }: { level: string | null }) {
  if (!level) return null;
  return (
    <span className="rounded-md bg-ink px-1.5 py-0.5 font-mono text-[11px] font-bold tracking-wide text-surface">{level}</span>
  );
}

export function WordCard({
  item,
  today,
  speech,
  learnable = true,
}: {
  item: ItemWithStatus;
  today: string;
  speech: string;
  learnable?: boolean;
}) {
  const [more, setMore] = useState(false);
  const font = fontOfKind(item.kind);
  const sentence = isExtraKind(item.kind);
  const examples = more ? item.examples : item.examples.slice(0, 1);
  const preps = (item.prepositions ?? "")
    .split(";")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-[0_6px_0_var(--line)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <LevelBadge level={item.level} />
          {item.pos && <span className="font-medium">{item.pos}</span>}
          {item.topic && (
            <>
              <span aria-hidden>·</span>
              <span>{item.topic}</span>
            </>
          )}
          {item.priority && (
            <span className="inline-flex items-center gap-1 font-semibold text-bad">
              <Flag size={12} /> cần ôn
            </span>
          )}
        </div>
        <SpeakButton text={item.term} lang={speech} />
      </div>

      <div className="mt-3">
        <h3
          className={`font-bold tracking-tight ${
            font ? `${font} ${sentence ? "text-2xl leading-snug" : "text-4xl"}` : sentence ? "text-xl leading-snug" : "text-2xl"
          }`}
        >
          {item.term}
        </h3>
        {item.reading && <p className="mt-1 text-muted">{item.reading}</p>}
        <p className="mt-2 text-[17px] font-medium">{item.meaning}</p>
      </div>

      {item.note && <p className="mt-2 text-sm text-muted">{item.note}</p>}

      {preps.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">Đi với giới từ</p>
          <div className="flex flex-wrap gap-1.5">
            {preps.map((p) => (
              <span key={p} className="rounded-lg border-[1.5px] border-accent/40 bg-accent-soft px-2 py-0.5 text-sm font-semibold">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {item.examples.length > 0 && (
        <div className="mt-4">
          <ul className="space-y-3">
            {examples.map((ex, i) => (
              <ExampleLine key={i} ex={ex} font={font} />
            ))}
          </ul>
          {item.examples.length > 1 && (
            <button
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-muted hover:text-ink"
              onClick={() => setMore((m) => !m)}
            >
              <ChevronDown size={15} className={`transition ${more ? "rotate-180" : ""}`} />
              {more ? "Thu gọn" : `Thêm ${item.examples.length - 1} ví dụ`}
            </button>
          )}
        </div>
      )}

      {learnable && (
        <div className="mt-auto flex justify-end pt-4">
          <LearnButton key={item.learnedOn ?? "new"} itemId={item.id} learnedOn={item.learnedOn} today={today} />
        </div>
      )}
    </article>
  );
}
