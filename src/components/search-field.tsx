import { Search } from "lucide-react";

/**
 * GET search form with a leading icon. The icon and the input's left padding live together here
 * so they cannot drift apart (the icon used to sit on top of the placeholder on phones).
 * `hidden` carries the other filters along with the query.
 */
export function SearchField({
  action,
  defaultValue,
  placeholder,
  hidden = {},
  className = "",
}: {
  action: string;
  defaultValue?: string;
  placeholder: string;
  hidden?: Record<string, string | undefined>;
  className?: string;
}) {
  return (
    <form action={action} role="search" className={`relative min-w-0 ${className}`}>
      {Object.entries(hidden).map(([name, value]) => value && <input key={name} type="hidden" name={name} value={value} />)}
      <Search
        size={16}
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label={placeholder}
        className="field min-h-10 appearance-none truncate pl-10"
      />
    </form>
  );
}
