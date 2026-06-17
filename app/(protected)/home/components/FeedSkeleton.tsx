export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-2xl border border-stone-800 bg-stone-900 p-5"
        >
          <div className="mb-4 h-4 w-32 rounded bg-stone-800" />

          <div className="space-y-2">
            <div className="h-3 rounded bg-stone-800" />
            <div className="h-3 w-5/6 rounded bg-stone-800" />
            <div className="h-3 w-2/3 rounded bg-stone-800" />
          </div>

          <div className="mt-6 flex gap-3">
            <div className="h-8 w-16 rounded bg-stone-800" />
            <div className="h-8 w-16 rounded bg-stone-800" />
            <div className="h-8 w-16 rounded bg-stone-800" />
          </div>
        </div>
      ))}
    </div>
  );
}