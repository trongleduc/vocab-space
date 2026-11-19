"use client";

import { Check, Mars, Venus, Volume2 } from "lucide-react";
import { LANGS, type Lang } from "@/lib/langs";
import { SPEEDS, VOICE_SAMPLE, VOICES } from "@/lib/voices";
import { pickDeviceVoice, setSpeed, setVoice, speak, useDeviceVoices, useVoicePrefs, voiceFor } from "./speak";

/** Choose a voice per language and a reading speed. Stored on this device. */
export function VoicePicker({ langs, server }: { langs: Lang[]; server: boolean }) {
  const prefs = useVoicePrefs();
  const device = useDeviceVoices();

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Tốc độ đọc</p>
        <div className="flex flex-wrap gap-2">
          {SPEEDS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip"
              data-active={prefs.speed === s.id}
              onClick={() => {
                setSpeed(s.id);
                const l = langs[0];
                if (l) speak(VOICE_SAMPLE[l], LANGS[l].speech);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {langs.map((l) => {
        const selected = voiceFor(l, prefs);
        const fallback = server ? null : pickDeviceVoice(selected, device);
        return (
          <div key={l}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{LANGS[l].name}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {VOICES[l].map((v) => {
                const active = v.id === selected.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => {
                      setVoice(l, v.id);
                      speak(VOICE_SAMPLE[l], v.locale, v);
                    }}
                    aria-pressed={active}
                    className={`flex min-w-0 items-start gap-2.5 rounded-2xl border-[1.5px] p-3 text-left transition ${
                      active ? "border-accent bg-accent-soft shadow-[0_3px_0_var(--accent-deep)]" : "border-line hover:border-accent/60"
                    }`}
                  >
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full ${
                        active ? "bg-accent text-accent-ink" : "bg-surface-2 text-muted"
                      }`}
                    >
                      {active ? <Check size={16} strokeWidth={2.6} /> : v.gender === "female" ? <Venus size={16} /> : <Mars size={16} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{v.name}</span>
                      <span className="block text-xs text-muted">{v.style}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {!server && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                <Volume2 size={13} className="shrink-0" />
                {device.length === 0
                  ? "Đang tải giọng của thiết bị…"
                  : fallback
                    ? `Thiết bị này đọc bằng: ${fallback.name}`
                    : `Thiết bị này chưa cài giọng ${LANGS[l].name}. Hãy cài thêm giọng đọc trong cài đặt hệ thống.`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
