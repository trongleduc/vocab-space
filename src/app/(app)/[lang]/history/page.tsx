import { Flag } from "lucide-react";
import { notFound } from "next/navigation";
import { SpeakButton } from "@/components/speak";
import { EmptyState, PageHeader } from "@/components/ui";
import { LevelBadge } from "@/components/word-card";
import { requireUser } from "@/lib/auth";
import { formatDay } from "@/lib/dates";
import { isLang, LANGS } from "@/lib/langs";
import { getHistory, getToday } from "@/lib/queries";

export default async function HistoryPage({ params }: PageProps<"/[lang]/history">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const cfg = LANGS[lang];
  const user = await requireUser();
  const [today, groups] = await Promise.all([getToday(), getHistory(user.id, [cfg.wordKind, cfg.extraKind], 60)]);
  const han = lang === "zh";

  return (
    <div>
      <PageHeader eyebrow={cfg.name} title="Đã học theo ngày" description="Mọi từ bạn đã đánh dấu, nhóm theo ngày học." />
      {groups.length === 0 ? (
        <EmptyState title="Chưa có từ nào">Đánh dấu “Học xong” ở trang Hôm nay, từ sẽ xuất hiện ở đây.</EmptyState>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.day}>
              <div className="mb-2 flex items-baseline justify-between">
                <h2 className="font-bold capitalize">{g.day === today ? "Hôm nay" : formatDay(g.day)}</h2>
                <span className="font-mono text-sm text-muted">{g.items.length} mục</span>
              </div>
              <ul className="card divide-y-[1.5px] divide-line">
                {g.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className={`font-semibold ${han ? "han text-xl" : "text-[17px]"}`}>{item.term}</span>
                        {item.reading && <span className="text-sm text-muted">{item.reading}</span>}
                      </div>
                      <p className="truncate text-sm text-muted">{item.meaning}</p>
                    </div>
                    {item.priority && <Flag size={14} className="shrink-0 text-bad" aria-label="Cần ôn" />}
                    <LevelBadge level={item.level} />
                    <SpeakButton text={item.term} lang={cfg.speech} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
