"use client";

// ============================================================
// DIGIVER
// Explore LoadingSkeleton
// ============================================================

export interface LoadingSkeletonProps {
  className?: string;
}

function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse rounded-xl bg-muted",
        className,
      ].join(" ")}
    />
  );
}

export function LoadingSkeleton({
  className,
}: LoadingSkeletonProps) {
  return (
    <section
      aria-label="Loading explore results"
      aria-busy="true"
      className={[
        "space-y-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-28" />

        <div
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {Array.from(
            { length: 6 },
            (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <SkeletonBlock className="h-32 w-full rounded-none" />

                <div className="space-y-3 px-5 pb-5 pt-10">
                  <SkeletonBlock className="h-5 w-2/3" />
                  <SkeletonBlock className="h-4 w-1/3" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-4/5" />
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="space-y-4">
        <SkeletonBlock className="h-6 w-24" />

        <div className="space-y-4">
          {Array.from(
            { length: 2 },
            (_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex gap-4">
                  <SkeletonBlock className="h-10 w-10 shrink-0 rounded-full" />

                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <SkeletonBlock className="h-4 w-28" />
                      <SkeletonBlock className="h-3 w-20" />
                    </div>

                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-5/6" />
                    <SkeletonBlock className="h-4 w-2/3" />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}