import type { Rank } from "@/lib/gamification";
import { KnightIcon } from "./icons";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-sm font-semibold text-muted">{eyebrow}</p>}
        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight sm:text-[34px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Bar({ value, max, className = "" }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-surface-2 ${className}`}>
      <div className="h-full rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function RankLine({ rank, standard }: { rank: Rank; standard: string }) {
  const span = rank.nextAt ? rank.nextAt - rank.floor : 1;
  const into = rank.nextAt ? rank.learned - rank.floor : 1;
  return (
    <div className="flex items-center gap-3">
      <KnightIcon color={rank.color} index={rank.index} size={44} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate font-bold">{rank.title}</span>
          <span className="shrink-0 font-mono text-xs font-semibold text-muted">
            {standard} · {rank.level}
          </span>
        </div>
        <Bar value={into} max={span} className="mt-1.5 h-2" />
        <p className="mt-1 text-xs text-muted">
          {rank.nextAt
            ? `${rank.learned}/${rank.nextAt} từ để đạt ${rank.nextLevel}`
            : `${rank.learned} từ · cấp cao nhất`}
        </p>
      </div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="card grid place-items-center px-6 py-14 text-center">
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <div className="mt-2 max-w-md text-muted">{children}</div>}
    </div>
  );
}
