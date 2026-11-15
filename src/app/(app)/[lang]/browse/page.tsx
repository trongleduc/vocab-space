import { Search } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState, PageHeader } from "@/components/ui";
import { WordGrid } from "@/components/word-grid";
import { requireUser } from "@/lib/auth";
import { isLang, LANGS } from "@/lib/langs";
import { browseItems, getFacets, getToday } from "@/lib/queries";

type Params = { set?: string; by?: string; level?: string; topic?: string; letter?: string; q?: string; status?: string; page?: string };

function href(lang: string, current: Params, patch: Partial<Params>) {
  const next = { ...current, ...patch };
  if (!("page" in patch)) delete next.page;
  const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]).toString();
  return `/${lang}/browse${qs ? `?${qs}` : ""}`;
}

export default async function BrowsePage({ params, searchParams }: PageProps<"/[lang]/browse">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const sp = (await searchParams) as Params;
  const cfg = LANGS[lang];
  const user = await requireUser();
  const kind = sp.set === "extra" ? cfg.extraKind : cfg.wordKind;
  const by = sp.by === "topic" || sp.by === "letter" ? sp.by : "level";
  const status = sp.status === "learned" || sp.status === "new" ? sp.status : undefined;

  const [today, facets, result] = await Promise.all([
    getToday(),
    getFacets(kind),
    browseItems(user.id, {
      kind,
      level: sp.level,
      topic: sp.topic,
      letter: sp.letter,
      q: sp.q?.trim() || undefined,
      status,
      page: Number(sp.page) || 1,
    }),
  ]);
  const levels = cfg.levels.filter((l) => facets.levels.includes(l));

  return (
    <div>
      <PageHeader
        eyebrow={cfg.name}
        title="Thư viện"
        description={cfg.browseDescription}
      />

      <div className="card mb-6 space-y-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={href(lang, {}, { set: undefined })} data-active={kind === cfg.wordKind} className="chip">
            Từ vựng
          </Link>
          <Link href={href(lang, {}, { set: "extra" })} data-active={kind === cfg.extraKind} className="chip">
            {cfg.extraLabel}
          </Link>
          <span className="mx-1 h-5 w-px bg-line" />
          <form action={`/${lang}/browse`} className="relative min-w-0 flex-1">
            {sp.set && <input type="hidden" name="set" value={sp.set} />}
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              name="q"
              defaultValue={sp.q}
              placeholder={cfg.searchPlaceholder}
              className="field min-h-10 pl-9"
            />
          </form>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-muted">Xếp theo</span>
          {(
            [
              ["level", "Cấp độ"],
              ["topic", "Chủ đề"],
              ["letter", "Chữ cái"],
            ] as const
          ).map(([k, label]) => (
            <Link key={k} href={href(lang, { set: sp.set, q: sp.q, status: sp.status }, { by: k })} data-active={by === k} className="chip">
              {label}
            </Link>
          ))}
          <span className="mx-1 h-5 w-px bg-line" />
          {(
            [
              [undefined, "Tất cả"],
              ["new", "Chưa học"],
              ["learned", "Đã học"],
            ] as const
          ).map(([k, label]) => (
            <Link key={label} href={href(lang, sp, { status: k })} data-active={status === k} className="chip">
              {label}
            </Link>
          ))}
        </div>

        <div className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5">
          {by === "level" &&
            [undefined, ...levels].map((l) => (
              <Link key={l ?? "all"} href={href(lang, sp, { level: l })} data-active={sp.level === l} className="chip font-mono">
                {l ?? "Tất cả"}
              </Link>
            ))}
          {by === "topic" &&
            [undefined, ...facets.topics].map((t) => (
              <Link key={t ?? "all"} href={href(lang, sp, { topic: t })} data-active={sp.topic === t} className="chip">
                {t ?? "Tất cả"}
              </Link>
            ))}
          {by === "letter" &&
            [undefined, ...facets.letters].map((t) => (
              <Link
                key={t ?? "all"}
                href={href(lang, sp, { letter: t })}
                data-active={sp.letter === t}
                className={`chip ${t ? `w-9 justify-center px-0 ${/[A-Z#]/.test(t) ? "font-mono" : cfg.font}` : ""}`}
              >
                {t ?? "Tất cả"}
              </Link>
            ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-muted">{result.total} mục</p>

      <WordGrid
        key={JSON.stringify([kind, sp.level, sp.topic, sp.letter, sp.q, status, result.page])}
        items={result.items}
        today={today}
        speech={cfg.speech}
        empty={<EmptyState title="Không tìm thấy mục nào">Thử bỏ bớt bộ lọc hoặc tìm từ khác.</EmptyState>}
      />

      {result.pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {result.page > 1 ? (
            <Link href={href(lang, sp, { page: String(result.page - 1) })} className="btn btn-sm">
              Trang trước
            </Link>
          ) : (
            <span className="btn btn-sm opacity-40">Trang trước</span>
          )}
          <span className="font-mono text-sm tabular-nums text-muted">
            {result.page}/{result.pages}
          </span>
          {result.page < result.pages ? (
            <Link href={href(lang, sp, { page: String(result.page + 1) })} className="btn btn-sm">
              Trang sau
            </Link>
          ) : (
            <span className="btn btn-sm opacity-40">Trang sau</span>
          )}
        </div>
      )}
    </div>
  );
}
