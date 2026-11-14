import { notFound } from "next/navigation";
import { Flashcards } from "@/components/flashcards";
import { PracticeFilters, type PracticeParams } from "@/components/practice-filters";
import { EmptyState, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { isLang, LANGS } from "@/lib/langs";
import { getFlashcards, type PracticeSource } from "@/lib/queries";

const SOURCES = ["today", "learned", "mistakes", "level"];

export default async function FlashcardsPage({ params, searchParams }: PageProps<"/[lang]/flashcards">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const sp = (await searchParams) as PracticeParams;
  const cfg = LANGS[lang];
  const user = await requireUser();
  const source = (SOURCES.includes(sp.source ?? "") ? sp.source : "learned") as PracticeSource;
  const level = sp.level ?? cfg.levels[0];
  const mode = sp.mode === "quiz" ? "quiz" : "flip";
  const cards = await getFlashcards(user.id, lang, source, level);

  return (
    <div>
      <PageHeader
        eyebrow={cfg.name}
        title="Flashcard"
        description="Lật thẻ và tự chấm, hoặc làm trắc nghiệm chọn nghĩa. Từ sai được lưu lại và ưu tiên trong lượt ôn tập tiếp theo."
      />
      <PracticeFilters
        base={`/${lang}/flashcards`}
        sp={sp}
        levels={cfg.levels}
        modes={[
          ["flip", "Lật thẻ"],
          ["quiz", "Trắc nghiệm"],
        ]}
      />
      {cards.length === 0 ? (
        <EmptyState title="Chưa có thẻ nào">
          {source === "mistakes"
            ? "Bạn chưa trả lời sai từ nào. Tuyệt vời!"
            : source === "learned"
              ? "Học vài từ ở trang Hôm nay trước, rồi quay lại luyện thẻ."
              : "Không có từ phù hợp với bộ lọc này."}
        </EmptyState>
      ) : (
        <Flashcards key={`${source}-${level}-${mode}`} cards={cards} speech={cfg.speech} mode={mode} />
      )}
    </div>
  );
}
