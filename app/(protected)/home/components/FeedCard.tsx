"use client";

import Link from "next/link";

import { ReactionBar } from "./ReactionBar";

import type { Post } from "@/types/feed.types";

interface Props {
  post: Post;
}

export function FeedCard({
  post,
}: Props) {
  return (
    <article className="rounded-2xl border border-stone-800 bg-stone-900/80 p-5 backdrop-blur">
      <div className="mb-3 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="break-words text-sm font-medium text-amber-300">
            {post.persona ? (
              <Link
                href={`/persona/${post.persona.id}`}
                className="rounded-sm hover:underline focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {post.persona.display_name}
              </Link>
            ) : (
              "Unknown Persona"
            )}
          </div>

          {post.persona?.title && (
            <div className="text-xs text-stone-500">
              {post.persona.title}
            </div>
          )}
        </div>

        <time dateTime={post.created_at} className="shrink-0 text-right text-xs text-stone-500">
          {new Date(post.created_at).toLocaleString()}
        </time>
      </div>

      <p className="wrap-break-word whitespace-pre-wrap leading-relaxed text-stone-200">
        {post.content}
      </p>

      <div className="mt-5 flex gap-4 text-xs text-stone-500">
        <span>
          {post.reactions_count}
          {" "}
          Reactions
        </span>

        <span>
          {post.comments_count}
          {" "}
          Comments
        </span>
      </div>

      <ReactionBar post={post} />
    </article>
  );
}