"use client";

import { BookOpenCheck, Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { submitAnswers } from "@/app/actions/learn";
import type { ClozeQuestion } from "@/lib/queries";
import { useCelebrate } from "./celebrate";
import { ProgressBar, ResultSummary, useCombo, type AnswerLog } from "./quiz";
import { speak, SpeakButton } from "./speak";

/** Fill-in-the-blank exercise built from example sentences. */
/** `font` is the script class for the language (han, ja, ko; "" for English). */
export function Cloze({ questions, speech, font }: { questions: ClozeQuestion[]; speech: string; font: string }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [done, setDone] = useState(false);
  const [round, setRound] = useState(0);
  const [saving, startSaving] = useTransition();
  const { celebrate, burst } = useCelebrate();
  const combo = useCombo();
  const router = useRouter();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const q = questions[index];
  const answered = picked !== null;

  const pick = (choice: string, i: number) => {
    if (answered || !q) return;
    const correct = choice === q.correct;
    setPicked(choice);
    setLog((l) => [...l, { itemId: q.id, correct, term: q.term, meaning: q.meaning, font }]);
    if (correct) burst(refs.current[i]);
    combo.hit(correct);
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

  const right = picked === q.correct;

  return (
    <div className="mx-auto max-w-2xl" key={round}>
      {combo.element}
      <div className="mb-6 flex items-center gap-3">
        <ProgressBar value={index + (answered ? 1 : 0)} max={questions.length} />
        <span className="font-mono text-sm tabular-nums text-muted">
          {index + 1}/{questions.length}
        </span>
      </div>

      <div key={q.id} className="card animate-rise p-6 sm:p-8">
        <p className="mb-4 text-sm font-semibold text-muted">{q.prompt}</p>
        <p className={`leading-loose [overflow-wrap:anywhere] ${font ? `${font} text-2xl sm:text-3xl` : "text-xl sm:text-2xl"}`}>
          {q.before}
          <span
            className={`mx-1 inline-block min-w-16 rounded-lg border-b-[3px] px-2 text-center font-bold transition ${
              !answered ? "border-ink/40 text-transparent" : right ? "border-good bg-good/10 text-good animate-pop" : "border-bad bg-bad/10 text-bad"
            }`}
          >
            {answered ? q.answer : font ? "　　" : "____"}
          </span>
          {q.after}
        </p>
        {answered && (
          <div className="mt-2 flex items-start justify-between gap-2 animate-rise">
            <p className="text-muted">{q.sentenceReading}</p>
            <SpeakButton text={q.before + q.answer + q.after} lang={speech} label="Nghe lại câu" />
          </div>
        )}
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
          const state = !answered ? "" : c === q.correct ? "right" : c === picked ? "wrong" : "dim";
          return (
            <button
              key={c}
              ref={(el) => {
                refs.current[i] = el;
              }}
              onClick={() => pick(c, i)}
              disabled={answered && state === "dim"}
              className={`btn h-auto min-h-16 min-w-0 whitespace-normal py-2 leading-tight [overflow-wrap:anywhere] ${font ? `${font} text-2xl` : "text-lg"} ${
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
          {(q.explain || q.pattern) && (
            <div className="mb-4 flex gap-3 rounded-2xl bg-surface-2 p-4 text-sm">
              <BookOpenCheck size={18} className="mt-0.5 shrink-0 text-muted" />
              <div className="min-w-0 space-y-1">
                {q.explain && <p className="font-semibold">{q.explain}</p>}
                {q.pattern && (
                  <p className="text-muted">
                    Cấu trúc: <span className="text-ink">{q.pattern}</span>
                  </p>
                )}
              </div>
            </div>
          )}
          <p className="text-center text-sm text-muted">
            <span className={`font-semibold ${font}`}>{q.term}</span>
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
