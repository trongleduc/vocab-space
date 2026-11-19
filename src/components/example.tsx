import type { Example } from "@/db/schema";
import { splitTarget } from "@/lib/text";
import { SpeakButton } from "./speak";

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

/** Example sentence block. With `speech` (a locale such as "zh-CN") it gets a button that reads the sentence. */
export function ExampleLine({ ex, font = "", speech }: { ex: Example; font?: string; speech?: string }) {
  return (
    <li className="flex items-start gap-2 border-l-2 border-line pl-3">
      <div className="min-w-0 flex-1">
        <div className={font ? "text-[17px] leading-relaxed" : "leading-relaxed"}>
          <Highlighted text={ex.text} font={font} />
        </div>
        {ex.reading && <div className="text-sm text-muted">{ex.reading}</div>}
        <div className="text-sm text-muted italic">{ex.translation}</div>
      </div>
      {speech && <SpeakButton text={ex.text} lang={speech} size="xs" ghost label="Nghe câu ví dụ" />}
    </li>
  );
}

/** Example in a tinted box (flashcards, quiz feedback), with a read-aloud button. */
export function ExampleBox({ ex, font = "", speech, large = false }: { ex: Example; font?: string; speech: string; large?: boolean }) {
  return (
    <div className={`flex items-start gap-2 rounded-2xl bg-surface-2 text-left ${large ? "p-4" : "p-3 text-sm"}`}>
      <div className="min-w-0 flex-1">
        <div className={font ? (large ? "text-lg" : "text-base") : ""}>
          <Highlighted text={ex.text} font={font} />
        </div>
        {ex.reading && <div className={`text-muted ${large ? "text-sm" : ""}`}>{ex.reading}</div>}
        <div className={`italic text-muted ${large ? "text-sm" : ""}`}>{ex.translation}</div>
      </div>
      <SpeakButton text={ex.text} lang={speech} size="xs" ghost label="Nghe câu ví dụ" />
    </div>
  );
}
