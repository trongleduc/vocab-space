"use client";

import { RotateCw, ThumbsDown, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { submitAnswers } from "@/app/actions/learn";
import { fontOfKind } from "@/lib/langs";
import type { QuizQuestion } from "@/lib/queries";
import { shuffle } from "@/lib/text";
import { useCelebrate } from "./celebrate";
import { spokenForm } from "@/lib/voices";
import { ExampleBox } from "./example";
import { ProgressBar, QuizSession, ResultSummary, useCombo, type AnswerLog } from "./quiz";
import { SpeakButton } from "./speak";

function FlipDeck({ cards, speech, onRestart }: { cards: QuizQuestion[]; speech: string; onRestart: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [log, setLog] = useState<AnswerLog[]>([]);
  const [done, setDone] = useState(false);
  const [saving, startSaving] = useTransition();
  const { celebrate, burst } = useCelebrate();
  const combo = useCombo();
  const router = useRouter();

  const card = cards[index];
  const font = card ? fontOfKind(card.kind) : "";
  const long = (card?.term.length ?? 0) > 4;

  const grade = (correct: boolean, el?: HTMLElement | null) => {
    if (!card || !flipped) return;
    const nextLog = [...log, { itemId: card.id, correct, term: card.term, meaning: card.meaning, font }];
    setLog(nextLog);
    if (correct) burst(el);
    combo.hit(correct);
    if (index + 1 >= cards.length) {
      setDone(true);
      startSaving(async () => {
        const res = await submitAnswers(nextLog.map(({ itemId, correct }) => ({ itemId, correct })));
        celebrate(res.celebrations);
      });
      return;
    }
    setFlipped(false);
    setTimeout(() => setIndex((i) => i + 1), 120);
  };

  useEffect(() => {
    if (done) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "ArrowLeft" || e.key === "1")) grade(false);
      else if (flipped && (e.key === "ArrowRight" || e.key === "2")) grade(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (done) {
    return <ResultSummary log={log} saving={saving} onRestart={onRestart} onClose={() => router.push("/")} closeLabel="Về trang chủ" />;
  }
  if (!card) return null;

  const preps = (card.prepositions ?? "").split(";").map((p) => p.trim()).filter(Boolean);

  return (
    <div className="mx-auto max-w-xl">
      {combo.element}
      <div className="mb-5 flex items-center gap-3">
        <ProgressBar value={index} max={cards.length} />
        <span className="font-mono text-sm tabular-nums text-muted">
          {index + 1}/{cards.length}
        </span>
      </div>

      <div className="flip" data-flipped={flipped}>
        <div className="flip-inner">
          <button
            type="button"
            onClick={() => setFlipped(true)}
            className="flip-face card grid min-h-80 w-full place-items-center p-8 text-center shadow-[0_6px_0_var(--line)]"
          >
            <div>
              <p className={`font-bold tracking-tight break-words ${font ? `${font} ${long ? "text-5xl" : "text-7xl"}` : "text-5xl"}`}>
                {card.term}
              </p>
              <p className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted">
                <RotateCw size={14} /> Chạm để lật thẻ
              </p>
            </div>
          </button>
          <div className="flip-face flip-back card flex flex-col items-center justify-center overflow-y-auto p-6 text-center shadow-[0_6px_0_var(--line)]">
            <div className="flex items-center gap-2">
              <p className={`font-bold ${font ? `${font} text-4xl` : "text-3xl"}`}>{card.term}</p>
              <SpeakButton text={spokenForm(card.term, card.reading, speech)} lang={speech} />
            </div>
            {card.reading && <p className="mt-1 text-muted">{card.reading}</p>}
            <p className="mt-3 text-xl font-semibold">{card.meaning}</p>
            {preps.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {preps.map((p) => (
                  <span key={p} className="rounded-lg bg-accent-soft px-2 py-0.5 text-sm font-semibold">
                    {p}
                  </span>
                ))}
              </div>
            )}
            {card.example && (
              <div className="mt-4 w-full">
                <ExampleBox ex={card.example} font={font} speech={speech} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`mt-6 grid grid-cols-2 gap-3 transition ${flipped ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <button className="btn btn-bad h-14" onClick={(e) => grade(false, e.currentTarget)}>
          <ThumbsDown size={18} /> Chưa nhớ
        </button>
        <button className="btn btn-good h-14" onClick={(e) => grade(true, e.currentTarget)}>
          <ThumbsUp size={18} /> Đã nhớ
        </button>
      </div>
      <p className="mt-4 hidden text-center text-xs text-muted sm:block">
        Phím tắt: Space lật thẻ · ← chưa nhớ · → đã nhớ
      </p>
    </div>
  );
}

export function Flashcards({ cards, speech, mode }: { cards: QuizQuestion[]; speech: string; mode: "flip" | "quiz" }) {
  const [deck, setDeck] = useState(cards);
  const [round, setRound] = useState(0);
  const restart = () => {
    setDeck(shuffle(cards));
    setRound((r) => r + 1);
  };
  if (mode === "quiz") {
    return (
      <div className="mx-auto max-w-xl">
        <QuizSession key={round} questions={deck} speech={() => speech} onRestart={restart} />
      </div>
    );
  }
  return <FlipDeck key={round} cards={deck} speech={speech} onRestart={restart} />;
}
