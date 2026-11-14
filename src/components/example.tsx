import type { Example } from "@/db/schema";
import { splitTarget } from "@/lib/text";

/** Renders a sentence with its [bracketed] target word highlighted. */
export function Highlighted({ text, han = false }: { text: string; han?: boolean }) {
  const { before, target, after } = splitTarget(text);
  const rest = target ? splitTarget(after) : null;
  return (
    <span className={han ? "han" : ""}>
      {before.replace(/[[\]]/g, "")}
      {target && <mark className="target">{target}</mark>}
      {rest && (rest.target ? <Highlighted text={after} han={false} /> : after)}
    </span>
  );
}

export function ExampleLine({ ex, han }: { ex: Example; han: boolean }) {
  return (
    <li className="border-l-2 border-line pl-3">
      <div className={han ? "text-[17px] leading-relaxed" : "leading-relaxed"}>
        <Highlighted text={ex.text} han={han} />
      </div>
      {ex.reading && <div className="text-sm text-muted">{ex.reading}</div>}
      <div className="text-sm text-muted italic">{ex.translation}</div>
    </li>
  );
}
