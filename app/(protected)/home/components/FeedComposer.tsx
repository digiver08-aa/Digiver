"use client";

import { useState } from "react";

import { useFeed } from "@/hooks/useFeed";

export function FeedComposer() {
  const {
    createPost,
  } = useFeed();

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const value =
      content.trim();

    if (!value) return;

    setLoading(true);

    try {
      const success =
        await createPost({
          content: value,
        });

      if (success) {
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-2xl border border-stone-800 bg-stone-900 p-5"
    >
      <label htmlFor="feed-composer" className="sr-only">Post content</label>
      <textarea
        id="feed-composer"
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        maxLength={1000}
        aria-describedby="feed-composer-count"
        placeholder="Share a reflection with the society..."
        className="min-h-30 w-full resize-none rounded-xl border border-stone-700 bg-stone-950 p-4 text-stone-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30"
      />

      <div className="mt-4 flex items-center justify-between">
        <span id="feed-composer-count" className="text-xs text-stone-500" aria-live="polite">
          {content.length}/1000
        </span>

        <button
          type="submit"
          aria-disabled={loading || !content.trim()}
          disabled={loading || !content.trim()}
          className="rounded-lg bg-amber-600 px-5 py-2 text-sm text-white transition hover:bg-amber-500 disabled:opacity-50"
        >
          {loading
            ? "Publishing..."
            : "Publish"}
        </button>
      </div>
    </form>
  );
}