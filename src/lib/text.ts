/** Shared helpers usable on both server and client. */

/** Split an example sentence into plain/target parts. Target is the [bracketed] segment. */
export function splitTarget(text: string): { before: string; target: string | null; after: string } {
  const m = text.match(/^([\s\S]*?)\[([\s\S]+?)\]([\s\S]*)$/);
  if (!m) return { before: text, target: null, after: "" };
  return { before: m[1], target: m[2], after: m[3] };
}

export function stripBrackets(text: string) {
  return text.replace(/\[([\s\S]+?)\]/g, "$1");
}

/** Locate the target word in a sentence: bracketed segment first, then a literal match of the term. */
export function findTarget(text: string, term: string) {
  const parts = splitTarget(text);
  if (parts.target) {
    return { before: stripBrackets(parts.before), target: parts.target, after: stripBrackets(parts.after) };
  }
  const plain = stripBrackets(text);
  const idx = plain.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return null;
  return {
    before: plain.slice(0, idx),
    target: plain.slice(idx, idx + term.length),
    after: plain.slice(idx + term.length),
  };
}

const HANGUL_INITIALS = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
/** Tense consonants are grouped with their plain form so the browse bar stays short. */
const HANGUL_PLAIN: Record<string, string> = { ㄲ: "ㄱ", ㄸ: "ㄷ", ㅃ: "ㅂ", ㅆ: "ㅅ", ㅉ: "ㅈ" };

const KANA_ROWS: [string, string][] = [
  ["あ", "あいうえおぁぃぅぇぉゔ"],
  ["か", "かきくけこがぎぐげごゕゖ"],
  ["さ", "さしすせそざじずぜぞ"],
  ["た", "たちつてとだぢづでどっ"],
  ["な", "なにぬねの"],
  ["は", "はひふへほばびぶべぼぱぴぷぺぽ"],
  ["ま", "まみむめも"],
  ["や", "やゆよゃゅょ"],
  ["ら", "らりるれろ"],
  ["わ", "わをんゎゐゑ"],
];

/** Katakana → hiragana, so both scripts map to the same row. */
const toHiragana = (ch: string) => {
  const c = ch.charCodeAt(0);
  return c >= 0x30a1 && c <= 0x30f6 ? String.fromCharCode(c - 0x60) : ch;
};

function kanaRow(text: string) {
  const ch = toHiragana(text.trim().charAt(0));
  return KANA_ROWS.find(([, members]) => members.includes(ch))?.[0] ?? null;
}

/** Gojūon row from the first syllable of Hepburn romaji (for Japanese phrases whose reading has no kana). */
function romajiRow(text: string) {
  const s = text.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
  const c = s.charAt(0);
  if ("aiueo".includes(c)) return "あ";
  const rows: [string, string][] = [
    ["kg", "か"],
    ["szj", "さ"],
    ["tdc", "た"],
    ["n", "な"],
    ["hbpf", "は"],
    ["m", "ま"],
    ["y", "や"],
    ["rl", "ら"],
    ["w", "わ"],
  ];
  return c ? (rows.find(([cs]) => cs.includes(c))?.[1] ?? null) : null;
}

const KANA = /[぀-ヿ]/;
const HANGUL = /[가-힣]/;

/**
 * Browse letter for an item:
 * Korean → initial consonant of the first syllable; Japanese → gojūon row of the first kana
 * (of the term, or of the reading when the term starts with kanji); everything else → A–Z
 * (Chinese uses the pinyin reading without tones).
 */
export function letterOf(term: string, reading?: string | null, lang?: string) {
  const first = term.trim().charAt(0);
  if (HANGUL.test(first)) {
    const initial = HANGUL_INITIALS[Math.floor((first.charCodeAt(0) - 0xac00) / 588)];
    return HANGUL_PLAIN[initial] ?? initial;
  }
  if (KANA.test(first)) return kanaRow(term) ?? "#";
  if (/[㐀-鿿]/.test(first) && reading && KANA.test(reading.trim().charAt(0))) return kanaRow(reading) ?? "#";
  if (lang === "ja") return romajiRow(reading ?? "") ?? "#";
  const source = /[㐀-鿿]/.test(term) ? (reading ?? "") : term;
  const ch = source
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .charAt(0)
    .toUpperCase();
  return /[A-Z]/.test(ch) ? ch : "#";
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
