"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions/admin";
import { FormMessage } from "@/components/form-message";
import type { AppSettings } from "@/lib/settings";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function SettingsForm({ settings }: { settings: AppSettings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined);
  const scale = (l: "zh" | "en") => settings.rankScales[l].map((s) => `${s.level}: ${s.words}`).join("\n");

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-2">
      <section className="card space-y-4 p-5">
        <h2 className="font-bold">Chung</h2>
        <Field label="Tên trang web">
          <input name="appName" defaultValue={settings.appName} className="field" />
        </Field>
        <Field label="Múi giờ" hint="Dùng để tính ngày học và chuỗi ngày. Ví dụ: Asia/Ho_Chi_Minh">
          <input name="timezone" defaultValue={settings.timezone} className="field" />
        </Field>
        <Field label="Số câu mỗi lượt ôn tập">
          <input name="reviewBatch" type="number" min={3} max={50} defaultValue={settings.reviewBatch} className="field" />
        </Field>
        <Field label="Cột mốc chúc mừng" hint="Số mục đã học, ngăn cách bằng dấu phẩy.">
          <input name="milestones" defaultValue={settings.milestones.join(", ")} className="field font-mono" />
        </Field>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="font-bold">Lượng học mỗi ngày</h2>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Từ tiếng Trung">
            <input name="zh_word" type="number" min={0} max={100} defaultValue={settings.daily.zh_word} className="field" />
          </Field>
          <Field label="Câu thông dụng">
            <input name="zh_phrase" type="number" min={0} max={100} defaultValue={settings.daily.zh_phrase} className="field" />
          </Field>
          <Field label="Từ tiếng Anh">
            <input name="en_word" type="number" min={0} max={100} defaultValue={settings.daily.en_word} className="field" />
          </Field>
          <Field label="Idioms">
            <input name="en_idiom" type="number" min={0} max={100} defaultValue={settings.daily.en_idiom} className="field" />
          </Field>
        </div>
      </section>

      <section className="card space-y-4 p-5 lg:col-span-2">
        <h2 className="font-bold">Thang xếp hạng hiệp sĩ</h2>
        <p className="text-sm text-muted">
          Mỗi dòng: cấp độ: số từ tích lũy. Mặc định dùng số từ chính thức của HSK 3.0 và ước lượng phổ biến cho CEFR.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tiếng Trung (HSK 3.0)">
            <textarea name="rankZh" rows={8} defaultValue={scale("zh")} className="field font-mono text-sm" />
          </Field>
          <Field label="Tiếng Anh (CEFR)">
            <textarea name="rankEn" rows={8} defaultValue={scale("en")} className="field font-mono text-sm" />
          </Field>
        </div>
      </section>

      <div className="flex items-center gap-3 lg:col-span-2">
        <button className="btn btn-primary" disabled={pending}>
          {pending ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
        <FormMessage state={state} />
      </div>
    </form>
  );
}
