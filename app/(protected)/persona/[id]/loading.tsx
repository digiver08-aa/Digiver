export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="overflow-hidden rounded-2xl border">
        <div className="h-40 animate-pulse bg-muted" />

        <div className="space-y-6 p-6">
          <div className="flex gap-4">
            <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />

            <div className="flex-1 space-y-3">
              <div className="h-8 w-64 animate-pulse rounded bg-muted" />
              <div className="h-4 w-96 animate-pulse rounded bg-muted" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </main>
  );
}