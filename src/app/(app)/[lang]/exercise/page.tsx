import { notFound } from "next/navigation";
import { Cloze } from "@/components/cloze";
import { PracticeFilters, type PracticeParams } from "@/components/practice-filters";
import { EmptyState, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { isLang, LANGS } from "@/lib/langs";
import { getClozeQuestions, type PracticeSource } from "@/lib/queries";

const SOURCES = ["today", "learned", "mistakes", "level"];

export default async function ExercisePage({ params, searchParams }: PageProps<"/[lang]/exercise">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const sp = (await searchParams) as PracticeParams;
  const cfg = LANGS[lang];
  const user = await requireUser();
  const source = (SOURCES.includes(sp.source ?? "") ? sp.source : "learned") as PracticeSource;
  const level = sp.level ?? cfg.levels[0];
  const questions = await getClozeQuestions(user, lang, source, level);

  return (
    <div>
      <PageHeader
        eyebrow={cfg.name}
        title="Bài tập điền từ"
        description={cfg.exerciseDescription}
      />
      <PracticeFilters base={`/${lang}/exercise`} sp={sp} levels={cfg.levels} />
      {questions.length === 0 ? (
        <EmptyState title="Chưa đủ câu để làm bài">
          Bài tập được tạo từ câu ví dụ của các từ bạn đã học. Hãy học thêm vài từ hoặc đổi nguồn câu hỏi.
        </EmptyState>
      ) : (
        <Cloze key={`${source}-${level}`} questions={questions} speech={cfg.speech} font={cfg.font} />
      )}
    </div>
  );
}
