import { createClient } from "@/supabase/client";

export async function getUnreadCount(
  personaId: string
): Promise<number> {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "recipient_persona_id",
      personaId
    )
    .eq("is_read", false);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}