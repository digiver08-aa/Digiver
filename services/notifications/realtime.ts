import { createClient } from "@/supabase/client";

import type {
  Notification,
} from "@/types/notification.types";

type NotificationInsertCallback =
  (notification: Notification) => void;

interface SubscriptionHandle {
  unsubscribe: () => Promise<void>;
}

export async function subscribeToNotifications(
  personaId: string,
  callback: NotificationInsertCallback
): Promise<SubscriptionHandle> {
  const supabase = createClient();

  const channelName =
    `notifications:${personaId}:${crypto.randomUUID()}`;

  const channel = supabase
    .channel(channelName)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter:
          `recipient_persona_id=eq.${personaId}`,
      },
      (payload) => {
        callback(
          payload.new as Notification
        );
      }
    );

  const status =
    await new Promise<string>(
      (resolve) => {
        channel.subscribe((status) => {
          resolve(status);
        });
      }
    );

  if (status !== "SUBSCRIBED") {
    await supabase.removeChannel(
      channel
    );

    throw new Error(
      `Notification subscription failed: ${status}`
    );
  }

  return {
    unsubscribe: async () => {
      await supabase.removeChannel(
        channel
      );
    },
  };
}

export async function unsubscribeFromNotifications(
  handle: SubscriptionHandle
): Promise<void> {
  await handle.unsubscribe();
}