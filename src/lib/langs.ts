import type { ItemKind } from "@/db/schema";

export type Lang = "zh" | "en";

export type LangConfig = {
  code: Lang;
  name: string;
  short: string;
  wordKind: ItemKind;
  extraKind: ItemKind;
  extraLabel: string;
  extraHint: string;
  levels: string[];
  standard: string;
  speech: string;
};

export const LANGS: Record<Lang, LangConfig> = {
  zh: {
    code: "zh",
    name: "Tiếng Trung",
    short: "中文",
    wordKind: "zh_word",
    extraKind: "zh_phrase",
    extraLabel: "Câu thông dụng",
    extraHint: "Những câu nói dùng hằng ngày",
    levels: ["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6", "HSK7-9"],
    standard: "HSK 3.0",
    speech: "zh-CN",
  },
  en: {
    code: "en",
    name: "Tiếng Anh",
    short: "EN",
    wordKind: "en_word",
    extraKind: "en_idiom",
    extraLabel: "Idioms",
    extraHint: "Thành ngữ mỗi ngày",
    levels: ["B1", "B2", "C1", "C2"],
    standard: "CEFR",
    speech: "en-US",
  },
};

export function isLang(v: string): v is Lang {
  return v === "zh" || v === "en";
}

export function langOfKind(kind: ItemKind): Lang {
  return kind.startsWith("zh") ? "zh" : "en";
}

export const KIND_LABEL: Record<ItemKind, string> = {
  zh_word: "Từ tiếng Trung",
  zh_phrase: "Câu tiếng Trung",
  en_word: "Từ tiếng Anh",
  en_idiom: "Idiom",
};
