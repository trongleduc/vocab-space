import { isLang, LANG_CODES, type ItemKind, type Lang } from "./kinds";

export { isLang, LANG_CODES, type Lang };

export type LangConfig = {
  code: Lang;
  name: string;
  /** Glyph used in badges and nav icons. */
  short: string;
  /** Short label for the mobile bottom nav. */
  navLabel: string;
  wordKind: ItemKind;
  extraKind: ItemKind;
  extraLabel: string;
  extraHint: string;
  extraTitle: string;
  extraDescription: (quota: number) => string;
  levels: string[];
  standard: string;
  /** One-line scope shown on the dashboard card. */
  levelSummary: string;
  speech: string;
  /** CSS class with the right font stack for the script ("" for Latin). */
  font: "" | "han" | "ja" | "ko";
  readingLabel: string;
  searchPlaceholder: string;
  browseDescription: string;
  exerciseDescription: string;
  /** Admin form placeholder for one example line: sentence | reading | translation. */
  examplePlaceholder: string;
};

export const LANGS: Record<Lang, LangConfig> = {
  zh: {
    code: "zh",
    name: "Tiếng Trung",
    short: "中",
    navLabel: "Trung",
    wordKind: "zh_word",
    extraKind: "zh_phrase",
    extraLabel: "Câu thông dụng",
    extraHint: "Những câu nói dùng hằng ngày",
    extraTitle: "Câu thông dụng hằng ngày",
    extraDescription: (n) => `Mỗi ngày ${n} câu nói hay dùng trong đời sống, kèm pinyin và tình huống sử dụng.`,
    levels: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7-9"],
    standard: "HSK 3.0",
    levelSummary: "HSK 3.0",
    speech: "zh-CN",
    font: "han",
    readingLabel: "Pinyin",
    searchPlaceholder: "Tìm chữ Hán, pinyin hoặc nghĩa",
    browseDescription: "Toàn bộ từ vựng theo cấp độ HSK 3.0, theo chủ đề hoặc theo chữ cái pinyin.",
    exerciseDescription: "Chọn chữ Hán đúng cho câu ví dụ để quen mặt chữ. Câu sai được đưa vào danh sách ôn tập.",
    examplePlaceholder: "我[喜欢]喝茶。 | Wǒ xǐhuan hē chá. | Tôi thích uống trà.",
  },
  en: {
    code: "en",
    name: "Tiếng Anh",
    short: "EN",
    navLabel: "Anh",
    wordKind: "en_word",
    extraKind: "en_idiom",
    extraLabel: "Idioms",
    extraHint: "Thành ngữ mỗi ngày",
    extraTitle: "Idioms mỗi ngày",
    extraDescription: (n) => `Mỗi ngày ${n} thành ngữ tiếng Anh, kèm nghĩa và ví dụ.`,
    levels: ["B1", "B2", "C1", "C2"],
    standard: "CEFR",
    levelSummary: "B1 trở lên",
    speech: "en-US",
    font: "",
    readingLabel: "Phiên âm IPA",
    searchPlaceholder: "Tìm từ hoặc nghĩa",
    browseDescription: "Từ vựng B1 trở lên theo cấp độ CEFR, theo chủ đề hoặc theo chữ cái.",
    exerciseDescription: "Chọn từ đúng cho câu ví dụ. Câu sai được đưa vào danh sách ôn tập.",
    examplePlaceholder: "She [depends on] her parents. | | Cô ấy phụ thuộc vào bố mẹ.",
  },
  ko: {
    code: "ko",
    name: "Tiếng Hàn",
    short: "한",
    navLabel: "Hàn",
    wordKind: "ko_word",
    extraKind: "ko_phrase",
    extraLabel: "Câu thông dụng",
    extraHint: "Những câu người Hàn nói hằng ngày",
    extraTitle: "Câu thông dụng hằng ngày",
    extraDescription: (n) => `Mỗi ngày ${n} câu nói hay dùng của người Hàn, kèm phiên âm và tình huống sử dụng.`,
    levels: ["TOPIK1", "TOPIK2", "TOPIK3", "TOPIK4", "TOPIK5", "TOPIK6"],
    standard: "TOPIK",
    levelSummary: "TOPIK 1 đến 6",
    speech: "ko-KR",
    font: "ko",
    readingLabel: "Phiên âm Latin",
    searchPlaceholder: "Tìm chữ Hangul, phiên âm hoặc nghĩa",
    browseDescription: "Từ vựng theo cấp TOPIK 1–6, theo chủ đề hoặc theo phụ âm đầu (ㄱ ㄴ ㄷ…).",
    exerciseDescription: "Chọn từ đúng cho câu ví dụ. Đáp án ở dạng nguyên thể, trong câu từ đã được chia đuôi. Câu sai được đưa vào danh sách ôn tập.",
    examplePlaceholder: "저는 커피를 [좋아해요]. | Jeoneun keopireul joahaeyo. | Tôi thích cà phê.",
  },
  ja: {
    code: "ja",
    name: "Tiếng Nhật",
    short: "日",
    navLabel: "Nhật",
    wordKind: "ja_word",
    extraKind: "ja_phrase",
    extraLabel: "Câu thông dụng",
    extraHint: "Những câu người Nhật nói hằng ngày",
    extraTitle: "Câu thông dụng hằng ngày",
    extraDescription: (n) => `Mỗi ngày ${n} câu nói hay dùng của người Nhật, kèm cách đọc và tình huống sử dụng.`,
    levels: ["N5", "N4", "N3", "N2", "N1"],
    standard: "JLPT",
    levelSummary: "JLPT N5 đến N1",
    speech: "ja-JP",
    font: "ja",
    readingLabel: "Cách đọc (kana · romaji)",
    searchPlaceholder: "Tìm kanji, kana, romaji hoặc nghĩa",
    browseDescription: "Từ vựng theo cấp JLPT N5–N1, theo chủ đề hoặc theo hàng kana (あ か さ…).",
    exerciseDescription: "Chọn từ đúng cho câu ví dụ để quen mặt chữ kanji. Đáp án ở dạng từ điển. Câu sai được đưa vào danh sách ôn tập.",
    examplePlaceholder: "毎朝パンを[食べます]。 | Maiasa pan o tabemasu. | Sáng nào tôi cũng ăn bánh mì.",
  },
};

export function langOfKind(kind: ItemKind): Lang {
  return kind.slice(0, kind.indexOf("_")) as Lang;
}

/** Font class for an item's script ("" for English). */
export function fontOfKind(kind: ItemKind) {
  return LANGS[langOfKind(kind)].font;
}

/** Speech-synthesis locale for an item. */
export function speechOfKind(kind: ItemKind) {
  return LANGS[langOfKind(kind)].speech;
}

/** Position of a level in its language's easy → hard list (unknown levels sort last). Mirrors LEVEL_ORDER in SQL. */
export function levelRank(kind: ItemKind, level: string | null) {
  const i = level ? LANGS[langOfKind(kind)].levels.indexOf(level) : -1;
  return i === -1 ? 99 : i;
}

export function isExtraKind(kind: ItemKind) {
  return LANGS[langOfKind(kind)].extraKind === kind;
}

/** Both item kinds that belong to the given languages. */
export function kindsOf(langs: readonly Lang[]): ItemKind[] {
  return langs.flatMap((l) => [LANGS[l].wordKind, LANGS[l].extraKind]);
}

export const KIND_LABEL: Record<ItemKind, string> = {
  zh_word: "Từ tiếng Trung",
  zh_phrase: "Câu tiếng Trung",
  en_word: "Từ tiếng Anh",
  en_idiom: "Idiom",
  ko_word: "Từ tiếng Hàn",
  ko_phrase: "Câu tiếng Hàn",
  ja_word: "Từ tiếng Nhật",
  ja_phrase: "Câu tiếng Nhật",
};
