export const ITEM_KINDS = ["zh_word", "zh_phrase", "en_word", "en_idiom"] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];
