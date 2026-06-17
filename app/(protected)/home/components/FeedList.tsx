"use client";

import { useFeed } from "@/hooks/useFeed";

import { FeedCard } from "./FeedCard";
import { FeedSkeleton } from "./FeedSkeleton";

export function FeedList() {
  const {
    posts,
    loading,
    error,
  } = useFeed();

  if (loading) {
    return <FeedSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6 text-red-300">
        {error}
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
    </div>
  );
}