import { LogOut, Settings2 } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { FlameIcon, KnightIcon } from "@/components/icons";
import { DailyGoalForm } from "@/components/daily-goal-form";
import { LanguagePicker } from "@/components/language-picker";
import { PasswordForm } from "@/components/password-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { PageHeader, RankLine } from "@/components/ui";
import { VoicePicker } from "@/components/voice-picker";
import { ttsConfigured } from "@/lib/tts";
import { requireUser } from "@/lib/auth";
import { KNIGHT_TITLES, STREAK_TIERS } from "@/lib/gamification";
import { LANG_CODES, LANGS } from "@/lib/langs";
import { getStats } from "@/lib/queries";
import { getSettings } from "@/lib/settings";

export default async function AccountPage() {
  const user = await requireUser();
  const [stats, settings] = await Promise.all([getStats(user), getSettings()]);
  const learned = Object.fromEntries(
    LANG_CODES.map((l) => [l, (stats.learned[LANGS[l].wordKind] ?? 0) + (stats.learned[LANGS[l].extraKind] ?? 0)]),
  );

  return (
    <div>
      <PageHeader
        eyebrow={user.role === "admin" ? "Quản trị viên" : "Thành viên"}
        title={user.name}
        actions={
          <>
            <ThemeToggle withLabel />
            {user.role === "admin" && (
              <Link href="/admin" className="btn btn-sm">
                <Settings2 size={15} /> Quản trị
              </Link>
            )}
            <form action={logout}>
              <button className="btn btn-sm">
                <LogOut size={15} /> Đăng xuất
              </button>
            </form>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section id="ngon-ngu" className="card scroll-mt-24 p-6 lg:col-span-2">
          <h2 className="font-bold">Ngôn ngữ đang học</h2>
          <p className="mt-1 text-sm text-muted">Chọn những ngôn ngữ bạn muốn học. Có thể đổi bất cứ lúc nào.</p>
          <div className="mt-4">
            <LanguagePicker langs={user.langs} learned={learned} />
          </div>
        </section>

        <section id="muc-tieu" className="card scroll-mt-24 p-6 lg:col-span-2">
          <h2 className="font-bold">Số lượng học mỗi ngày</h2>
          <p className="mt-1 text-sm text-muted">
            Tự chọn số từ mới và số câu/thành ngữ nhận mỗi ngày cho từng ngôn ngữ. Để trống để dùng mức mặc định.
          </p>
          <div className="mt-4">
            <DailyGoalForm
              key={JSON.stringify([user.langs, user.daily])}
              langs={user.langs}
              own={user.daily}
              defaults={settings.daily}
            />
          </div>
        </section>

        <section id="giong-doc" className="card scroll-mt-24 p-6 lg:col-span-2">
          <h2 className="font-bold">Giọng đọc</h2>
          <p className="mt-1 text-sm text-muted">
            Chạm vào một giọng để nghe thử và chọn. Lựa chọn được lưu trên thiết bị này.
          </p>
          <div className="mt-4">
            <VoicePicker langs={user.langs} server={ttsConfigured()} />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="font-bold">Xếp hạng hiệp sĩ</h2>
          <p className="mt-1 text-sm text-muted">
            Dựa trên số từ đã học, đối chiếu với lượng từ chuẩn của {user.langs.map((l) => LANGS[l].standard).join(", ")}.
          </p>
          <div className="mt-5 space-y-5">
            {user.langs.map((l) => (
              <div key={l}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{LANGS[l].name}</p>
                <RankLine rank={stats.ranks[l]} standard={LANGS[l].standard} />
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
            {KNIGHT_TITLES.map((t, i) => {
              const reached = Math.max(...LANG_CODES.map((l) => stats.ranks[l].index)) >= i;
              return (
                <div key={t.title} className={`text-center ${reached ? "" : "opacity-30 grayscale"}`} title={t.title}>
                  <KnightIcon color={t.color} index={i} size={36} className="mx-auto" />
                  <p className="mt-1 text-[10px] font-semibold leading-tight text-muted">{t.metal}</p>
                </div>
              );
            })}
          </div>
          <details className="mt-5 text-sm">
            <summary className="cursor-pointer font-semibold text-muted">Thang quy đổi</summary>
            <div className="mt-3 grid grid-cols-2 gap-4">
              {user.langs.map((l) => (
                <table key={l} className="w-full text-left">
                  <thead>
                    <tr className="text-xs text-muted">
                      <th className="pb-1 font-semibold">{LANGS[l].standard}</th>
                      <th className="pb-1 text-right font-semibold">Số từ</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {settings.rankScales[l].map((s) => (
                      <tr key={s.level}>
                        <td className="py-0.5">{s.level}</td>
                        <td className="py-0.5 text-right tabular-nums">{s.words.toLocaleString("vi-VN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </details>
        </section>

        <section className="card p-6">
          <h2 className="font-bold">Màu ngọn lửa</h2>
          <p className="mt-1 text-sm text-muted">
            Giao diện bắt đầu đen trắng và đổi màu chủ đạo khi chuỗi ngày học dài hơn.
          </p>
          <ul className="mt-5 space-y-2">
            {STREAK_TIERS.map((t, i) => {
              const current = stats.tier.index === i;
              return (
                <li
                  key={t.name}
                  data-tier={i}
                  className={`accent-scope flex items-center gap-3 rounded-2xl border-[1.5px] px-3 py-2 ${
                    current ? "border-accent bg-accent-soft" : "border-transparent"
                  }`}
                >
                  <span className="size-5 rounded-full border-[1.5px] border-line bg-accent" />
                  <FlameIcon tier={i} lit={stats.streak >= t.min && (i > 0 || stats.streak > 0)} size={22} />
                  <span className="flex-1 font-semibold">{t.name}</span>
                  <span className="font-mono text-sm text-muted">{t.min === 0 ? "0–1" : `${t.min}+`} ngày</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="font-bold">Cột mốc</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {settings.milestones.map((m) => {
              const reached = stats.total >= m;
              return (
                <span
                  key={m}
                  className={`rounded-xl border-[1.5px] px-3 py-1.5 font-mono text-sm font-bold ${
                    reached ? "border-accent-deep bg-accent text-accent-ink shadow-[0_3px_0_var(--accent-deep)]" : "border-line text-muted"
                  }`}
                >
                  {m}
                </span>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-muted">Đã học tổng cộng {stats.total} mục.</p>
        </section>

        <section className="card p-6">
          <h2 className="font-bold">Đổi mật khẩu</h2>
          <div className="mt-4">
            <PasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
