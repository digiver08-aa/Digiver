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
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-amber-300">
            {post.persona?.display_name ??
              "Unknown Persona"}
          </div>

          {post.persona?.title && (
            <div className="text-xs text-stone-500">
              {post.persona.title}
            </div>
          )}
        </div>

        <span className="text-xs text-stone-500">
          {new Date(
            post.created_at
          ).toLocaleString()}
        </span>
      </div>

      <p className="whitespace-pre-wrap leading-relaxed text-stone-200">
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