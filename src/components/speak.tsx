"use client";

import { Volume2 } from "lucide-react";
import { useSyncExternalStore } from "react";
import type { Lang } from "@/lib/kinds";
import { stripBrackets } from "@/lib/text";
import { findVoice, MAX_TTS_CHARS, rateOf, VOICES, type SpeedId, type VoiceOption } from "@/lib/voices";

/* ---------- Preferences (per device, localStorage) ---------- */

export type VoicePrefs = { voices: Partial<Record<Lang, string>>; speed: SpeedId };

const PREFS_KEY = "vs-voice";
const DEFAULT_PREFS: VoicePrefs = { voices: {}, speed: "normal" };
let prefs: VoicePrefs | null = null;
const prefListeners = new Set<() => void>();

function readPrefs(): VoicePrefs {
  if (prefs) return prefs;
  prefs = DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<VoicePrefs>;
      prefs = { voices: typeof p.voices === "object" && p.voices ? p.voices : {}, speed: p.speed ?? "normal" };
    }
  } catch {}
  return prefs;
}

function writePrefs(next: VoicePrefs) {
  prefs = next;
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {}
  prefListeners.forEach((l) => l());
}

export function setVoice(lang: Lang, id: string) {
  writePrefs({ ...readPrefs(), voices: { ...readPrefs().voices, [lang]: id } });
}

export function setSpeed(speed: SpeedId) {
  writePrefs({ ...readPrefs(), speed });
}

export function useVoicePrefs() {
  return useSyncExternalStore(
    (l) => {
      prefListeners.add(l);
      return () => prefListeners.delete(l);
    },
    readPrefs,
    () => DEFAULT_PREFS,
  );
}

export function voiceFor(lang: Lang, p: VoicePrefs = readPrefs()): VoiceOption {
  const chosen = findVoice(p.voices[lang]);
  return chosen && VOICES[lang].includes(chosen) ? chosen : VOICES[lang][0];
}

/* ---------- Server (Azure) availability, set by the app shell ---------- */

let serverTts = false;
let serverFailures = 0;

export function setServerTts(enabled: boolean) {
  serverTts = enabled;
  serverFailures = 0;
}

/* ---------- Device voices ---------- */

const NOVELTY =
  /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|superstar|trinoids|whisper|wobble|zarvox|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;
const FEMALE =
  /\b(female|xiaoxiao|xiaoyi|xiaochen|xiaohan|xiaomo|xiaorui|xiaoxuan|huihui|yaoyao|ting-?ting|mei-?jia|sinji|yu-?shu|lili|jenny|aria|ana|michelle|sonia|libby|mia|zira|hazel|susan|samantha|karen|moira|tessa|fiona|victoria|allison|ava|serena|kate|nicky|zoe|sunhi|jimin|seohyeon|yujin|heami|yuna|sora|nanami|aoi|mayu|shiori|haruka|ayumi|sayaka|kyoko|o-ren)\b|女|여/i;
const MALE =
  /\b(male|yunxi|yunyang|yunjian|yunze|yunfeng|kangkang|li-?mu|guy|christopher|eric|roger|steffan|andrew|brian|davis|tony|ryan|thomas|alfie|elliot|david|mark|george|james|alex|daniel|fred|tom|aaron|arthur|gordon|oliver|evan|nathan|rishi|injoon|hyunsu|bongjin|gookmin|minsu|keita|daichi|naoki|ichiro|otoya|hattori)\b|男|남/i;

const normLang = (l: string) => l.replace("_", "-");

function genderOf(v: SpeechSynthesisVoice): VoiceOption["gender"] | null {
  if (MALE.test(v.name)) return "male";
  if (FEMALE.test(v.name)) return "female";
  // Chrome's "Google 普通话", "Google 日本語"… are female.
  if (/^google/i.test(v.name)) return "female";
  return null;
}

function quality(v: SpeechSynthesisVoice) {
  if (NOVELTY.test(v.name)) return -10;
  if (/natural|neural/i.test(v.name)) return 6;
  if (/premium|enhanced|online/i.test(v.name)) return 4;
  if (/^google/i.test(v.name)) return 3;
  return v.localService ? 0 : 1;
}

/** Best voice installed on this device for a catalogue voice: same voice in Edge, else same gender and accent. */
export function pickDeviceVoice(option: VoiceOption, voices: SpeechSynthesisVoice[]) {
  const lang = option.locale.slice(0, 2);
  const same = voices.filter((v) => normLang(v.lang).toLowerCase().startsWith(lang));
  if (same.length === 0) return null;
  const short = option.id.split("-")[2].replace("Neural", "").toLowerCase();
  const exact = same.find((v) => v.name.toLowerCase().includes(short));
  if (exact) return exact;
  const score = (v: SpeechSynthesisVoice) => {
    const g = genderOf(v);
    return (
      (normLang(v.lang).toLowerCase() === option.locale.toLowerCase() ? 4 : 0) +
      (g === option.gender ? 6 : g === null ? 1 : 0) +
      quality(v)
    );
  };
  return same.reduce((best, v) => (score(v) > score(best) ? v : best));
}

const NO_VOICES: SpeechSynthesisVoice[] = [];
let deviceVoices: SpeechSynthesisVoice[] = NO_VOICES;

function subscribeVoices(l: () => void) {
  if (!("speechSynthesis" in window)) return () => {};
  const update = () => {
    deviceVoices = window.speechSynthesis.getVoices();
    l();
  };
  window.speechSynthesis.addEventListener("voiceschanged", update);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", update);
}

function getVoicesSnapshot() {
  if (deviceVoices === NO_VOICES && "speechSynthesis" in window) {
    const now = window.speechSynthesis.getVoices();
    if (now.length) deviceVoices = now;
  }
  return deviceVoices;
}

/** Voices installed on this device (empty until the browser has loaded them). */
export function useDeviceVoices() {
  return useSyncExternalStore(subscribeVoices, getVoicesSnapshot, () => NO_VOICES);
}

/* ---------- Playback ---------- */

let playing: string | null = null;
const playListeners = new Set<() => void>();
const setPlaying = (key: string | null) => {
  playing = key;
  playListeners.forEach((l) => l());
};

/** Text currently being read aloud, so its button can show that it is playing. */
function usePlaying() {
  return useSyncExternalStore(
    (l) => {
      playListeners.add(l);
      return () => playListeners.delete(l);
    },
    () => playing,
    () => null,
  );
}

let audio: HTMLAudioElement | null = null;
let seq = 0;

export function stopSpeaking() {
  seq++;
  audio?.pause();
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  setPlaying(null);
}

function speakOnDevice(text: string, option: VoiceOption, rate: number, key: string, id: number) {
  if (!("speechSynthesis" in window)) return setPlaying(null);
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const v = pickDeviceVoice(option, synth.getVoices());
  u.lang = v ? v.lang : option.locale;
  if (v) u.voice = v;
  u.rate = rate;
  u.onstart = () => id === seq && setPlaying(key);
  u.onend = u.onerror = () => id === seq && setPlaying(null);
  synth.speak(u);
}

/**
 * Read `text` aloud in the user's chosen voice for the language of `locale` ("zh-CN", "en-US"…).
 * Brackets around the target word are dropped. Uses Azure neural audio when the server has it,
 * the browser's speech engine otherwise (or when the request fails).
 */
export function speak(text: string, locale: string, option?: VoiceOption) {
  if (typeof window === "undefined") return;
  const lang = locale.slice(0, 2) as Lang;
  if (!(lang in VOICES)) return;
  const p = readPrefs();
  const voice = option ?? voiceFor(lang, p);
  const rate = rateOf(p.speed);
  const clean = stripBrackets(text).trim();
  if (!clean) return;

  stopSpeaking();
  const id = seq;
  const key = `${voice.id}|${clean}`;
  setPlaying(key);

  if (serverTts && serverFailures < 3 && clean.length <= MAX_TTS_CHARS) {
    audio ??= new Audio();
    const a = audio;
    let fellBack = false;
    const fallback = () => {
      if (id !== seq || fellBack) return;
      fellBack = true;
      serverFailures++;
      speakOnDevice(clean, voice, rate, key, id);
    };
    a.onended = () => id === seq && setPlaying(null);
    a.onerror = fallback;
    a.src = `/api/tts?v=${encodeURIComponent(voice.id)}&r=${rate}&t=${encodeURIComponent(clean)}`;
    a.play().then(
      () => {
        if (id === seq) serverFailures = 0;
      },
      (e: unknown) => {
        // AbortError means another word started; anything else (network, 503) falls back.
        if (!(e instanceof DOMException && e.name === "AbortError")) fallback();
      },
    );
    return;
  }
  speakOnDevice(clean, voice, rate, key, id);
}

export function SpeakButton({
  text,
  lang,
  size = "sm",
  label = "Nghe phát âm",
  ghost = false,
}: {
  text: string;
  lang: string;
  size?: "xs" | "sm" | "md";
  label?: string;
  /** Borderless variant for inline use (example sentences). */
  ghost?: boolean;
}) {
  const current = usePlaying();
  const p = useVoicePrefs();
  const l = lang.slice(0, 2) as Lang;
  const active = l in VOICES && current === `${voiceFor(l, p).id}|${stripBrackets(text).trim()}`;
  const icon = size === "md" ? 18 : size === "sm" ? 15 : 14;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (active) stopSpeaking();
        else speak(text, lang);
      }}
      data-playing={active}
      className={`btn btn-icon speak-btn ${size === "md" ? "" : "btn-sm"} ${size === "xs" ? "speak-xs" : ""} ${ghost ? "btn-ghost" : ""}`}
      aria-label={label}
      title={label}
    >
      <Volume2 size={icon} />
    </button>
  );
}
