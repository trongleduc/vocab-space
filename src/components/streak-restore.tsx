"use client";

import { ShieldCheck } from "lucide-react";
import { useState, useTransition } from "react";
import { spendFreeze } from "@/app/actions/learn";
import { FREEZE_EVERY } from "@/lib/gamification";
import { useCelebrate } from "./celebrate";

export type LostStreak = { streak: number; daysLeft: number };

const deadlineText = (daysLeft: number) => (daysLeft <= 1 ? "hết hôm nay" : `còn ${daysLeft} ngày`);

/**
 * Offer to spend a streak freeze on the most recently lost streak. `banner` is the slim strip the
 * shell shows on every page; the default is the dashboard card, which also explains when the
 * member has no freeze to spend.
 */
export function StreakRestore({ lost, freezes, banner = false }: { lost: LostStreak; freezes: number; banner?: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { celebrate } = useCelebrate();
  const can = freezes > 0;

  const restore = () =>
    start(async () => {
      setError(null);
      const res = await spendFreeze();
      if ("error" in res) setError(res.error);
      else celebrate(res.celebrations);
    });

  const button = (
    <button type="button" className={`btn btn-primary ${banner ? "btn-sm" : ""}`} onClick={restore} disabled={pending || !can}>
      <ShieldCheck size={banner ? 15 : 17} strokeWidth={2.4} />
      {pending ? "Đang lấy lại..." : "Dùng lượt giữ chuỗi"}
    </button>
  );

  if (banner) {
    return (
      <div className="border-b-[1.5px] border-line bg-accent-soft">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 text-sm sm:px-6">
          <p className="min-w-0">
            <span className="font-semibold">Chuỗi {lost.streak} ngày vừa bị mất.</span>{" "}
            <span className="text-muted">
              Lấy lại bằng 1 lượt ({deadlineText(lost.daysLeft)}, bạn có {freezes} lượt).
            </span>
            {error && <span className="ml-1 font-semibold text-bad">{error}</span>}
          </p>
          {button}
        </div>
      </div>
    );
  }

  return (
    <section id="giu-chuoi" className="card mb-5 scroll-mt-24 border-accent/50 bg-accent-soft p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#1c7ed6] text-white shadow-[0_3px_0_#1864ab]">
          <ShieldCheck size={24} strokeWidth={2.4} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold">Chuỗi {lost.streak} ngày vừa bị mất</h2>
          <p className="mt-0.5 text-sm text-muted">
            {can
              ? `Dùng 1 lượt giữ chuỗi để lấy lại chuỗi này (${deadlineText(lost.daysLeft)}). Bạn đang có ${freezes} lượt.`
              : `Bạn chưa có lượt giữ chuỗi nên không lấy lại được. Mỗi ${FREEZE_EVERY} ngày học liên tiếp được 1 lượt.`}
          </p>
          {error && <p className="mt-1 text-sm font-semibold text-bad">{error}</p>}
        </div>
        {can && button}
      </div>
    </section>
  );
}
