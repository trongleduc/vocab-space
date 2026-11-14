"use client";

import { Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitAnswers } from "@/app/actions/learn";
import type { ClozeQuestion } from "@/lib/queries";
import { useCelebrate } from "./celebrate";
import { ProgressBar, ResultSummary, type AnswerLog } from "./quiz";
import { speak } from "./speak";

/** Fill-in-the-blank exercise built from example sentences. */
export function Cloze({ questions, speech, han }: { questions: ClozeQuestion[]; speech: string; han: boolean }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const [saving, startSaving] = useTransition();
  const { celebrate, burst } = useCelebrate();
  const router = useRouter();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const q = questions[index];
  const answered = picked !== null;

  const pick = (choice: string, i: number) => {
    if (answered || !q) return;
    const correct = choice === q.term;
    setPicked(choice);
    setLog((l) => [...l, { itemId: q.id, correct, term: q.term, meaning: q.meaning }]);
    if (correct) burst(refs.current[i]);
    speak(q.before + q.answer + q.after, speech);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
      startSaving(async () => {
        const res = await submitAnswers(log.map(({ itemId, correct }) => ({ itemId, correct })));
        celebrate(res.celebrations);
      });
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
    setHint(false);
  };

  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (!q) return;
      const n = Number(e.key);
      if (!answered && n >= 1 && n <= q.choices.length) pick(q.choices[n - 1], n - 1);
      else if (answered && e.key === "Enter") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (done) {
    return (
      <ResultSummary
        log={log}
        saving={saving}
        onRestart={() => {
          setIndex(0);
          setPicked(null);
          setLog([]);
          setDone(false);
          setRound((r) => r + 1);
        }}
        onClose={() => router.push("/")}
        closeLabel="Về trang chủ"
      />
    );
  }
  if (!q) return null;

  const right = picked === q.term;

  return (
    <div className="mx-auto max-w-2xl" key={round}>
      <div className="mb-6 flex items-center gap-3">
        <ProgressBar value={index + (answered ? 1 : 0)} max={questions.length} />
        <span className="font-mono text-sm tabular-nums text-muted">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div key={q.id} className="card animate-rise p-6 sm:p-8">
        <p className="mb-4 text-sm font-semibold text-muted">Điền từ phù hợp vào chỗ trống</p>
        <p className={`leading-loose ${han ? "han text-2xl sm:text-3xl" : "text-xl sm:text-2xl"}`}>
          {q.before}
          <span
            className={`mx-1 inline-block min-w-16 rounded-lg border-b-[3px] px-2 text-center font-bold transition ${
              !answered ? "border-ink/40 text-transparent" : right ? "border-good bg-good/10 text-good animate-pop" : "border-bad bg-bad/10 text-bad"
            }`}
          >
            {answered ? q.answer : han ? "　　" : "____"}
          </span>
          {q.after}
        </p>
        {answered && q.sentenceReading && <p className="mt-2 text-muted animate-rise">{q.sentenceReading}</p>}
        <div className="mt-4 min-h-6 text-sm">
          {answered || hint ? (
            <p className="italic text-muted animate-rise">{q.translation}</p>
          ) : (
            <button className="inline-flex items-center gap-1.5 font-semibold text-muted hover:text-ink" onClick={() => setHint(true)}>
              <Lightbulb size={15} /> Xem nghĩa câu
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {q.choices.map((c, i) => {
          const state = !answered ? "" : c === q.term ? "right" : c === picked ? "wrong" : "dim";
          return (
            <button
              key={c}
              ref={(el) => {
                refs.current[i] = el;
              }}
              onClick={() => pick(c, i)}
              disabled={answered && state === "dim"}
              className={`btn h-16 ${han ? "han text-2xl" : "text-lg"} ${
                state === "right" ? "btn-good animate-pop" : state === "wrong" ? "btn-bad animate-shake" : ""
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-5 animate-rise">
          <p className="text-center text-sm text-muted">
            <span className={`font-semibold ${han ? "han" : ""}`}>{q.term}</span>
            {q.reading && ` · ${q.reading}`} · {q.meaning}
          </p>
          <button className="btn btn-primary mt-4 w-full" onClick={next} autoFocus>
            {index + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp theo"}
          </button>
        </div>
      )}
    </div>
  );
}
