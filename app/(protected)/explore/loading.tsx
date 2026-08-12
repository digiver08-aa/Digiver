import { LoadingSkeleton } from "./components/LoadingSkeleton";

export default function ExploreLoading() {
  return (
    <main
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading Explore"
    >
      <div className="space-y-8">
        <header className="space-y-5">
          <div className="space-y-2">
            <div
              aria-hidden="true"
              className="h-8 w-28 animate-pulse rounded-xl bg-muted"
            />

            <div
              aria-hidden="true"
              className="h-5 w-full max-w-xl animate-pulse rounded-lg bg-muted"
            />
          </div>

          <div
            aria-hidden="true"
            className="h-12 w-full animate-pulse rounded-xl bg-muted"
          />

          <div
            aria-hidden="true"
            className="h-10 w-full animate-pulse rounded-xl bg-muted"
          />

          <div
            aria-hidden="true"
            className="h-10 w-full max-w-md animate-pulse rounded-xl bg-muted"
          />
        </header>

        <LoadingSkeleton />
      </div>
    </main>
  );
}