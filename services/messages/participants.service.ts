// =====================================================
// DIGIVER
// PHASE 7 — MESSAGING SYSTEM
// participants.service.ts
// =====================================================

import { createClient } from "@/supabase/client";

import type {
  ConversationParticipant,
} from "@/types/message.types";

export async function getConversationParticipants(
  conversationId: string
): Promise<ConversationParticipant[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversation_participants")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: true,
    });

  if (error || !data) {
    throw new Error(
      error?.message ??
        "Failed to fetch participants"
    );
  }

  return data as ConversationParticipant[];
}