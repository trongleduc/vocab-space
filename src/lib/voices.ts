import type { Lang } from "./kinds";

/**
 * Voice catalogue shared by the client (picker, playback) and the /api/tts route.
 *
 * `id` is an Azure neural voice name. With AZURE_SPEECH_KEY set, audio comes from Azure and every
 * voice sounds the same on every device. Without it the browser's own speech engine is used:
 * Edge exposes these same neural voices ("Microsoft Xiaoxiao Online (Natural)"), other browsers
 * fall back to the best local voice of the same gender (see `pickDeviceVoice` in components/speak).
 */
export type VoiceGender = "female" | "male";

export type VoiceOption = {
  id: string;
  /** BCP-47 locale the voice speaks. English mixes US and UK voices. */
  locale: string;
  name: string;
  gender: VoiceGender;
  /** Short description shown under the name. */
  style: string;
};

export const VOICES: Record<Lang, VoiceOption[]> = {
  zh: [
    { id: "zh-CN-XiaoxiaoNeural", locale: "zh-CN", name: "Hiểu Hiểu", gender: "female", style: "Nữ · ấm, rõ ràng" },
    { id: "zh-CN-XiaoyiNeural", locale: "zh-CN", name: "Hiểu Y", gender: "female", style: "Nữ · trẻ, tươi sáng" },
    { id: "zh-CN-YunxiNeural", locale: "zh-CN", name: "Vân Hy", gender: "male", style: "Nam · trẻ, tự nhiên" },
    { id: "zh-CN-YunyangNeural", locale: "zh-CN", name: "Vân Dương", gender: "male", style: "Nam · phát thanh viên" },
  ],
  en: [
    { id: "en-US-JennyNeural", locale: "en-US", name: "Jenny", gender: "female", style: "Nữ · giọng Mỹ" },
    { id: "en-US-GuyNeural", locale: "en-US", name: "Guy", gender: "male", style: "Nam · giọng Mỹ" },
    { id: "en-GB-SoniaNeural", locale: "en-GB", name: "Sonia", gender: "female", style: "Nữ · giọng Anh" },
    { id: "en-GB-RyanNeural", locale: "en-GB", name: "Ryan", gender: "male", style: "Nam · giọng Anh" },
  ],
  ko: [
    { id: "ko-KR-SunHiNeural", locale: "ko-KR", name: "Sun-hi", gender: "female", style: "Nữ · Seoul chuẩn" },
    { id: "ko-KR-JiMinNeural", locale: "ko-KR", name: "Ji-min", gender: "female", style: "Nữ · trẻ, nhẹ nhàng" },
    { id: "ko-KR-InJoonNeural", locale: "ko-KR", name: "In-joon", gender: "male", style: "Nam · trầm, rõ ràng" },
    { id: "ko-KR-HyunsuNeural", locale: "ko-KR", name: "Hyun-su", gender: "male", style: "Nam · trẻ, tự nhiên" },
  ],
  ja: [
    { id: "ja-JP-NanamiNeural", locale: "ja-JP", name: "Nanami", gender: "female", style: "Nữ · Tokyo chuẩn" },
    { id: "ja-JP-AoiNeural", locale: "ja-JP", name: "Aoi", gender: "female", style: "Nữ · trẻ, tươi sáng" },
    { id: "ja-JP-KeitaNeural", locale: "ja-JP", name: "Keita", gender: "male", style: "Nam · trẻ, tự nhiên" },
    { id: "ja-JP-DaichiNeural", locale: "ja-JP", name: "Daichi", gender: "male", style: "Nam · trầm, rõ ràng" },
  ],
};

export const VOICE_SAMPLE: Record<Lang, string> = {
  zh: "你好，很高兴认识你。我们一起学习中文吧！",
  en: "Hello, nice to meet you. Let's learn English together!",
  ko: "안녕하세요, 만나서 반갑습니다. 같이 한국어를 공부해요!",
  ja: "こんにちは、はじめまして。一緒に日本語を勉強しましょう！",
};

/** Playback speeds. Learners hear words slightly slower than conversational speed by default. */
export const SPEEDS = [
  { id: "slow", label: "Chậm", rate: 0.7 },
  { id: "normal", label: "Vừa", rate: 0.88 },
  { id: "native", label: "Tự nhiên", rate: 1 },
] as const;
export type SpeedId = (typeof SPEEDS)[number]["id"];

export const MAX_TTS_CHARS = 400;

export function findVoice(id: string | null | undefined) {
  if (!id) return null;
  for (const list of Object.values(VOICES)) {
    const v = list.find((x) => x.id === id);
    if (v) return v;
  }
  return null;
}

export function rateOf(speed: string | null | undefined) {
  return SPEEDS.find((s) => s.id === speed)?.rate ?? SPEEDS[1].rate;
}

const KANA = /[぀-ヿ]/;
const KANJI = /[㐀-鿿]/;

/**
 * Text to send to the speech engine for a word. Japanese words written with kanji are spoken from
 * their kana reading ("今日" alone is often read こんにち instead of きょう); everything else as written.
 */
export function spokenForm(term: string, reading: string | null | undefined, lang: string) {
  if (!lang.startsWith("ja") || !reading || !KANJI.test(term)) return term;
  const kana = reading.split("·")[0].trim();
  return KANA.test(kana) && !/[a-z]/i.test(kana) ? kana : term;
}
