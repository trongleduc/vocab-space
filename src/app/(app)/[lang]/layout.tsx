import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LangTabs } from "@/components/lang-tabs";
import { EnableLanguageButton } from "@/components/language-picker";
import { requireUser } from "@/lib/auth";
import { isLang, LANG_CODES, LANGS, type Lang } from "@/lib/langs";

export function generateStaticParams() {
  return LANG_CODES.map((lang) => ({ lang }));
}

/** Pages of a language the user turned off still work; this banner offers to turn it back on. */
async function DisabledNotice({ lang }: { lang: Lang }) {
  const user = await requireUser();
  if (user.langs.includes(lang)) return null;
  return (
    <div className="card mb-5 flex flex-wrap items-center justify-between gap-3 border-dashed p-4">
      <p className="text-sm text-muted">
        Bạn đang tắt <span className="font-semibold text-ink">{LANGS[lang].name}</span>. Ngôn ngữ này không hiện trong menu
        và không được đưa vào ôn tập.
      </p>
      <EnableLanguageButton lang={lang} />
    </div>
  );
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div>
      <Suspense fallback={null}>
        <DisabledNotice lang={lang} />
      </Suspense>
      <LangTabs lang={lang} extraLabel={LANGS[lang].extraLabel} />
      {children}
    </div>
  );
}
