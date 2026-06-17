import { createClient } from "@/supabase/client";

import type {
  CreatePostInput,
  Post,
  PostsResponse,
} from "@/types/feed.types";

export async function createPost(
  personaId: string,
  input: CreatePostInput
): Promise<PostsResponse> {
  try {
    const supabase = createClient();

    const content = input.content.trim();

    if (!content) {
      return {
        success: false,
        post: null,
        error: "Content cannot be empty",
      };
    }

    const { data, error } = await supabase
      .from("posts")
      .insert({
        persona_id: personaId,
        content,
      })
      .select()
      .single();

    if (error || !data) {
      return {
        success: false,
        post: null,
        error:
          error?.message ??
          "Failed to create post",
      };
    }

    const post: Post = {
      id: data.id,

      persona_id: data.persona_id,

      content: data.content,

      created_at: data.created_at,

      updated_at: data.updated_at,

      reactions_count: 0,

      comments_count: 0,

      reaction_summary: {
        like: 0,
        love: 0,
        insightful: 0,
        support: 0,
        applaud: 0,
        curious: 0,
      },

      user_reaction: null,

      persona: null,
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
          : "Failed to create post",
    };
  }
}