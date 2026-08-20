"use client";

import { useFeed } from "@/hooks/useFeed";

import { FeedCard } from "./FeedCard";
import { FeedSkeleton } from "./FeedSkeleton";

export function FeedList() {
  const {
    posts,
    loading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    refreshFeed,
  } = useFeed();

  if (loading) {
    return <FeedSkeleton />;
  }

  if (error && !posts.length) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-300" role="alert">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => void refreshFeed()}
          className="mt-4 rounded-lg border border-red-800 px-4 py-2 text-sm transition hover:bg-red-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-stone-800 bg-stone-900 p-10 text-center">
        <h3 className="mb-2 font-serif text-xl text-amber-200">
          The Society Is Silent
        </h3>

        <p className="text-stone-400">
          Be the first to leave a
          thought within the archives.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FeedCard
          key={post.id}
          post={post}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={loadingMore}
            aria-busy={loadingMore}
            className="min-h-11 rounded-lg border border-stone-700 px-5 py-2 text-sm text-stone-300 transition hover:border-stone-500 hover:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingMore ? "Loading more..." : "Load more posts"}
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-300" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void loadMore()}
            disabled={loadingMore}
            className="ml-3 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}