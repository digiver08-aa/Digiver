"use client";

import { useState } from "react";

import { useFeed } from "@/hooks/useFeed";

import type {
  Post,
  ReactionType,
} from "@/types/feed.types";

const REACTIONS: {
  type: ReactionType;
  label: string;
  icon: string;
}[] = [
  {
    type: "like",
    label: "Like",
    icon: "👍",
  },
  {
    type: "love",
    label: "Love",
    icon: "❤️",
  },
  {
    type: "insightful",
    label: "Insightful",
    icon: "📚",
  },
  {
    type: "support",
    label: "Support",
    icon: "🕯️",
  },
  {
    type: "applaud",
    label: "Applaud",
    icon: "👏",
  },
  {
    type: "curious",
    label: "Curious",
    icon: "🔍",
  },
];

interface Props {
  post: Post;
}

export function ReactionBar({
  post,
}: Props) {
  const {
    addReaction,
    removeReaction,
  } = useFeed();

  const [loading, setLoading] =
    useState(false);

  async function handleReaction(
    type: ReactionType
  ) {
    if (loading) return;

    setLoading(true);

    try {
      if (
        post.user_reaction === type
      ) {
        await removeReaction(
          post.id
        );
      } else {
        await addReaction(
          post.id,
          type
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {REACTIONS.map(
        ({
          type,
          label,
          icon,
        }) => (
          <button
            key={type}
            onClick={() =>
              handleReaction(type)
            }
            disabled={loading}
            className={`rounded-lg border px-3 py-2 text-xs transition ${
              post.user_reaction ===
              type
                ? "border-amber-500 bg-amber-500/10 text-amber-300"
                : "border-stone-700 bg-stone-900 text-stone-400 hover:border-stone-500"
            }`}
          >
            {icon} {label} (
            {
              post.reaction_summary[
                type
              ]
            }
            )
          </button>
        )
      )}
    </div>
  );
}