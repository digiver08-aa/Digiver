import { createClient } from "@/supabase/client";
import { CircleMembership } from "@/types/circle.types";

export async function getMembership(
  circleId: string,
  personaId: string,
): Promise<CircleMembership | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("circle_memberships")
    .select("*")
    .eq("circle_id", circleId)
    .eq("persona_id", personaId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as CircleMembership | null;
}