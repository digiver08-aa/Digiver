import { createClient } from "@/supabase/client";

import type {
  Reaction,
  ReactionResponse,
  ReactionType,
} from "@/types/feed.types";

export async function addReaction(
  postId: string,
  personaId: string,
  reactionType: ReactionType
): Promise<ReactionResponse> {
  try {
    const supabase = createClient();

    const { data: existingReaction } =
      await supabase
        .from("reactions")
        .select("*")
        .eq("post_id", postId)
        .eq("persona_id", personaId)
        .maybeSingle();

    if (existingReaction) {
      const { error } = await supabase
        .from("reactions")
        .delete()
        .eq("id", existingReaction.id);

      if (error) {
        return {
          success: false,
          reaction: null,
          error: error.message,
        };
      }
    }

    const { data, error } = await supabase
      .from("reactions")
      .insert({
        post_id: postId,
        persona_id: personaId,
        type: reactionType,
      })
      .select()
      .single();

    if (error || !data) {
      return {
        success: false,
        reaction: null,
        error: error?.message ?? "Failed to react",
      };
    }

    const reaction: Reaction = {
      id: data.id,
      post_id: data.post_id,
      persona_id: data.persona_id,
      reaction_type:
        data.type as ReactionType,
      created_at: data.created_at,
    };

    return {
      success: true,
      reaction,
    };
  } catch (error) {
    return {
      success: false,
      reaction: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to react",
    };
  }
}