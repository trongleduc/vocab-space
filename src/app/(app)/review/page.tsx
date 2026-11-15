import { ReviewPanel } from "@/components/floating-review";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { LANGS } from "@/lib/langs";
import { getStats } from "@/lib/queries";

export default async function ReviewPage() {
  const user = await requireUser();
  const stats = await getStats(user);
  const perLang = user.langs
    .map((l) => `${LANGS[l].name} ${(stats.due[LANGS[l].wordKind] ?? 0) + (stats.due[LANGS[l].extraKind] ?? 0)}`)
    .join(" · ");

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Ôn tập ngắt quãng"
        description={`${stats.dueTotal} mục đến hạn · ${perLang}. Từ trả lời sai được ưu tiên lên trước.`}
      />
      <div className="card p-5 sm:p-7">
        <ReviewPanel key={stats.dueTotal === 0 ? "empty" : "due"} due={stats.dueTotal} />
      </div>
    </div>
  );
}
