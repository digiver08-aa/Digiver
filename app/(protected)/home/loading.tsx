import { FeedHeader } from "./components/FeedHeader";
import { FeedSkeleton } from "./components/FeedSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      <FeedHeader />

      <div className="mb-8 rounded-2xl border border-stone-800 bg-stone-900 p-5">
        <div className="h-28 animate-pulse rounded-xl bg-stone-800" />
      </div>

      <FeedSkeleton />
    </main>
  );
}