"use client";

import { BookOpen, Home, LogOut, RotateCcw, Settings2, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import type { Rank } from "@/lib/gamification";
import { LANGS, type Lang } from "@/lib/langs";
import { CelebrationProvider } from "./celebrate";
import { FloatingReview } from "./floating-review";
import { FlameIcon, KnightIcon } from "./icons";
import { ThemeToggle } from "./theme-toggle";

export type FrameStats = {
  streak: number;
  activeToday: boolean;
  tier: number;
  tierName: string;
  dueTotal: number;
  total: number;
  /** Languages the user is learning, in display order. */
  langs: Lang[];
  ranks: Record<Lang, Rank>;
};

type NavItem = {
  href: string;
  label: string;
  /** Shorter label for the mobile bottom nav. */
  short?: string;
  icon: React.ReactNode;
  match: (p: string) => boolean;
};

export function LangGlyph({ lang, className = "" }: { lang: Lang; className?: string }) {
  const cfg = LANGS[lang];
  return cfg.font ? (
    <span className={`${cfg.font} text-[17px] font-semibold leading-none ${className}`}>{cfg.short}</span>
  ) : (
    <span className={`text-[13px] font-bold leading-none tracking-tight ${className}`}>{cfg.short}</span>
  );
}

function nav(isAdmin: boolean, langs: Lang[]): NavItem[] {
  const items: NavItem[] = [
    { href: "/", label: "Tổng quan", icon: <Home size={20} />, match: (p) => p === "/" },
    ...langs.map((l) => ({
      href: `/${l}`,
      label: LANGS[l].name,
      short: langs.length > 2 ? LANGS[l].navLabel : LANGS[l].name,
      icon: <LangGlyph lang={l} />,
      match: (p: string) => p === `/${l}` || p.startsWith(`/${l}/`),
    })),
    { href: "/review", label: "Ôn tập", icon: <RotateCcw size={20} />, match: (p) => p.startsWith("/review") },
    { href: "/account", label: "Hồ sơ", icon: <UserRound size={20} />, match: (p) => p.startsWith("/account") },
  ];
  if (isAdmin) {
    items.push({
      href: "/admin",
      label: "Quản trị",
      icon: <Settings2 size={20} />,
      match: (p) => p.startsWith("/admin"),
    });
  }
  return items;
}

function Logo({ name }: { name: string }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-[11px] bg-accent text-accent-ink shadow-[0_3px_0_var(--accent-deep)]">
        <BookOpen size={18} strokeWidth={2.4} />
      </span>
      <span className="text-[17px] font-extrabold tracking-tight">{name}</span>
    </Link>
  );
}

export function StreakBadge({ stats, compact = false }: { stats: FrameStats; compact?: boolean }) {
  return (
    <Link
      href="/account"
      className="flex items-center gap-1 rounded-full border-[1.5px] border-line bg-surface py-1 pl-1.5 pr-3 transition hover:border-accent"
      title={stats.activeToday ? `Chuỗi ${stats.streak} ngày` : "Học một từ hôm nay để giữ lửa"}
    >
      <FlameIcon tier={stats.tier} lit={stats.activeToday && stats.streak > 0} size={compact ? 22 : 26} animated />
      <span className="font-mono text-[15px] font-bold tabular-nums">{stats.streak}</span>
    </Link>
  );
}

function RankBadges({ stats }: { stats: FrameStats }) {
  return (
    <div className="flex items-center gap-1">
      {stats.langs.map((l) => (
        <Link
          key={l}
          href="/account"
          className="flex items-center gap-1 rounded-full border-[1.5px] border-line bg-surface py-0.5 pl-0.5 pr-2.5 text-xs font-semibold transition hover:border-accent"
          title={`${LANGS[l].name}: ${stats.ranks[l].title} (${stats.ranks[l].level})`}
        >
          <KnightIcon color={stats.ranks[l].color} index={stats.ranks[l].index} size={26} />
          <span className={LANGS[l].font}>{LANGS[l].short}</span>
        </Link>
      ))}
    </div>
  );
}

export function AppFrame({
  user,
  appName,
  stats,
  children,
}: {
  user: { name: string; role: "admin" | "member" };
  appName: string;
  stats: FrameStats;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const items = nav(user.role === "admin", stats.langs);
  // The admin link lives on the profile page on mobile; the bar grows with the number of languages.
  const mobileItems = items.filter((i) => i.href !== "/admin");

  return (
    <div className="accent-scope min-h-dvh" data-tier={stats.tier}>
      <CelebrationProvider tier={stats.tier}>
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-[1.5px] border-line bg-surface px-4 py-6 lg:flex">
          <div className="px-2">
            <Logo name={appName} />
          </div>
          <nav className="mt-8 flex flex-col gap-1">
            {items.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold transition ${
                    active ? "bg-accent text-accent-ink shadow-[0_3px_0_var(--accent-deep)]" : "text-muted hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  <span className="grid w-6 place-items-center">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto space-y-3">
            <div className="rounded-2xl border-[1.5px] border-line p-3">
              <div className="flex items-center gap-2">
                <FlameIcon tier={stats.tier} lit={stats.activeToday && stats.streak > 0} size={30} animated />
                <div className="leading-tight">
                  <div className="font-bold">{stats.streak} ngày</div>
                  <div className="text-xs text-muted">{stats.activeToday ? stats.tierName : "Chưa học hôm nay"}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 px-1">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{user.name}</div>
                <div className="text-xs text-muted">{user.role === "admin" ? "Quản trị viên" : "Thành viên"}</div>
              </div>
              <div className="flex gap-1.5">
                <ThemeToggle />
                <form action={logout}>
                  <button className="btn btn-sm btn-icon" aria-label="Đăng xuất" title="Đăng xuất">
                    <LogOut size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b-[1.5px] border-line bg-bg/85 backdrop-blur-md lg:ml-64">
          <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
            <div className="lg:hidden">
              <Logo name={appName} />
            </div>
            <div className="hidden text-sm text-muted lg:block">
              Xin chào, <span className="font-semibold text-ink">{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <RankBadges stats={stats} />
              </div>
              <StreakBadge stats={stats} compact />
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        <main className="pb-28 lg:ml-64 lg:pb-12">
          <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-8">{children}</div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t-[1.5px] border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          <div
            className="mx-auto grid max-w-lg"
            style={{ gridTemplateColumns: `repeat(${mobileItems.length}, minmax(0, 1fr))` }}
          >
            {mobileItems.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-16 min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition ${
                    active ? "text-ink" : "text-muted"
                  }`}
                >
                  <span
                    className={`grid h-8 w-full max-w-12 place-items-center rounded-full transition ${active ? "bg-accent text-accent-ink" : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span className="max-w-full truncate px-0.5">{item.short ?? item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <FloatingReview due={stats.dueTotal} hasLearned={stats.total > 0} />
      </CelebrationProvider>
    </div>
  );
}
