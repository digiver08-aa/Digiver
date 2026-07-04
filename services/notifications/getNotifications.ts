import { createClient } from "@/supabase/client";

import type {
  Notification,
  NotificationResponse,
} from "@/types/notification.types";

interface GetNotificationsOptions {
  personaId: string;

  limit?: number;

  offset?: number;
}

export async function getNotifications(
  options: GetNotificationsOptions
): Promise<NotificationResponse> {
  const supabase = createClient();

  const limit = options.limit ?? 25;
  const offset = options.offset ?? 0;

  const from = offset;
  const to = offset + limit - 1;

  const [{ data, error }, unreadResult] = await Promise.all([
    supabase
      .from("notifications")
      .select("*")
      .eq(
        "recipient_persona_id",
        options.personaId
      )
      .order("created_at", {
        ascending: false,
      })
      .range(from, to),

    supabase
      .from("notifications")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "recipient_persona_id",
        options.personaId
      )
      .eq("is_read", false),
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return {
    notifications:
      (data as Notification[]) ?? [],

    unreadCount:
      unreadResult.count ?? 0,
  };
}