import { createClient } from "@/supabase/client";

export async function markAllAsRead(
  personaId: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc(
    "mark_all_notifications_read",
    {
      target_persona_id: personaId,
    }
  );

  if (error) {
    throw new Error(error.message);
  }
}