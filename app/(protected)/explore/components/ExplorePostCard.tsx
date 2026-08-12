"use client";

// ============================================================
// DIGIVER
// ExplorePostCard
// ============================================================

import Link from "next/link";

import { FileText } from "lucide-react";

import type { Post } from "@/types/feed.types";

export interface ExplorePostCardProps {
  post: Post;
  className?: string;
}

export function ExplorePostCard({
  post,
  className,
}: ExplorePostCardProps) {
  return (
    <article
      className={[
        "rounded-2xl border border-border bg-card p-5 transition-all",
        "hover:border-primary/40 hover:shadow-lg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted"
          aria-hidden="true"
        >
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Link
              href={`/persona/${post.persona_id}`}
              className="truncate text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              View persona
            </Link>

            <time
              dateTime={post.created_at}
              className="shrink-0 text-xs text-muted-foreground"
            >
              {new Date(
                post.created_at,
              ).toLocaleDateString()}
            </time>
          </div>

          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-foreground">
            {post.content}
          </p>
        </div>
      </div>
    </article>
  );
}