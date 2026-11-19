import { ArrowRight, Layers, PencilLine } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LearnAllButton } from "@/components/learn-all";
import { Bar, EmptyState, PageHeader } from "@/components/ui";
import { WordGrid } from "@/components/word-grid";
import { requireUser } from "@/lib/auth";
import { isLang, LANGS } from "@/lib/langs";
import { getDailyItems, getToday } from "@/lib/queries";

export default async function TodayPage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const cfg = LANGS[lang];
  const user = await requireUser();
  const [today, words, extras] = await Promise.all([
    getToday(),
    getDailyItems(user, cfg.wordKind),
    getDailyItems(user, cfg.extraKind),
  ]);
  const pendingIds = words.items.filter((i) => !i.learnedOn).map((i) => i.id);
  const complete = words.quota > 0 && words.done >= words.quota;

  return (
    <div>
      <PageHeader
        eyebrow={`${cfg.name} · ${cfg.standard}`}
        title="Từ vựng hôm nay"
        description={
          <>
            Mỗi ngày {words.quota} từ mới, xếp theo cấp độ từ dễ đến khó. Học xong từ nào thì đánh dấu từ đó.{" "}
            <Link href="/account#muc-tieu" className="font-semibold text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
              Đổi số lượng
            </Link>
          </>
        }
        actions={<LearnAllButton ids={pendingIds} />}
      />

      <div className="card mb-6 p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-semibold">{complete ? "Hoàn thành mục tiêu hôm nay" : "Tiến độ hôm nay"}</span>
          <span className="font-mono font-semibold tabular-nums">
            {words.done}/{words.quota}
          </span>
        </div>
        <Bar value={words.done} max={words.quota} />
        {complete && (
          <div className="mt-4 flex flex-wrap gap-2 animate-rise">
            <Link href={`/${lang}/flashcards?source=today`} className="btn btn-primary btn-sm">
              <Layers size={15} /> Flashcard từ hôm nay
            </Link>
            <Link href={`/${lang}/exercise?source=today`} className="btn btn-sm">
              <PencilLine size={15} /> Bài tập điền từ
            </Link>
          </div>
        )}
      </div>

      {words.items.length === 0 ? (
        <EmptyState title="Không còn từ mới">
          Bạn đã học hết kho từ hiện có. Quản trị viên có thể nhập thêm từ trong mục Quản trị.
        </EmptyState>
      ) : (
        <WordGrid key={`${cfg.wordKind}-${today}`} items={words.items} today={today} speech={cfg.speech} />
      )}

      {extras.items.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-extrabold">{cfg.extraLabel} hôm nay</h2>
              <p className="text-sm text-muted">{cfg.extraHint}</p>
            </div>
            <Link href={`/${lang}/expressions`} className="btn btn-sm btn-ghost">
              Xem tất cả <ArrowRight size={15} />
            </Link>
          </div>
          <WordGrid key={`${cfg.extraKind}-${today}`} items={extras.items} today={today} speech={cfg.speech} />
        </section>
      )}
    </div>
  );
}
