import { createClient } from "@/supabase/client";

import type {
  Post,
  PostsResponse,
  ReactionType,
} from "@/types/feed.types";

const EMPTY_SUMMARY: Record<ReactionType, number> = {
  like: 0,
  love: 0,
  insightful: 0,
  support: 0,
  applaud: 0,
  curious: 0,
};

export async function getPostById(
  postId: string
): Promise<PostsResponse> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } =
      await supabase
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
        .eq("id", postId)
        .single();

    if (error || !data) {
      return {
        success: false,
        post: null,
        error:
          error?.message ??
          "Post not found",
      };
    }

    const { data: reactions } =
      await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", postId);

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

    const summary = {
      ...EMPTY_SUMMARY,
    };

    reactions?.forEach(
      (reaction) => {
        summary[
          reaction.type as ReactionType
        ] += 1;
      }
    );

    const ownReaction =
      reactions?.find(
        (reaction) =>
          personaIds.includes(
            reaction.persona_id
          )
      );

    const post: Post = {
      id: data.id,
      persona_id:
        data.persona_id,
      content: data.content,
      created_at:
        data.created_at,
      updated_at:
        data.updated_at,

      reactions_count:
        reactions?.length ?? 0,

      comments_count: 0,

      reaction_summary:
        summary,

      user_reaction:
        ownReaction
          ?.type as
          | ReactionType
          | undefined ??
        null,

      persona: data.personas
        ? {
            id: data.personas.id,
            display_name:
              data.personas
                .display_name,
            title:
              data.personas.title,
            avatar_url:
              data.personas
                .avatar_url,
          }
        : null,
    };

    return {
      success: true,
      post,
    };
  } catch (error) {
    return {
      success: false,
      post: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch post",
    };
  }
}