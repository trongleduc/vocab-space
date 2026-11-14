"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { Celebration } from "@/lib/gamification";
import { FlameIcon } from "./icons";

type Ctx = {
  celebrate: (items: Celebration[] | undefined) => void;
  burst: (origin?: HTMLElement | null, opts?: { big?: boolean }) => void;
};

const CelebrateContext = createContext<Ctx>({ celebrate: () => {}, burst: () => {} });

export const useCelebrate = () => useContext(CelebrateContext);

function accentColors() {
  const s = getComputedStyle(document.querySelector(".accent-scope") ?? document.documentElement);
  const accent = s.getPropertyValue("--accent").trim() || "#121212";
  const ink = s.getPropertyValue("--ink").trim() || "#121212";
  return [accent, ink, "#ffd43b", "#ff922b", "#ffffff"];
}

async function fire(origin?: { x: number; y: number }, big = false) {
  const confetti = (await import("canvas-confetti")).default;
  const colors = accentColors();
  if (big) {
    const end = Date.now() + 900;
    (function frame() {
      confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.75 }, colors, disableForReducedMotion: true });
      confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.75 }, colors, disableForReducedMotion: true });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    return;
  }
  confetti({
    particleCount: 36,
    spread: 70,
    startVelocity: 28,
    scalar: 0.8,
    ticks: 120,
    origin: origin ?? { x: 0.5, y: 0.6 },
    colors,
    disableForReducedMotion: true,
  });
}

export function CelebrationProvider({ tier, children }: { tier: number; children: React.ReactNode }) {
  const [queue, setQueue] = useState<Celebration[]>([]);

  const celebrate = useCallback((items: Celebration[] | undefined) => {
    if (!items?.length) return;
    setQueue((q) => [...q, ...items]);
    void fire(undefined, true);
  }, []);

  const burst = useCallback((el?: HTMLElement | null, opts?: { big?: boolean }) => {
    if (opts?.big) return void fire(undefined, true);
    if (!el) return void fire();
    const r = el.getBoundingClientRect();
    void fire({ x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight });
  }, []);

  const current = queue[0];
  const next = () => {
    setQueue((q) => q.slice(1));
    if (queue.length > 1) void fire(undefined, true);
  };

  return (
    <CelebrateContext.Provider value={{ celebrate, burst }}>
      {children}
      {current && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-4 backdrop-blur-sm animate-rise"
          role="dialog"
          aria-modal="true"
          onClick={next}
        >
          <div
            className="card w-full max-w-sm p-8 text-center shadow-2xl animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {current.type === "streak" ? (
              <>
                <div className="relative mx-auto mb-4 grid size-32 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-accent/25 animate-ring" />
                  <FlameIcon tier={Math.max(tier, 1)} size={112} animated />
                  <span className="absolute bottom-3 font-mono text-3xl font-bold text-white drop-shadow">
                    {current.days}
                  </span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Chuỗi ngày học</p>
                <h2 className="mt-1 text-3xl font-extrabold">{current.days} ngày liên tiếp</h2>
                <p className="mt-2 text-muted">
                  {current.days >= 30
                    ? "Bền bỉ thật sự. Ngọn lửa của bạn đang cháy rất mạnh."
                    : current.days >= 7
                      ? "Một tuần không ngắt quãng. Giữ nhịp này nhé."
                      : "Quay lại đều đặn là cách nhớ từ lâu nhất."}
                </p>
              </>
            ) : (
              <>
                <div className="mx-auto mb-4 grid size-28 place-items-center rounded-[28px] bg-accent text-accent-ink animate-bob">
                  <span className="font-mono text-4xl font-bold">{current.count}</span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Cột mốc mới</p>
                <h2 className="mt-1 text-3xl font-extrabold">{current.count} từ đã học</h2>
                <p className="mt-2 text-muted">Vốn từ của bạn vừa lên một bậc. Tiếp tục ôn để không quên nhé.</p>
              </>
            )}
            <button className="btn btn-primary mt-6 w-full" onClick={next} autoFocus>
              Tiếp tục
            </button>
          </div>
        </div>
      )}
    </CelebrateContext.Provider>
  );
}
