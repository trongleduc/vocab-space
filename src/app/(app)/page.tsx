import { ArrowRight, Plus, RotateCcw } from "lucide-react";
import Link from "next/link";
import { FlameIcon } from "@/components/icons";
import { Bar, PageHeader, RankLine } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { formatDay, weekdayShort } from "@/lib/dates";
import { LANG_CODES, LANGS } from "@/lib/langs";
import { getDailyItems, getStats } from "@/lib/queries";

export default async function Dashboard() {
  const user = await requireUser();
  const stats = await getStats(user);
  const todays = await Promise.all(user.langs.map((l) => getDailyItems(user, LANGS[l].wordKind)));
  const others = LANG_CODES.filter((l) => !user.langs.includes(l));
  const weekMax = Math.max(1, ...stats.week.map((d) => d.learned + d.reviewed));
  const tier = stats.tier;
  const lit = stats.activeToday && stats.streak > 0;

  return (
    <div>
      <PageHeader eyebrow={formatDay(stats.today)} title={`Chào ${user.name}`} description="Mỗi ngày một ít, đều đặn là đủ." />

      <section className="card relative overflow-hidden p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-5">
          <div className="relative grid size-20 shrink-0 place-items-center rounded-3xl bg-surface-2">
            <FlameIcon tier={tier.index} lit={lit} size={60} animated />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-5xl font-bold tabular-nums">{stats.streak}</span>
              <span className="text-lg font-semibold">ngày liên tiếp</span>
            </div>
            <p className="mt-1 text-muted">
              {lit
                ? tier.next
                  ? `Màu "${tier.name}". Còn ${tier.next.min - stats.streak} ngày nữa để lên "${tier.next.name}".`
                  : `Bạn đang ở cấp lửa cao nhất: "${tier.name}".`
                : stats.streak > 0
                  ? "Học ít nhất một từ hôm nay để giữ chuỗi."
                  : "Học một từ để bắt đầu chuỗi ngày đầu tiên."}
            </p>
          </div>
          <div className="flex w-full items-end gap-2 sm:w-auto" aria-label="Hoạt động 7 ngày qua">
            {stats.week.map((d) => {
              const v = d.learned + d.reviewed;
              const isToday = d.day === stats.today;
              return (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5 sm:w-9 sm:flex-none">
                  <div className="flex h-16 w-full items-end overflow-hidden rounded-lg bg-surface-2">
                    <div
                      className={`w-full rounded-lg ${v ? "bg-accent" : ""}`}
                      style={{ height: `${v ? Math.max(12, (v / weekMax) * 100) : 0}%` }}
                      title={`${d.learned} từ mới, ${d.reviewed} lượt ôn`}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold ${isToday ? "text-ink" : "text-muted"}`}>
                    {weekdayShort(d.day)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {user.langs.map((l, i) => {
          const cfg = LANGS[l];
          const t = todays[i];
          const due = (stats.due[cfg.wordKind] ?? 0) + (stats.due[cfg.extraKind] ?? 0);
          const complete = t.quota > 0 && t.done >= t.quota;
          return (
            <section key={l} className="card flex flex-col p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-11 place-items-center rounded-2xl bg-ink text-surface ${cfg.font ? `${cfg.font} text-xl` : "text-sm"} font-bold`}
                  >
                    {cfg.short}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold">{cfg.name}</h2>
                    <p className="text-sm text-muted">{cfg.levelSummary}</p>
                  </div>
                </div>
                {due > 0 && (
                  <span className="rounded-full bg-bad/10 px-2.5 py-1 text-xs font-bold text-bad">{due} cần ôn</span>
                )}
              </div>

              <div className="mt-5">
                <div className="mb-1.5 flex items-baseline justify-between text-sm">
                  <span className="font-semibold">Mục tiêu hôm nay</span>
                  <span className="font-mono font-semibold tabular-nums">
                    {t.done}/{t.quota}
                  </span>
                </div>
                <Bar value={t.done} max={t.quota} />
                {complete && <p className="mt-2 text-sm font-semibold text-good">Đã hoàn thành mục tiêu hôm nay</p>}
              </div>

              <div className="mt-5 border-t-[1.5px] border-line pt-5">
                <RankLine rank={stats.ranks[l]} standard={cfg.standard} />
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <Link href={`/${l}`} className="btn btn-primary flex-1">
                  {complete ? "Xem lại từ hôm nay" : "Học tiếp"} <ArrowRight size={16} />
                </Link>
                <Link href={complete ? `/${l}/exercise?source=today` : `/${l}/flashcards`} className="btn flex-1">
                  {complete ? "Làm bài tập" : "Flashcard"}
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      {others.length > 0 && (
        <Link
          href="/account#ngon-ngu"
          className="card mt-5 flex items-center gap-4 p-4 transition hover:border-accent sm:p-5"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl border-[1.5px] border-dashed border-line text-muted">
            <Plus size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-bold">Học thêm ngôn ngữ</p>
            <p className="text-sm text-muted">
              Bật {others.map((l) => LANGS[l].name).join(", ")} trong Hồ sơ. Ngôn ngữ đang tắt không tính vào ôn tập.
            </p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-muted" />
        </Link>
      )}

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <section className="card p-6">
          <h2 className="font-bold">Cột mốc</h2>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-4xl font-bold tabular-nums">{stats.total}</span>
            <span className="text-muted">mục đã học</span>
          </div>
          {stats.nextMilestone && (
            <>
              <Bar value={stats.total} max={stats.nextMilestone} className="mt-3" />
              <p className="mt-2 text-sm text-muted">
                Còn {stats.nextMilestone - stats.total} để chạm mốc {stats.nextMilestone}
              </p>
            </>
          )}
        </section>
        <section className="card flex flex-col p-6">
          <h2 className="font-bold">Ôn tập ngắt quãng</h2>
          <p className="mt-1 text-sm text-muted">
            Từ đã học quay lại sau 1, 3, 7… ngày. Từ trả lời sai được đưa lên đầu hàng.
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="font-mono text-3xl font-bold tabular-nums">
              {stats.dueTotal}
              <span className="ml-1.5 font-sans text-sm font-medium text-muted">đến hạn</span>
            </span>
            <Link href="/review" className="btn">
              <RotateCcw size={16} /> Ôn ngay
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
