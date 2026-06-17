import { createClient } from "@/supabase/client";

import type { ReactionResponse } from "@/types/feed.types";

export async function removeReaction(
  postId: string,
  personaId: string
): Promise<ReactionResponse> {
  try {
    const supabase = createClient();

    const { data } = await supabase
      .from("reactions")
      .select("*")
      .eq("post_id", postId)
      .eq("persona_id", personaId)
      .maybeSingle();

    if (!data) {
      return {
        success: true,
        reaction: null,
      };
    }

    const { error } = await supabase
      .from("reactions")
      .delete()
      .eq("post_id", postId)
      .eq("persona_id", personaId);

    if (error) {
      return {
        success: false,
        reaction: null,
        error: error.message,
      };
    }

    return {
      success: true,
      reaction: null,
    };
  } catch (error) {
    return {
      success: false,
      reaction: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to remove reaction",
    };
  }
}