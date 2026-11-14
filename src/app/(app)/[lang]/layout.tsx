import { notFound } from "next/navigation";
import { LangTabs } from "@/components/lang-tabs";
import { isLang, LANGS } from "@/lib/langs";

export function generateStaticParams() {
  return [{ lang: "zh" }, { lang: "en" }];
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div>
      <LangTabs lang={lang} extraLabel={LANGS[lang].extraLabel} />
      {children}
    </div>
  );
}
