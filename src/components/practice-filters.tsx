import Link from "next/link";

export type PracticeParams = { source?: string; level?: string; mode?: string };

export function PracticeFilters({
  base,
  sp,
  levels,
  modes,
}: {
  base: string;
  sp: PracticeParams;
  levels: string[];
  modes?: [string, string][];
}) {
  const link = (patch: Partial<PracticeParams>) => {
    const next = { ...sp, ...patch };
    if (next.source !== "level") delete next.level;
    const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
    return `${base}${qs ? `?${qs}` : ""}`;
  };
  const source = sp.source ?? "learned";
  const sources: [string, string][] = [
    ["learned", "Từ đã học"],
    ["today", "Từ hôm nay"],
    ["mistakes", "Từ hay sai"],
    ["level", "Theo cấp độ"],
  ];
  return (
    <div className="card mb-6 space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 text-sm font-semibold text-muted">Nguồn</span>
        {sources.map(([k, label]) => (
          <Link key={k} href={link({ source: k })} data-active={source === k} className="chip">
            {label}
          </Link>
        ))}
      </div>
      {source === "level" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-sm font-semibold text-muted">Cấp độ</span>
          {levels.map((l) => (
            <Link key={l} href={link({ level: l })} data-active={(sp.level ?? levels[0]) === l} className="chip font-mono">
              {l}
            </Link>
          ))}
        </div>
      )}
      {modes && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-sm font-semibold text-muted">Chế độ</span>
          {modes.map(([k, label], i) => (
            <Link key={k} href={link({ mode: k })} data-active={(sp.mode ?? modes[0][0]) === k || (!sp.mode && i === 0)} className="chip">
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
