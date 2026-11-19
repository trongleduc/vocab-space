"use client";

import { ShieldCheck } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Celebration } from "@/lib/gamification";
import { LANGS } from "@/lib/langs";
import { pickQuote, type Quote, type QuoteCategory } from "@/lib/quotes";
import { FlameIcon, KnightIcon } from "./icons";
import { useModalViewport } from "./use-modal-viewport";

export type Effect = "streak" | "milestone" | "rank" | "goal" | "perfect" | "small";

type Ctx = {
  celebrate: (items: Celebration[] | undefined) => void;
  burst: (origin?: HTMLElement | null, opts?: { big?: boolean }) => void;
  fx: (effect: Effect, origin?: HTMLElement | null) => void;
};

const CelebrateContext = createContext<Ctx>({ celebrate: () => {}, burst: () => {}, fx: () => {} });

export const useCelebrate = () => useContext(CelebrateContext);

function accent() {
  const s = getComputedStyle(document.querySelector(".accent-scope") ?? document.documentElement);
  return s.getPropertyValue("--accent").trim() || "#121212";
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/** Plays one of the confetti effects. Each achievement type has its own look. */
async function play(effect: Effect, opts: { origin?: { x: number; y: number }; color?: string } = {}) {
  const confetti = (await import("canvas-confetti")).default;
  const base = { disableForReducedMotion: true, zIndex: 90 };
  const a = accent();

  switch (effect) {
    case "streak": {
      // Embers rising from the bottom of the screen.
      const colors = ["#fff3bf", "#ffd43b", "#ff922b", "#f03e3e", a];
      const end = Date.now() + 1300;
      (function frame() {
        confetti({
          ...base,
          particleCount: 5,
          angle: 90,
          spread: 45,
          startVelocity: rand(45, 70),
          gravity: 1.1,
          ticks: 220,
          scalar: rand(0.8, 1.3),
          origin: { x: rand(0.15, 0.85), y: 1.05 },
          colors,
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
      return;
    }
    case "milestone": {
      // Fireworks at random points.
      const colors = [a, "#ffd43b", "#ffffff", "#74c0fc", "#ff8787"];
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          confetti({
            ...base,
            particleCount: 45,
            spread: 360,
            startVelocity: 28,
            ticks: 90,
            gravity: 0.6,
            origin: { x: rand(0.15, 0.85), y: rand(0.15, 0.5) },
            colors,
          });
        }, i * 230);
      }
      return;
    }
    case "rank": {
      // Gold stars in waves from the centre.
      const colors = [opts.color ?? "#d4a017", "#ffd43b", "#fff9db", "#ffffff"];
      [0, 180, 360].forEach((delay, i) =>
        setTimeout(() => {
          confetti({
            ...base,
            particleCount: 40 + i * 10,
            spread: 360,
            startVelocity: 26 + i * 6,
            ticks: 110,
            gravity: 0.5,
            scalar: 1.3,
            shapes: ["star"],
            origin: { x: 0.5, y: 0.42 },
            colors,
          });
        }, delay),
      );
      return;
    }
    case "goal": {
      // Two cannons from the sides.
      const colors = [a, "#51cf66", "#ffd43b", "#ffffff"];
      const end = Date.now() + 900;
      (function frame() {
        confetti({ ...base, particleCount: 6, angle: 60, spread: 65, origin: { x: 0, y: 0.75 }, colors });
        confetti({ ...base, particleCount: 6, angle: 120, spread: 65, origin: { x: 1, y: 0.75 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
      return;
    }
    case "perfect": {
      confetti({
        ...base,
        particleCount: 70,
        spread: 100,
        startVelocity: 38,
        scalar: 1.2,
        shapes: ["star"],
        origin: opts.origin ?? { x: 0.5, y: 0.45 },
        colors: ["#ffd43b", "#fff3bf", a],
      });
      return;
    }
    default: {
      confetti({
        ...base,
        particleCount: 36,
        spread: 70,
        startVelocity: 28,
        scalar: 0.8,
        ticks: 120,
        origin: opts.origin ?? { x: 0.5, y: 0.6 },
        colors: [a, "#ffd43b", "#ff922b", "#ffffff"],
      });
    }
  }
}

function originOf(el?: HTMLElement | null) {
  if (!el) return undefined;
  const r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
}

export function QuoteBlock({ quote, className = "" }: { quote: Quote; className?: string }) {
  const o = quote.original ?? "";
  const font = /[가-힣]/.test(o) ? "ko" : /[぀-ヿ]/.test(o) ? "ja" : /[㐀-鿿]/.test(o) ? "han" : "";
  return (
    <figure className={`rounded-2xl bg-surface-2 px-4 py-3 text-left ${className}`}>
      {quote.original && (
        <p className={`font-semibold ${font ? `${font} text-lg` : "italic"}`}>{font ? quote.original : `“${quote.original}”`}</p>
      )}
      {quote.reading && <p className="text-xs text-muted">{quote.reading}</p>}
      <p className={quote.original ? "mt-1 text-sm text-muted" : "text-sm font-medium"}>{quote.text}</p>
      {quote.by && <figcaption className="mt-1 text-xs font-semibold text-muted">— {quote.by}</figcaption>}
    </figure>
  );
}

const CATEGORY: Record<Celebration["type"], QuoteCategory> = {
  streak: "streak",
  milestone: "milestone",
  goal: "goal",
  rank: "rank",
};

type Queued = { id: number; c: Celebration; quote: Quote };

function CelebrationCard({ item, tier }: { item: Queued; tier: number }) {
  const c = item.c;
  if (c.type === "streak") {
    return (
      <>
        <div className="relative mx-auto mb-4 grid size-32 place-items-center">
          <span className="absolute inset-0 rounded-full bg-accent/25 animate-ring" />
          <FlameIcon tier={Math.max(c.tierUp?.index ?? tier, 1)} size={100} animated />
          <span className="absolute bottom-3 font-mono text-3xl font-bold text-white drop-shadow">{c.days}</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Chuỗi ngày học</p>
        <h2 className="mt-1 text-3xl font-extrabold">{c.days} ngày liên tiếp</h2>
        {c.tierUp && (
          <div data-tier={c.tierUp.index} className="accent-scope mt-3 inline-flex items-center gap-2 rounded-full border-[1.5px] border-accent bg-accent-soft px-3 py-1.5 text-sm font-semibold animate-pop">
            <span className="size-3.5 rounded-full bg-accent" />
            Mở khóa màu “{c.tierUp.name}”
          </div>
        )}
        {(c.restored || c.earnedFreeze) && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {c.restored && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#1c7ed6]/40 bg-[#1c7ed6]/10 px-3 py-1.5 text-sm font-semibold animate-pop">
                <ShieldCheck size={16} className="text-[#1c7ed6]" />
                Đã lấy lại chuỗi bằng 1 lượt giữ chuỗi · còn {c.freezes ?? 0}
              </span>
            )}
            {c.earnedFreeze && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#1c7ed6]/40 bg-[#1c7ed6]/10 px-3 py-1.5 text-sm font-semibold animate-pop">
                <ShieldCheck size={16} className="text-[#1c7ed6]" />
                Nhận 1 lượt giữ chuỗi · có {c.freezes ?? 1}
              </span>
            )}
          </div>
        )}
      </>
    );
  }
  if (c.type === "goal") {
    return (
      <>
        <div className="relative mx-auto mb-4 grid size-28 place-items-center">
          <span className="absolute inset-0 rounded-full bg-good/20 animate-ring" />
          <span className="grid size-24 place-items-center rounded-full bg-good text-white shadow-[0_5px_0_color-mix(in_oklab,var(--good)_65%,black)] animate-pop">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" className="check-draw" />
            </svg>
          </span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{LANGS[c.lang].name}</p>
        <h2 className="mt-1 text-3xl font-extrabold">Xong mục tiêu hôm nay</h2>
        <p className="mt-1 text-muted">{c.count} từ mới đã vào bộ nhớ của bạn.</p>
      </>
    );
  }
  if (c.type === "rank") {
    return (
      <>
        <div className="relative mx-auto mb-4 grid size-32 place-items-center">
          <span className="absolute inset-2 rounded-full animate-ring" style={{ background: `${c.color}55` }} />
          <span className="absolute inset-3 rounded-full" style={{ background: `radial-gradient(circle, ${c.color}40, transparent 70%)` }} />
          <KnightIcon color={c.color} index={c.index} size={104} className="relative animate-pop" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Thăng hạng · {LANGS[c.lang].name}</p>
        <h2 className="mt-1 text-3xl font-extrabold">{c.title}</h2>
        <p className="mt-1 font-mono text-sm font-semibold text-muted">
          {LANGS[c.lang].standard} · {c.level}
        </p>
      </>
    );
  }
  return (
    <>
      <div className="mx-auto mb-4 grid size-28 place-items-center rounded-[28px] bg-accent text-accent-ink shadow-[0_6px_0_var(--accent-deep)] animate-bob">
        <span className="font-mono text-4xl font-bold">{c.count}</span>
      </div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Cột mốc mới</p>
      <h2 className="mt-1 text-3xl font-extrabold">{c.count} mục đã học</h2>
    </>
  );
}

export function CelebrationProvider({ tier, children }: { tier: number; children: React.ReactNode }) {
  const [queue, setQueue] = useState<Queued[]>([]);

  const celebrate = useCallback((items: Celebration[] | undefined) => {
    if (!items?.length) return;
    const now = Date.now();
    setQueue((q) => [
      ...q,
      ...items.map((c, i) => ({ id: now + i, c, quote: pickQuote(CATEGORY[c.type], now / 7 + i) })),
    ]);
  }, []);

  const burst = useCallback((el?: HTMLElement | null, opts?: { big?: boolean }) => {
    void play(opts?.big ? "goal" : "small", { origin: originOf(el) });
  }, []);

  const fx = useCallback((effect: Effect, el?: HTMLElement | null) => {
    void play(effect, { origin: originOf(el) });
  }, []);

  const current = queue[0];
  useModalViewport(Boolean(current));

  // Each card plays its own effect when it appears.
  useEffect(() => {
    if (!current) return;
    void play(current.c.type, { color: current.c.type === "rank" ? current.c.color : undefined });
  }, [current]);

  const next = () => setQueue((q) => q.slice(1));

  return (
    <CelebrateContext.Provider value={{ celebrate, burst, fx }}>
      {children}
      {current && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center overscroll-contain bg-black/45 p-4 backdrop-blur-sm animate-rise"
          role="dialog"
          aria-modal="true"
          onClick={next}
        >
          <div
            key={current.id}
            className="card w-full max-w-sm p-7 text-center shadow-2xl animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <CelebrationCard item={current} tier={tier} />
            <QuoteBlock quote={current.quote} className="mt-5" />
            <button className="btn btn-primary mt-5 w-full" onClick={next} autoFocus>
              {queue.length > 1 ? `Tiếp tục (${queue.length - 1})` : "Tiếp tục"}
            </button>
          </div>
        </div>
      )}
    </CelebrateContext.Provider>
  );
}
