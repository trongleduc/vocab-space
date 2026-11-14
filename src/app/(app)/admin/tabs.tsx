"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Thành viên" },
  { href: "/admin/items", label: "Từ vựng" },
  { href: "/admin/import", label: "Nhập hàng loạt" },
  { href: "/admin/settings", label: "Cài đặt chung" },
];

export function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          data-active={t.href === "/admin" ? pathname === t.href : pathname.startsWith(t.href)}
          className="chip h-9 px-4"
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
