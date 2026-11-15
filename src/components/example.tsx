import type { Example } from "@/db/schema";
import { splitTarget } from "@/lib/text";

/** Renders a sentence with its [bracketed] target word highlighted. `font` is the script class (han, ja, ko). */
export function Highlighted({ text, font = "" }: { text: string; font?: string }) {
  const { before, target, after } = splitTarget(text);
  const rest = target ? splitTarget(after) : null;
  return (
    <span className={font}>
      {before.replace(/[[\]]/g, "")}
      {target && <mark className="target">{target}</mark>}
      {rest && (rest.target ? <Highlighted text={after} /> : after)}
    </span>
  );
}

export function ExampleLine({ ex, font = "" }: { ex: Example; font?: string }) {
  return (
    <li className="border-l-2 border-line pl-3">
      <div className={font ? "text-[17px] leading-relaxed" : "leading-relaxed"}>
        <Highlighted text={ex.text} font={font} />
      </div>
      {ex.reading && <div className="text-sm text-muted">{ex.reading}</div>}
      <div className="text-sm text-muted italic">{ex.translation}</div>
    </li>
  );
}
