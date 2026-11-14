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

export function letterOf(term: string, reading?: string | null) {
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
