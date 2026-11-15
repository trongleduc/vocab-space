"use client";

import { BellRing, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { fetchReview } from "@/app/actions/learn";
import { speechOfKind } from "@/lib/langs";
import type { QuizQuestion } from "@/lib/queries";
import { QuizSession } from "./quiz";

const speech = (q: QuizQuestion) => speechOfKind(q.kind);

export function ReviewPanel({ due, onClose, lang }: { due: number; onClose?: () => void; lang?: string }) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [session, setSession] = useState(0);
  const [loading, startLoading] = useTransition();

  const load = (anyLearned: boolean) =>
    startLoading(async () => {
      setQuestions(await fetchReview(lang, anyLearned));
      setSession((s) => s + 1);
    });

  useEffect(() => {
    if (due > 0) load(false);
    // Load once on open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading || (due > 0 && questions === null)) {
    return (
      <div className="grid place-items-center py-16 text-muted">
        <div className="size-8 animate-spin rounded-full border-[3px] border-line border-t-accent" />
      </div>
    );
  }

  if (!questions?.length) {
    return (
      <div className="py-6 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-2xl bg-surface-2">
          <BellRing size={28} className="text-muted" />
        </div>
        <h3 className="text-xl font-bold">Chưa có từ nào đến hạn ôn</h3>
        <p className="mx-auto mt-1 max-w-xs text-muted">
          Từ đã học sẽ quay lại đây theo chu kỳ 1, 3, 7… ngày. Bạn vẫn có thể ôn ngẫu nhiên ngay bây giờ.
        </p>
        <button className="btn btn-primary mt-5" onClick={() => load(true)}>
          Ôn ngẫu nhiên từ đã học
        </button>
      </div>
    );
  }

  return (
    <QuizSession
      key={session}
      questions={questions}
      speech={speech}
      onFinish={onClose}
      onRestart={() => load(true)}
    />
  );
}

/** Small floating bubble that opens a spaced-repetition review. */
export function FloatingReview({ due, hasLearned }: { due: number; hasLearned: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!hasLearned || pathname.startsWith("/review") || pathname.startsWith("/admin")) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-24 right-4 z-40 grid size-14 place-items-center rounded-full border-[1.5px] shadow-[0_5px_0_var(--accent-deep),0_12px_24px_-8px_rgba(0,0,0,0.35)] transition active:translate-y-1 active:shadow-[0_1px_0_var(--accent-deep)] lg:bottom-8 lg:right-8 ${
          due > 0 ? "animate-bob border-accent-deep bg-accent text-accent-ink" : "border-line bg-surface text-ink"
        }`}
        aria-label={due > 0 ? `${due} từ cần ôn` : "Ôn tập"}
        title={due > 0 ? `${due} từ cần ôn` : "Ôn tập"}
      >
        <BellRing size={22} />
        {due > 0 && (
          <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border-2 border-bg bg-bad px-1.5 font-mono text-xs font-bold text-white">
            {due > 99 ? "99+" : due}
          </span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-[2px] sm:items-center sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Ôn tập ngắt quãng"
            className="card max-h-[92dvh] w-full max-w-xl overflow-y-auto rounded-b-none p-5 animate-rise sm:rounded-b-[22px] sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Ôn tập ngắt quãng</h2>
                <p className="text-sm text-muted">{due > 0 ? `${due} từ đến hạn` : "Không có từ đến hạn"}</p>
              </div>
              <button className="btn btn-sm btn-icon btn-ghost" onClick={() => setOpen(false)} aria-label="Đóng">
                <X size={18} />
              </button>
            </div>
            <ReviewPanel due={due} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
