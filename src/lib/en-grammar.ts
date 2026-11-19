/**
 * Small English grammar toolkit for the fill-in-the-blank exercise: inflection (verb forms,
 * plurals), word-family guesses and a context heuristic that reads the words before the blank.
 * It is rule based and only has to be good enough to build distractors that are clearly
 * ungrammatical in the given sentence. Pure functions, safe on server and client.
 */

export type Pos = "verb" | "noun" | "adjective" | "adverb";
export type VerbForm = "base" | "s" | "past" | "pp" | "ing";
export type VerbForms = Record<VerbForm, string>;

/* ---------- Irregular forms ---------- */

const IRREGULAR_VERBS = Object.fromEntries(
  `arise arose arisen|awake awoke awoken|be was been|bear bore born|beat beat beaten|become became become|
begin began begun|bend bent bent|bet bet bet|bind bound bound|bite bit bitten|bleed bled bled|blow blew blown|
break broke broken|breed bred bred|bring brought brought|broadcast broadcast broadcast|build built built|
burn burnt burnt|burst burst burst|buy bought bought|cast cast cast|catch caught caught|choose chose chosen|
cling clung clung|come came come|cost cost cost|creep crept crept|cut cut cut|deal dealt dealt|dig dug dug|
do did done|draw drew drawn|dream dreamt dreamt|drink drank drunk|drive drove driven|eat ate eaten|
fall fell fallen|feed fed fed|feel felt felt|fight fought fought|find found found|flee fled fled|fling flung flung|
fly flew flown|forbid forbade forbidden|forecast forecast forecast|forget forgot forgotten|forgive forgave forgiven|
freeze froze frozen|get got got|give gave given|go went gone|grind ground ground|grow grew grown|hang hung hung|
have had had|hear heard heard|hide hid hidden|hit hit hit|hold held held|hurt hurt hurt|keep kept kept|
kneel knelt knelt|know knew known|lay laid laid|lead led led|lean leant leant|leap leapt leapt|learn learnt learnt|
leave left left|lend lent lent|let let let|lie lay lain|light lit lit|lose lost lost|make made made|mean meant meant|
meet met met|mislead misled misled|mistake mistook mistaken|misunderstand misunderstood misunderstood|
overcome overcame overcome|overtake overtook overtaken|pay paid paid|prove proved proven|put put put|quit quit quit|
read read read|rid rid rid|ride rode ridden|ring rang rung|rise rose risen|run ran run|say said said|see saw seen|
seek sought sought|sell sold sold|send sent sent|set set set|sew sewed sewn|shake shook shaken|shed shed shed|
shine shone shone|shoot shot shot|show showed shown|shrink shrank shrunk|shut shut shut|sing sang sung|
sink sank sunk|sit sat sat|sleep slept slept|slide slid slid|sling slung slung|smell smelt smelt|speak spoke spoken|
speed sped sped|spell spelt spelt|spend spent spent|spill spilt spilt|spin spun spun|spit spat spat|split split split|
spoil spoilt spoilt|spread spread spread|spring sprang sprung|stand stood stood|steal stole stolen|stick stuck stuck|
sting stung stung|stink stank stunk|strike struck struck|string strung strung|strive strove striven|swear swore sworn|
sweep swept swept|swell swelled swollen|swim swam swum|swing swung swung|take took taken|teach taught taught|
tear tore torn|tell told told|think thought thought|throw threw thrown|thrust thrust thrust|tread trod trodden|
undergo underwent undergone|understand understood understood|undertake undertook undertaken|upset upset upset|
wake woke woken|wear wore worn|weave wove woven|weep wept wept|win won won|wind wound wound|withdraw withdrew withdrawn|
withstand withstood withstood|wring wrung wrung|write wrote written|outgrow outgrew outgrown|rebuild rebuilt rebuilt|
redo redid redone|rewrite rewrote rewritten|sell-out sold-out sold-out`
    .split("|")
    .map((row) => row.trim().split(/\s+/))
    .map(([base, past, pp]) => [base, { past, pp }]),
) as Record<string, { past: string; pp: string }>;

const IRREGULAR_PLURALS: Record<string, string> = {
  man: "men", woman: "women", child: "children", person: "people", tooth: "teeth", foot: "feet",
  mouse: "mice", goose: "geese", ox: "oxen", life: "lives", knife: "knives", wife: "wives", leaf: "leaves",
  half: "halves", wolf: "wolves", shelf: "shelves", thief: "thieves", loaf: "loaves", calf: "calves",
  self: "selves", sheep: "sheep", fish: "fish", deer: "deer", series: "series", species: "species",
  crisis: "crises", analysis: "analyses", thesis: "theses", hypothesis: "hypotheses", phenomenon: "phenomena",
  criterion: "criteria", potato: "potatoes", tomato: "tomatoes", hero: "heroes", echo: "echoes", veto: "vetoes",
};

const IRREGULAR_ADJ: Record<string, [string, string]> = {
  good: ["better", "best"], bad: ["worse", "worst"], far: ["further", "furthest"], ill: ["worse", "worst"],
};

/* ---------- Spelling helpers ---------- */

const VOWELS = "aeiou";
const isVowel = (c: string | undefined) => !!c && VOWELS.includes(c);
const IPA_VOWEL = /[aeiouæɑɒɔəɛɜɪʊʌ]+/g;

/** Last syllable stressed? Uses the IPA reading when present: one vowel nucleus after the last ˈ. */
function finalStress(word: string, ipa?: string | null) {
  const groups = word.match(/[aeiouy]+/g)?.length ?? 0;
  if (groups <= 1) return true;
  if (!ipa || !ipa.includes("ˈ")) return false;
  const tail = ipa.slice(ipa.lastIndexOf("ˈ") + 1).replace(/\(.*?\)/g, "");
  return (tail.match(IPA_VOWEL)?.length ?? 0) === 1;
}

/** stop → stopp-, prefer → preferr-, travel → travell- (British, as in the example sentences). */
function doubles(word: string, ipa?: string | null) {
  const [a, b, c] = word.slice(-3);
  if (!c || isVowel(c) || "wxy".includes(c) || !isVowel(b) || isVowel(a)) return false;
  if (c === "l") return true;
  return finalStress(word, ipa);
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Apply a transform to the last word only (phrasal terms like "give up" keep their particle). */
function onHead(term: string, fn: (w: string) => string) {
  const parts = term.split(" ");
  parts[0] = fn(parts[0]);
  return parts.join(" ");
}

function addS(w: string) {
  if (/(s|x|z|ch|sh)$/.test(w)) return w + "es";
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "ies";
  if (/[^aeiou]o$/.test(w)) return w + "es";
  return w + "s";
}

function addEd(w: string, ipa?: string | null) {
  if (w.endsWith("e")) return w + "d";
  if (/[^aeiou]y$/.test(w)) return w.slice(0, -1) + "ied";
  if (w.endsWith("ic")) return w + "ked";
  if (doubles(w, ipa)) return w + w.slice(-1) + "ed";
  return w + "ed";
}

function addIng(w: string, ipa?: string | null) {
  if (w.endsWith("ie")) return w.slice(0, -2) + "ying";
  if (/[^aeioy]e$/.test(w) && w !== "be") return w.slice(0, -1) + "ing";
  if (w.endsWith("ic")) return w + "king";
  if (doubles(w, ipa)) return w + w.slice(-1) + "ing";
  return w + "ing";
}

/* ---------- Inflection ---------- */

export function verbForms(term: string, ipa?: string | null): VerbForms {
  const head = term.split(" ")[0].toLowerCase();
  if (head === "be") return { base: "be", s: "is", past: "was", pp: "been", ing: "being" };
  const irr = IRREGULAR_VERBS[head];
  const sForm = head === "have" ? "has" : head === "do" ? "does" : head === "go" ? "goes" : addS(head);
  return {
    base: term,
    s: onHead(term, () => sForm),
    past: onHead(term, (w) => irr?.past ?? addEd(w, ipa)),
    pp: onHead(term, (w) => irr?.pp ?? addEd(w, ipa)),
    ing: onHead(term, (w) => addIng(w, ipa)),
  };
}

export function plural(noun: string) {
  const parts = noun.split(" ");
  const last = parts[parts.length - 1];
  const lower = last.toLowerCase();
  parts[parts.length - 1] = IRREGULAR_PLURALS[lower] ?? (/[^aeiou]o$/.test(lower) ? lower + "s" : addS(lower));
  return parts.join(" ");
}

/** Comparative/superlative only for short adjectives (big, happy, nice). */
function comparatives(adj: string): [string, string] | null {
  if (IRREGULAR_ADJ[adj]) return IRREGULAR_ADJ[adj];
  if (adj.includes(" ")) return null;
  const groups = adj.match(/[aeiouy]+/g)?.length ?? 0;
  if (groups === 1) {
    if (adj.endsWith("e")) return [adj + "r", adj + "st"];
    const stem = doubles(adj) && !adj.endsWith("l") ? adj + adj.slice(-1) : adj;
    return [stem + "er", stem + "est"];
  }
  if (groups === 2 && /[^aeiou]y$/.test(adj)) return [adj.slice(0, -1) + "ier", adj.slice(0, -1) + "iest"];
  return null;
}

/** happy → happily, gentle → gently, basic → basically, full → fully, true → truly. */
export function adverbOf(adj: string) {
  if (adj.includes(" ") || /(ly|ed|ing)$/.test(adj)) return null;
  if (/[^aeiou]y$/.test(adj)) return adj.slice(0, -1) + "ily";
  if (/[^aeiou]le$/.test(adj)) return adj.slice(0, -1) + "y";
  if (adj.endsWith("ic")) return adj + "ally";
  if (adj.endsWith("ll")) return adj + "y";
  if (adj.endsWith("ue")) return adj.slice(0, -1) + "ly";
  return adj + "ly";
}

/** Parse a `pos` column such as "noun, verb" into the four classes the exercise knows. */
export function parsePos(pos: string | null | undefined): Pos[] {
  const out: Pos[] = [];
  for (const p of (pos ?? "").split(/[,/;]/).map((s) => s.trim().toLowerCase())) {
    if (p === "verb" || p === "modal verb") out.push("verb");
    else if (p === "noun") out.push("noun");
    else if (p === "adjective") out.push("adjective");
    else if (p === "adverb") out.push("adverb");
  }
  return [...new Set(out)];
}

export const POS_LABEL: Record<Pos, string> = {
  verb: "động từ",
  noun: "danh từ",
  adjective: "tính từ",
  adverb: "trạng từ",
};

/**
 * Prefix used to look up the word family in the word list: the term minus a derivational
 * suffix and a final e/y, at least 4 letters (arrive → arriv → arrival; compete → compet → competition).
 */
export function familyPrefix(term: string) {
  const w = term.toLowerCase();
  if (w.includes(" ")) return null;
  const stem = w
    .replace(/(ically|ation|ition|ment|ness|ity|ance|ence|ive|ful|less|ous|able|ible|ally|ly|al|ize|ise|ing|ed|er|or|ist|ism)$/, "")
    .replace(/[ey]$/, "");
  const prefix = stem.length >= 4 ? stem : w.slice(0, Math.max(4, Math.min(w.length, 5)));
  return prefix.length >= 4 ? prefix : null;
}

/* ---------- Context ---------- */

const MODALS = new Set([
  "can", "could", "will", "would", "shall", "should", "may", "might", "must", "to", "do", "does", "did",
  "let's", "please", "cannot",
]);
const BE = new Set(["am", "is", "are", "was", "were", "be", "been", "being", "isn't", "aren't", "wasn't", "weren't"]);
const HAVE = new Set(["have", "has", "had", "having", "hasn't", "haven't", "hadn't"]);
const SKIP = new Set([
  "not", "never", "always", "already", "just", "also", "still", "often", "really", "even", "ever", "soon",
  "only", "usually", "sometimes", "recently", "finally", "probably", "certainly", "rarely", "seldom", "once",
]);
const SING_DET = new Set(["a", "an", "one", "each", "every", "another", "this", "that"]);
const PLURAL_DET = new Set([
  "these", "those", "many", "several", "few", "both", "two", "three", "four", "five", "six", "seven",
  "eight", "nine", "ten", "various", "numerous", "dozens", "hundreds", "thousands",
]);
const NOUN_DET = new Set([
  ...SING_DET, ...PLURAL_DET, "the", "my", "your", "his", "her", "its", "our", "their", "some", "any", "no",
  "much", "more", "most", "less", "of", "in", "on", "at", "for", "with", "about", "from", "by",
]);
const SUBJECTS = new Set(["i", "you", "we", "they", "he", "she", "it", "who", "people"]);

export type Context =
  | { kind: "modal"; word: string }
  | { kind: "be"; word: string }
  | { kind: "have"; word: string }
  | { kind: "det"; word: string }
  | { kind: "subject"; word: string }
  | { kind: "other"; word: string | null };

/** Classify the word right before the blank, skipping adverbs such as "already" or "never". */
export function contextOf(before: string): Context {
  const tokens = before.toLowerCase().replace(/[’]/g, "'").match(/[a-z']+/g) ?? [];
  let i = tokens.length - 1;
  while (i >= 0 && (SKIP.has(tokens[i]) || (tokens[i].length > 5 && tokens[i].endsWith("ly")))) i--;
  let w = tokens[i];
  if (!w) return { kind: "other", word: null };
  // Questions put the auxiliary before the subject: "Can you ___", "Has she ___", "Is it ___".
  const aux = tokens[i - 1];
  if (SUBJECTS.has(w) && aux && aux !== "to" && aux !== "please") {
    if (MODALS.has(aux) || /^(don|doesn|didn|can|won|couldn|wouldn|shouldn)'t$/.test(aux) || BE.has(aux) || HAVE.has(aux)) {
      w = aux;
    }
  }
  if (MODALS.has(w) || /^(.+)'ll$/.test(w) || /^(don|doesn|didn|can|won|couldn|wouldn|shouldn|mustn)'t$/.test(w)) {
    return { kind: "modal", word: w };
  }
  if (BE.has(w) || /'(m|re)$/.test(w)) return { kind: "be", word: w };
  if (HAVE.has(w) || /'ve$/.test(w)) return { kind: "have", word: w };
  if (NOUN_DET.has(w)) return { kind: "det", word: w };
  if (SUBJECTS.has(w)) return { kind: "subject", word: w };
  return { kind: "other", word: w };
}

/* ---------- Matching the sentence form ---------- */

export type FormMatch =
  | { pos: "verb"; form: VerbForm; forms: VerbForms }
  | { pos: "noun"; number: "sing" | "plural"; singular: string; plural: string }
  | { pos: "adjective"; degree: "base" | "er" | "est"; base: string }
  | { pos: "adverb" };

/**
 * Work out which part of speech and form the sentence uses. `word` is the blank text,
 * `term` the dictionary form, `posList` the item's parts of speech.
 */
export function matchForm(word: string, term: string, posList: Pos[], ipa: string | null, ctx: Context): FormMatch | null {
  const w = word.toLowerCase();
  const t = term.toLowerCase();
  const candidates: FormMatch[] = [];
  if (posList.includes("verb")) {
    const forms = verbForms(t, ipa);
    // Prefer pp after have/be, past otherwise, when both spell the same.
    const order: VerbForm[] =
      ctx.kind === "have" || ctx.kind === "be" ? ["pp", "ing", "base", "s", "past"] : ["base", "s", "past", "ing", "pp"];
    const form = order.find((f) => forms[f].toLowerCase() === w);
    if (form) candidates.push({ pos: "verb", form, forms });
  }
  if (posList.includes("noun")) {
    const pl = plural(t);
    if (w === t) candidates.push({ pos: "noun", number: "sing", singular: t, plural: pl });
    else if (w === pl || w === t + "s" || w === t + "es") candidates.push({ pos: "noun", number: "plural", singular: t, plural: w });
  }
  if (posList.includes("adjective")) {
    const cmp = comparatives(t);
    if (w === t) candidates.push({ pos: "adjective", degree: "base", base: t });
    else if (cmp && w === cmp[0]) candidates.push({ pos: "adjective", degree: "er", base: t });
    else if (cmp && w === cmp[1]) candidates.push({ pos: "adjective", degree: "est", base: t });
  }
  if (posList.includes("adverb") && w === t) candidates.push({ pos: "adverb" });
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];
  // Ambiguous ("noun, verb" with the same spelling): let the previous word decide.
  const prefer: Pos[] =
    ctx.kind === "det"
      ? ["noun", "adjective", "verb", "adverb"]
      : ctx.kind === "modal" || ctx.kind === "have" || ctx.kind === "subject"
        ? ["verb", "adverb", "adjective", "noun"]
        : ctx.kind === "be"
          ? ["adjective", "verb", "noun", "adverb"]
          : posList;
  const byPos = (p: Pos) => candidates.find((c) => c.pos === p);
  // An -ing/-ed/-s spelling that differs from the term is a strong verb signal.
  const verb = byPos("verb");
  if (verb && verb.pos === "verb" && verb.form !== "base" && ctx.kind !== "det") return verb;
  // "Our team [beat] them": noun or verb cannot be told apart here, so set no grammar trap.
  if (verb && byPos("noun") && (ctx.kind === "other" || ctx.kind === "be")) return null;
  for (const p of prefer) {
    const c = byPos(p);
    if (c) return c;
  }
  return candidates[0];
}

/* ---------- Grammar distractors ---------- */

const FORM_LABEL: Record<VerbForm, string> = {
  base: "động từ nguyên mẫu",
  s: "động từ thêm -s/-es (ngôi thứ ba số ít, hiện tại)",
  past: "động từ quá khứ (V2)",
  pp: "quá khứ phân từ (V3)",
  ing: "V-ing",
};

const q = (w: string) => `“${w}”`;

/**
 * Wrong forms of the same word that do not fit the sentence, plus a one-line Vietnamese
 * explanation of the right form. Tense-only swaps (arrived ↔ arrive) are avoided unless the
 * previous word rules them out, because both can be grammatical.
 */
export function formDistractors(m: FormMatch, ctx: Context): { wrong: string[]; explain: string } {
  if (m.pos === "verb") {
    const { forms, form } = m;
    let wrong: VerbForm[] = [];
    let explain = `Chỗ trống cần ${FORM_LABEL[form]}.`;
    if (ctx.kind === "modal") {
      wrong = ["ing", "past", "s", "pp"];
      explain =
        ctx.word === "to"
          ? `Sau ${q("to")} dùng động từ nguyên mẫu (to + V).`
          : `Sau ${q(ctx.word)} dùng động từ nguyên mẫu.`;
    } else if (ctx.kind === "have") {
      wrong = ["base", "ing", "past", "s"];
      explain = `Sau ${q(ctx.word)} (thì hoàn thành) dùng quá khứ phân từ (V3).`;
    } else if (ctx.kind === "be") {
      if (form === "ing") {
        wrong = ["base", "s", "past"];
        explain = `${q(ctx.word)} + V-ing: thì tiếp diễn.`;
      } else if (form === "pp") {
        wrong = ["base", "s"];
        explain = `${q(ctx.word)} + V3: câu bị động.`;
      }
    } else if (form === "base") {
      wrong = ["s", "ing"];
      explain = ctx.word === null ? "Câu mệnh lệnh: dùng động từ nguyên mẫu." : "Chủ ngữ không phải ngôi thứ ba số ít: dùng động từ nguyên mẫu.";
    } else if (form === "s") {
      wrong = ["base", "ing"];
      explain = "Chủ ngữ ngôi thứ ba số ít, thì hiện tại: động từ thêm -s/-es.";
    } else if (form === "past") {
      wrong = ["ing", "pp"];
      explain = "Hành động đã xảy ra: dùng động từ quá khứ (V2).";
    } else if (form === "ing") {
      wrong = ["s", "past"];
      explain = "Vị trí này cần V-ing (danh động từ hoặc phân từ).";
    } else if (form === "pp") {
      wrong = ["base", "ing", "s"];
    }
    const right = forms[form].toLowerCase();
    return {
      wrong: [...new Set(wrong.map((f) => forms[f]).filter((f) => f.toLowerCase() !== right))],
      explain,
    };
  }
  if (m.pos === "noun") {
    // Uncountable-looking nouns (willingness, economics) have no plural to offer.
    const countable = !/(ness|ics|ism|dom|ing)$/.test(m.singular);
    if (countable && ctx.kind === "det" && m.number === "sing" && SING_DET.has(ctx.word)) {
      return { wrong: [m.plural], explain: `Sau ${q(ctx.word)} dùng danh từ số ít.` };
    }
    if (ctx.kind === "det" && m.number === "plural" && PLURAL_DET.has(ctx.word)) {
      return { wrong: [m.singular], explain: `Sau ${q(ctx.word)} dùng danh từ số nhiều.` };
    }
    return { wrong: [], explain: `Chỗ trống cần một danh từ${m.number === "plural" ? " số nhiều" : ""}.` };
  }
  if (m.pos === "adjective") {
    const adv = m.degree === "base" ? adverbOf(m.base) : null;
    const explain =
      m.degree === "er"
        ? "Dạng so sánh hơn của tính từ."
        : m.degree === "est"
          ? "Dạng so sánh nhất của tính từ."
          : ctx.kind === "be"
            ? `Sau ${q(ctx.word)} dùng tính từ, không dùng trạng từ.`
            : "Chỗ trống cần một tính từ (bổ nghĩa cho danh từ).";
    return { wrong: adv ? [adv] : [], explain };
  }
  return { wrong: [], explain: "Chỗ trống cần một trạng từ (bổ nghĩa cho động từ hoặc cả câu)." };
}

/** Put another word into the same form as the answer, for "right grammar, wrong meaning" choices. */
export function inflectLike(m: FormMatch, term: string, ipa: string | null) {
  if (m.pos === "verb") return verbForms(term, ipa)[m.form];
  if (m.pos === "noun") return m.number === "plural" ? plural(term) : term;
  if (m.pos === "adjective") {
    if (m.degree === "base") return term;
    const cmp = comparatives(term);
    return cmp ? cmp[m.degree === "er" ? 0 : 1] : null;
  }
  return term;
}

/** Match the answer's capitalisation (sentence-initial blanks). */
export function caseLike(answer: string, word: string) {
  return /^[A-Z]/.test(answer) ? capitalize(word) : word;
}

export const PREPOSITIONS = [
  "in", "on", "at", "to", "for", "with", "about", "of", "from", "by", "into", "onto", "over", "after",
  "against", "up", "out", "off", "through", "towards", "without", "under", "between", "among", "upon",
];
const PREP_SET = new Set(PREPOSITIONS);
export const isPreposition = (w: string) => PREP_SET.has(w.toLowerCase());

/** Prepositions named in a `prepositions` column ("arrive at (a place); arrive in (a city)"). */
export function prepositionsIn(pattern: string | null | undefined) {
  const words = (pattern ?? "").toLowerCase().match(/[a-z]+/g) ?? [];
  return new Set(words.filter((w) => PREP_SET.has(w)));
}

/* ---------- Question builder ---------- */

export type WordRow = { term: string; reading?: string | null; pos: string | null };

export type GrammarCloze = {
  before: string;
  answer: string;
  after: string;
  choices: string[];
  prompt: string;
  explain: string | null;
};

const COMMON_PREPS = PREPOSITIONS.slice(0, 11);

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * One grammar-aware blank for an English example. Either the preposition after the word is
 * blanked (arrived ___ Paris: in / at / on / to), or the word itself, with choices mixing other
 * forms of the same word (arriving, arrives), members of its word family with a different part of
 * speech (arrival) and another word in the same form (departed) so meaning still matters.
 */
export function grammarCloze(
  item: { term: string; reading: string | null; pos: string | null; prepositions: string | null },
  target: { before: string; target: string; after: string },
  pool: WordRow[],
  family: WordRow[],
): GrammarCloze {
  const termWords = item.term.trim().split(/\s+/).length;
  const words = target.target.trim().split(/\s+/);
  const allowed = prepositionsIn(item.prepositions);
  let word = target.target.trim();
  let prep: string | null = null;
  let sep = " ";
  let rest = target.after;

  if (words.length > termWords && isPreposition(words[words.length - 1])) {
    // "[arrived in] Paris": the bracket already holds the preposition.
    const m = target.target.match(/^([\s\S]*\S)(\s+)(\S+)\s*$/)!;
    word = m[1];
    sep = m[2];
    prep = m[3];
  } else {
    // "[interested] in photography" with "interested in" in the collocation column.
    const m = target.after.match(/^(\s+)([A-Za-z]+)\b/);
    if (m && allowed.has(m[2].toLowerCase())) {
      sep = m[1];
      prep = m[2];
      rest = target.after.slice(m[0].length);
    }
  }

  if (prep && Math.random() < 0.6) {
    const lower = prep.toLowerCase();
    const wrong = shuffled(COMMON_PREPS.filter((p) => p !== lower && !allowed.has(p))).slice(0, 3);
    return {
      before: target.before + word + sep,
      answer: prep,
      after: rest,
      choices: shuffled([prep, ...wrong.map((w) => caseLike(prep, w))]),
      prompt: "Chọn giới từ đúng",
      explain: `${q(word.toLowerCase())} đi với giới từ ${q(lower)} trong câu này.`,
    };
  }

  const after = prep ? sep + prep + rest : rest;
  const ctx = contextOf(target.before);
  const posList = parsePos(item.pos);
  const m = matchForm(word, item.term, posList, item.reading, ctx);
  // Without a confident match only "same part of speech" meaning choices are offered.
  const answerPos = m?.pos;
  const lowerWord = word.toLowerCase();
  const seen = new Set([lowerWord]);
  const take = (list: string[], n: number) => {
    const out: string[] = [];
    for (const w of list) {
      const l = w.toLowerCase();
      if (out.length >= n || seen.has(l)) continue;
      seen.add(l);
      out.push(caseLike(word, w));
    }
    return out;
  };

  const forms = m ? formDistractors(m, ctx) : { wrong: [], explain: "" };
  const prefix = familyPrefix(item.term);
  const relatives = family
    .filter((r) => prefix && !r.term.includes(" ") && r.term.toLowerCase().startsWith(prefix) && r.term.toLowerCase() !== item.term.toLowerCase())
    .map((r) => ({ term: r.term, pos: parsePos(r.pos) }))
    .filter((r) => r.pos.length > 0 && answerPos && !r.pos.includes(answerPos));

  // Up to two grammar traps: one wrong form and one word-family member when both exist.
  const relativeTerms = shuffled(relatives).map((r) => r.term);
  const wrongForms = shuffled(forms.wrong);
  let grammar = [...take(wrongForms, relativeTerms.length ? 1 : 2), ...take(relativeTerms, 1)];
  if (grammar.length < 2) grammar = [...grammar, ...take([...wrongForms, ...relativeTerms], 2 - grammar.length)];

  // The rest: other words of the same part of speech in the same form (meaning check).
  const sameKind = shuffled(pool)
    .filter(
      (r) =>
        r.term.toLowerCase() !== item.term.toLowerCase() &&
        (answerPos ? parsePos(r.pos).includes(answerPos) : parsePos(r.pos).some((p) => posList.includes(p))),
    )
    .map((r) => (m ? inflectLike(m, r.term, r.reading ?? null) : r.term))
    .filter((w): w is string => !!w);
  const meaning = take(sameKind, 3 - grammar.length);
  const fallback = take(shuffled(pool).map((r) => r.term), 3 - grammar.length - meaning.length);

  const usedRelatives = relatives.filter((r) => grammar.some((g) => g.toLowerCase() === r.term.toLowerCase()));
  const parts = [forms.explain];
  if (usedRelatives.length) {
    parts.push(`Sai loại từ: ${usedRelatives.map((r) => `${r.term} (${POS_LABEL[r.pos[0]]})`).join(", ")}.`);
  }
  const explain = parts.filter(Boolean).join(" ") || null;

  return {
    before: target.before,
    answer: word,
    after,
    choices: shuffled([word, ...grammar, ...meaning, ...fallback]),
    prompt: "Chọn dạng đúng của từ",
    explain,
  };
}
