import { createClient } from "@/supabase/client";

import type {
  FeedResponse,
  Post,
  ReactionType,
} from "@/types/feed.types";

const PAGE_SIZE = 20;

const EMPTY_SUMMARY: Record<ReactionType, number> = {
  like: 0,
  love: 0,
  insightful: 0,
  support: 0,
  applaud: 0,
  curious: 0,
};

export async function getFeed(
  cursor?: string
): Promise<FeedResponse> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from("posts")
      .select(`
        *,
        personas (
          id,
          display_name,
          title,
          avatar_url
        )
      `)
      .order("created_at", {
        ascending: false,
      })
      .limit(PAGE_SIZE);

    if (cursor) {
      query = query.lt(
        "created_at",
        cursor
      );
    }

    const { data: posts, error } =
      await query;

    if (error) {
      return {
        success: false,
        posts: [],
        nextCursor: null,
        error: error.message,
      };
    }

    if (!posts?.length) {
      return {
        success: true,
        posts: [],
        nextCursor: null,
      };
    }

    const postIds = posts.map(
      (post) => post.id
    );

    const { data: reactions } =
      await supabase
        .from("reactions")
        .select("*")
        .in("post_id", postIds);

    let personaIds: string[] = [];

    if (user) {
      const { data: personas } =
        await supabase
          .from("personas")
          .select("id")
          .eq("user_id", user.id);

      personaIds =
        personas?.map(
          (persona) => persona.id
        ) ?? [];
    }

    const mappedPosts: Post[] =
      posts.map((post) => {
        const summary = {
          ...EMPTY_SUMMARY,
        };

        const postReactions =
          reactions?.filter(
            (reaction) =>
              reaction.post_id ===
              post.id
          ) ?? [];

        postReactions.forEach(
          (reaction) => {
            summary[
              reaction.type as ReactionType
            ] += 1;
          }
        );

        const ownReaction =
          postReactions.find(
            (reaction) =>
              personaIds.includes(
                reaction.persona_id
              )
          );

        return {
          id: post.id,
          persona_id:
            post.persona_id,
          content: post.content,
          created_at:
            post.created_at,
          updated_at:
            post.updated_at,

          reactions_count:
            postReactions.length,

          comments_count: 0,

          reaction_summary:
            summary,

          user_reaction:
            ownReaction
              ?.type as
              | ReactionType
              | undefined ??
            null,

          persona:
            post.personas
              ? {
                  id: post.personas.id,
                  display_name:
                    post.personas
                      .display_name,
                  title:
                    post.personas
                      .title,
                  avatar_url:
                    post.personas
                      .avatar_url,
                }
              : null,
        };
      });

    return {
      success: true,
      posts: mappedPosts,
      nextCursor:
        posts.length === PAGE_SIZE
          ? posts[
              posts.length - 1
            ].created_at
          : null,
    };
  } catch (error) {
    return {
      success: false,
      posts: [],
      nextCursor: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load feed",
    };
  }
}