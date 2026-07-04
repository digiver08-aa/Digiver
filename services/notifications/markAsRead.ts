import { createClient } from "@/supabase/client";

export async function markAsRead(
  notificationId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc(
    "mark_notification_read",
    {
      notification_id: notificationId,
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}