// =====================================================
// DIGIVER
// PHASE 7 — MESSAGING SYSTEM
// conversations.service.ts
// =====================================================

import { createClient } from "@/supabase/client";

import type {
  Conversation,
  ConversationParticipant,
  ConversationResponse,
  ConversationsResponse,
  CreateConversationInput,
} from "@/types/message.types";

export async function createConversation(
  input: CreateConversationInput
): Promise<ConversationResponse> {
  const supabase = await createClient();

  if (
    !Array.isArray(
      input.participant_persona_ids
    )
  ) {
    throw new Error(
      "Invalid participants"
    );
  }

  if (
    input.participant_persona_ids
      .length !== 2
  ) {
    throw new Error(
      "Conversation requires exactly two participants"
    );
  }

  const uniqueParticipants = [
    ...new Set(
      input.participant_persona_ids
    ),
  ];

  if (
    uniqueParticipants.length !== 2
  ) {
    throw new Error(
      "Duplicate participants are not allowed"
    );
  }

  const [personaA, personaB] =
    uniqueParticipants;

  const {
    data: conversationId,
    error: rpcError,
  } = await supabase.rpc(
    "create_direct_conversation",
    {
      persona_a: personaA,
      persona_b: personaB,
    }
  );

  if (
    rpcError ||
    !conversationId
  ) {
    throw new Error(
      rpcError?.message ??
        "Failed to create conversation"
    );
  }

  return getConversationById(
    conversationId
  );
}

export async function getConversationById(
  conversationId: string
): Promise<ConversationResponse> {
  const supabase = await createClient();

  const { data: conversation, error } =
    await supabase
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

  if (error || !conversation) {
    throw new Error(
      error?.message ?? "Conversation not found"
    );
  }

  const {
    data: participants,
    error: participantsError,
  } = await supabase
    .from("conversation_participants")
    .select("*")
    .eq("conversation_id", conversationId);

  if (participantsError || !participants) {
    throw new Error(
      participantsError?.message ??
        "Failed to load participants"
    );
  }

  return {
    success: true,
    conversation: conversation as Conversation,
    participants:
      participants as ConversationParticipant[],
  };
}

export async function getConversations(): Promise<ConversationsResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .order("updated_at", {
      ascending: false,
    });

  if (error || !data) {
    throw new Error(
      error?.message ??
        "Failed to fetch conversations"
    );
  }

  return {
    success: true,
    conversations: data as Conversation[],
  };
}