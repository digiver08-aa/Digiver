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
      <textarea
        value={content}
        onChange={(e) =>
          setContent(
            e.target.value
          )
        }
        maxLength={1000}
        placeholder="Share a reflection with the society..."
        className="min-h-30 w-full resize-none rounded-xl border border-stone-700 bg-stone-950 p-4 text-stone-200 outline-none"
      />

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-stone-500">
          {content.length}/1000
        </span>

        <button
          type="submit"
          disabled={
            loading ||
            !content.trim()
          }
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