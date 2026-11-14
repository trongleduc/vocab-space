export function Block({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-surface-2 ${className}`} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Block className="h-9 w-56" />
      <Block className="h-5 w-80 max-w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Block className="h-48" />
        <Block className="h-48" />
        <Block className="h-48" />
        <Block className="h-48" />
      </div>
    </div>
  );
}

export function FrameSkeleton() {
  return (
    <div className="min-h-dvh">
      <div className="fixed inset-y-0 left-0 hidden w-64 border-r-[1.5px] border-line bg-surface lg:block" />
      <div className="h-16 border-b-[1.5px] border-line lg:ml-64" />
      <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:ml-64">
        <PageSkeleton />
      </div>
    </div>
  );
}
