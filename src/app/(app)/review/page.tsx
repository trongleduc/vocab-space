import { ReviewPanel } from "@/components/floating-review";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getStats } from "@/lib/queries";

export default async function ReviewPage() {
  const user = await requireUser();
  const stats = await getStats(user.id);
  const zh = (stats.due.zh_word ?? 0) + (stats.due.zh_phrase ?? 0);
  const en = (stats.due.en_word ?? 0) + (stats.due.en_idiom ?? 0);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Ôn tập ngắt quãng"
        description={`${stats.dueTotal} mục đến hạn · Tiếng Trung ${zh} · Tiếng Anh ${en}. Từ trả lời sai được ưu tiên lên trước.`}
      />
      <div className="card p-5 sm:p-7">
        <ReviewPanel key={stats.dueTotal === 0 ? "empty" : "due"} due={stats.dueTotal} />
      </div>
    </div>
  );
}
