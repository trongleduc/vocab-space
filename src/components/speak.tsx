"use client";

import { Volume2 } from "lucide-react";
import { stripBrackets } from "@/lib/text";

export function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(stripBrackets(text));
  u.lang = lang;
  u.rate = lang.startsWith("zh") ? 0.8 : lang.startsWith("ja") || lang.startsWith("ko") ? 0.85 : 0.95;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.replace("_", "-").startsWith(lang));
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

export function SpeakButton({ text, lang, size = "sm" }: { text: string; lang: string; size?: "sm" | "md" }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speak(text, lang);
      }}
      className={`btn btn-icon ${size === "sm" ? "btn-sm" : ""}`}
      aria-label="Nghe phát âm"
      title="Nghe phát âm"
    >
      <Volume2 size={size === "sm" ? 15 : 18} />
    </button>
  );
}
