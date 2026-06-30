// =====================================================
// DIGIVER
// PHASE 7 — MESSAGING SYSTEM
// realtime.service.ts
// =====================================================

import { createClient } from "@/supabase/client";

import type {
  RealtimeChannel,
} from "@supabase/supabase-js";

const channels = new Map<
  string,
  RealtimeChannel
>();

export function subscribeToConversation(
  conversationId: string,
  onMessage: () => void
): RealtimeChannel {
  const existing =
    channels.get(conversationId);

  if (existing) {
    return existing;
  }

  const supabase = createClient();

  const channel = supabase
    .channel(
      `conversation:${conversationId}`
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter:
          `conversation_id=eq.${conversationId}`,
      },
      () => {
        onMessage();
      }
    )
    .subscribe();

  channels.set(
    conversationId,
    channel
  );

  return channel;
}

export function unsubscribeFromConversation(
  conversationId: string
): void {
  const channel =
    channels.get(conversationId);

  if (!channel) {
    return;
  }

  const supabase = createClient();

  void supabase.removeChannel(
    channel
  );

  channels.delete(conversationId);
}