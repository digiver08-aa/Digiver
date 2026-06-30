// =====================================================
// DIGIVER
// PHASE 7 — MESSAGING SYSTEM
// messages.service.ts
// =====================================================

import { createClient } from "@/supabase/client";

import type {
  Message,
  MessageResponse,
  MessagesResponse,
  SendMessageInput,
} from "@/types/message.types";

export async function sendMessage(
  input: SendMessageInput
): Promise<MessageResponse> {
  const supabase = await createClient();

  const content = input.content.trim();

  if (!content) {
    throw new Error("Message content is required");
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: input.conversation_id,
      sender_persona_id: input.sender_persona_id,
      content,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ?? "Failed to send message"
    );
  }

  await supabase
    .from("conversations")
    .update({})
    .eq("id", input.conversation_id);

  return {
    success: true,
    message: data as Message,
  };
}

export async function getMessages(
  conversationId: string
): Promise<MessagesResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: true,
    });

  if (error || !data) {
    throw new Error(
      error?.message ?? "Failed to fetch messages"
    );
  }

  return {
    success: true,
    messages: data as Message[],
  };
}