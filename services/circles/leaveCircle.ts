import { createClient } from "@/supabase/client";

export async function leaveCircle(
  circleId: string,
  personaId: string,
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("circle_memberships")
    .delete()
    .eq("circle_id", circleId)
    .eq("persona_id", personaId);

  if (error) {
    throw error;
  }
}