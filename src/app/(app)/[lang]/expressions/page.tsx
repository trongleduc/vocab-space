import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleLine } from "@/components/example";
import { LearnAllButton } from "@/components/learn-all";
import { SpeakButton } from "@/components/speak";
import { spokenForm } from "@/lib/voices";
import { EmptyState, PageHeader } from "@/components/ui";
import { WordGrid } from "@/components/word-grid";
import { requireUser } from "@/lib/auth";
import { formatDay } from "@/lib/dates";
import { isLang, LANGS } from "@/lib/langs";
import { getDailyItems, getHistory, getToday } from "@/lib/queries";

export default async function ExpressionsPage({ params }: PageProps<"/[lang]/expressions">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const cfg = LANGS[lang];
  const user = await requireUser();
  const [today, daily, history] = await Promise.all([
    getToday(),
    getDailyItems(user, cfg.extraKind),
    getHistory(user.id, [cfg.extraKind], 14),
  ]);
  const past = history.filter((h) => h.day !== today);
  const font = cfg.font;

  return (
    <div>
      <PageHeader
        eyebrow={cfg.name}
        title={cfg.extraTitle}
        description={cfg.extraDescription(daily.quota)}
        actions={
          <>
            <LearnAllButton ids={daily.items.filter((i) => !i.learnedOn).map((i) => i.id)} />
            <Link href={`/${lang}/browse?set=extra`} className="btn btn-sm">
              Tất cả <ArrowRight size={15} />
            </Link>
          </>
        }
      />

      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">Hôm nay</h2>
      {daily.items.length === 0 ? (
        <EmptyState title="Đã học hết">Không còn mục mới. Quản trị viên có thể nhập thêm.</EmptyState>
      ) : (
        <WordGrid key={`${cfg.extraKind}-${today}`} items={daily.items} today={today} speech={cfg.speech} />
      )}

      {past.length > 0 && (
        <section className="mt-10 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Những ngày trước</h2>
          {past.map((group) => (
            <div key={group.day}>
              <h3 className="mb-2 font-semibold capitalize">{formatDay(group.day)}</h3>
              <ul className="card divide-y-[1.5px] divide-line">
                {group.items.map((item) => (
                  <li key={item.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`font-semibold ${font ? `${font} text-xl` : "text-lg"}`}>{item.term}</p>
                        {item.reading && <p className="text-sm text-muted">{item.reading}</p>}
                        <p className="mt-0.5">{item.meaning}</p>
                      </div>
                      <SpeakButton text={spokenForm(item.term, item.reading, cfg.speech)} lang={cfg.speech} />
                    </div>
                    {item.examples[0] && (
                      <ul className="mt-2">
                        <ExampleLine ex={item.examples[0]} font={font} speech={cfg.speech} />
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
