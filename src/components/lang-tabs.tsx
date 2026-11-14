"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function LangTabs({ lang, extraLabel }: { lang: string; extraLabel: string }) {
  const pathname = usePathname();
  const tabs = [
    { href: `/${lang}`, label: "Hôm nay" },
    { href: `/${lang}/browse`, label: "Thư viện" },
    { href: `/${lang}/expressions`, label: extraLabel },
    { href: `/${lang}/flashcards`, label: "Flashcard" },
    { href: `/${lang}/exercise`, label: "Điền từ" },
    { href: `/${lang}/history`, label: "Theo ngày" },
  ];
  return (
    <nav className="no-scrollbar -mx-4 mb-6 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {tabs.map((t) => {
        const active = t.href === `/${lang}` ? pathname === t.href : pathname.startsWith(t.href);
        return (
          <Link key={t.href} href={t.href} data-active={active} className="chip h-9 px-4">
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
