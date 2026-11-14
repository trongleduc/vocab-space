export function FormMessage({ state }: { state: { error?: string; ok?: string } | undefined }) {
  if (!state?.error && !state?.ok) return null;
  return (
    <p
      role="status"
      className={`animate-rise rounded-xl px-3 py-2 text-sm font-medium ${
        state.error ? "bg-bad/10 text-bad" : "bg-good/10 text-good"
      }`}
    >
      {state.error ?? state.ok}
    </p>
  );
}
