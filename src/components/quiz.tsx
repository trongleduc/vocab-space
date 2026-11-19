"use client";

import { Check, Eye, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitAnswers } from "@/app/actions/learn";
import { fontOfKind } from "@/lib/langs";
import type { QuizQuestion } from "@/lib/queries";
import { pickQuote } from "@/lib/quotes";
import { QuoteBlock, useCelebrate } from "./celebrate";
import { Highlighted } from "./example";
import { SpeakButton } from "./speak";

/** `font` is the script class of the term (han, ja, ko) for the mistakes list. */
export type AnswerLog = { itemId: number; correct: boolean; term: string; meaning: string; font?: string };

const COMBO_STEPS: Record<number, string> = {
  3: "3 câu đúng liên tiếp",
  5: "5 câu liên tiếp, đang vào guồng",
  10: "10 câu không sai, quá đỉnh",
  15: "15 câu liên tiếp, không gì cản nổi",
  20: "20 câu liên tiếp, phong độ hiệp sĩ",
};

/** Counts correct answers in a row and pops a small badge at 3, 5, 10... */
export function useCombo() {
  const [combo, setCombo] = useState(0);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const { fx } = useCelebrate();

  const hit = (correct: boolean) => {
    const next = correct ? combo + 1 : 0;
    setCombo(next);
    const text = COMBO_STEPS[next];
    if (text) {
      const id = Date.now();
      setToast({ id, text });
      fx(next >= 10 ? "perfect" : "small");
      setTimeout(() => setToast((t) => (t?.id === id ? null : t)), 1800);
    }
  };

  const element = toast ? (
    <div
      key={toast.id}
      className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4 animate-pop"
      role="status"
    >
      <span className="flex items-center gap-2 rounded-full border-[1.5px] border-accent-deep bg-accent px-4 py-2 text-sm font-bold text-accent-ink shadow-[0_4px_0_var(--accent-deep)]">
        <span className="font-mono">x{combo}</span>
        {toast.text}
      </span>
    </div>
  ) : null;

  return { hit, element };
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div
        className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
        style={{ width: `${max ? (value / max) * 100 : 0}%` }}
      />
    </div>
  );
}

export function ResultSummary({
  log,
  saving,
  onRestart,
  onClose,
  closeLabel = "Xong",
}: {
  log: AnswerLog[];
  saving: boolean;
  onRestart?: () => void;
  onClose?: () => void;
  closeLabel?: string;
}) {
  const correct = log.filter((l) => l.correct).length;
  const pct = log.length ? Math.round((correct / log.length) * 100) : 0;
  const wrong = log.filter((l) => !l.correct);
  const verdict = pct === 100 ? "Hoàn hảo" : pct >= 80 ? "Rất tốt" : pct >= 50 ? "Khá ổn" : "Cần ôn thêm";
  const quote = pickQuote(
    pct === 100 ? "perfect" : pct >= 60 ? "good" : "tryAgain",
    log.reduce((a, l) => a + l.itemId, log.length),
  );
  const { fx } = useCelebrate();
  const perfect = pct === 100 && log.length >= 3;

  useEffect(() => {
    if (perfect) fx("perfect");
  }, [perfect, fx]);

  return (
    <div className="animate-rise text-center">
      <div className="relative mx-auto grid size-36 place-items-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-2)" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * 326.7} 326.7`}
            className="transition-[stroke-dasharray] duration-700"
          />
        </svg>
        <div>
          <div className="font-mono text-4xl font-bold">{pct}</div>
          <div className="text-xs font-semibold text-muted">điểm</div>
        </div>
      </div>
      <h3 className={`mt-4 text-2xl font-extrabold ${perfect ? "animate-pop" : ""}`}>{verdict}</h3>
      <p className="mt-1 text-muted">
        Đúng {correct}/{log.length} câu
        {wrong.length > 0 && ` · ${wrong.length} từ sai đã được ưu tiên vào danh sách ôn tập`}
      </p>
      <QuoteBlock quote={quote} className="mx-auto mt-5 max-w-md" />
      {wrong.length > 0 && (
        <ul className="mx-auto mt-5 max-w-md divide-y-[1.5px] divide-line rounded-2xl border-[1.5px] border-line text-left">
          {wrong.map((w) => (
            <li key={w.itemId} className="flex items-baseline justify-between gap-3 px-4 py-2.5">
              <span className={`${w.font ?? ""} text-lg font-semibold`}>{w.term}</span>
              <span className="text-right text-sm text-muted">{w.meaning}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRestart && (
          <button className="btn" onClick={onRestart} disabled={saving}>
            Làm lại
          </button>
        )}
        {onClose && (
          <button className="btn btn-primary" onClick={onClose} disabled={saving}>
            {saving ? "Đang lưu..." : closeLabel}
          </button>
        )}
      </div>
    </div>
  );
}

/** Multiple-choice "pick the meaning" session used by reviews and flashcard tests. */
export function QuizSession({
  questions,
  speech,
  onFinish,
  onRestart,
}: {
  questions: QuizQuestion[];
  speech: (q: QuizQuestion) => string;
  onFinish?: () => void;
  onRestart?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [showReading, setShowReading] = useState(false);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [saving, startSaving] = useTransition();
  const [done, setDone] = useState(false);
  const { celebrate, burst } = useCelebrate();
  const combo = useCombo();
  const choiceRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const q = questions[index];
  const answered = picked !== null;
  const font = q ? fontOfKind(q.kind) : "";
  const long = (q?.term.length ?? 0) > 4;

  const finish = (finalLog: AnswerLog[]) => {
    setDone(true);
    startSaving(async () => {
      const res = await submitAnswers(finalLog.map(({ itemId, correct }) => ({ itemId, correct })));
      celebrate(res.celebrations);
    });
  };

  const pick = (choice: string, i: number) => {
    if (answered || !q) return;
    const correct = choice === q.meaning;
    setPicked(choice);
    setShowReading(true);
    setLog((l) => [...l, { itemId: q.id, correct, term: q.term, meaning: q.meaning, font }]);
    if (correct) burst(choiceRefs.current[i]);
    combo.hit(correct);
  };

  const next = () => {
    if (index + 1 >= questions.length) return finish(log);
    setIndex((i) => i + 1);
    setPicked(null);
    setShowReading(false);
  };

  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (!q) return;
      const n = Number(e.key);
      if (!answered && n >= 1 && n <= q.choices.length) pick(q.choices[n - 1], n - 1);
      else if (answered && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (done) {
    return <ResultSummary log={log} saving={saving} onClose={onFinish} onRestart={onRestart} />;
  }
  if (!q) return null;

  return (
    <div>
      {combo.element}
      <div className="flex items-center gap-3">
        <ProgressBar value={index + (answered ? 1 : 0)} max={questions.length} />
        <span className="font-mono text-sm tabular-nums text-muted">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div key={q.id} className="animate-rise py-8 text-center">
        {q.priority && (
          <span className="mb-3 inline-block rounded-full bg-bad/10 px-2.5 py-1 text-xs font-semibold text-bad">
            Từng trả lời sai
          </span>
        )}
        <div className="flex items-center justify-center gap-3">
          <h2
            className={`${font ? `${font} ${long ? "text-4xl sm:text-5xl" : "text-6xl sm:text-7xl"}` : "text-4xl sm:text-5xl"} min-w-0 font-bold tracking-tight [overflow-wrap:anywhere]`}
          >
            {q.term}
          </h2>
          <SpeakButton text={q.term} lang={speech(q)} size="md" />
        </div>
        <div className="mt-3 h-6 text-muted">
          {q.reading &&
            (showReading ? (
              <span className="animate-rise inline-block">{q.reading}</span>
            ) : (
              <button className="inline-flex items-center gap-1 text-sm hover:text-ink" onClick={() => setShowReading(true)}>
                <Eye size={14} /> Hiện phiên âm
              </button>
            ))}
        </div>
      </div>

      <p className="mb-3 text-sm font-semibold text-muted">Chọn nghĩa đúng</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {q.choices.map((c, i) => {
          const isRight = c === q.meaning;
          const state = !answered ? "" : isRight ? "right" : c === picked ? "wrong" : "dim";
          return (
            <button
              key={c}
              ref={(el) => {
                choiceRefs.current[i] = el;
              }}
              onClick={() => pick(c, i)}
              disabled={answered && state === "dim"}
              className={`btn h-auto min-h-14 min-w-0 justify-start whitespace-normal py-3 text-left leading-snug [overflow-wrap:anywhere] ${
                state === "right" ? "btn-good animate-pop" : state === "wrong" ? "btn-bad animate-shake" : ""
              }`}
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md border-[1.5px] border-current/30 font-mono text-xs opacity-70">
                {state === "right" ? <Check size={14} /> : state === "wrong" ? <X size={14} /> : i + 1}
              </span>
              <span className="min-w-0">{c}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-6 animate-rise">
          {q.example && (
            <div className="rounded-2xl bg-surface-2 p-4 text-left">
              <div className={font ? "text-lg" : ""}>
                <Highlighted text={q.example.text} font={font} />
              </div>
              {q.example.reading && <div className="text-sm text-muted">{q.example.reading}</div>}
              <div className="text-sm italic text-muted">{q.example.translation}</div>
            </div>
          )}
          <button className="btn btn-primary mt-4 w-full" onClick={next} autoFocus>
            {index + 1 >= questions.length ? "Xem kết quả" : "Tiếp tục"}
          </button>
        </div>
      )}
    </div>
  );
}
