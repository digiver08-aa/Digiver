import { createClient } from "@/supabase/client";
import { CircleMembership } from "@/types/circle.types";

export async function joinCircle(
  circleId: string,
  personaId: string,
): Promise<CircleMembership> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("circle_memberships")
    .select("*")
    .eq("circle_id", circleId)
    .eq("persona_id", personaId)
    .maybeSingle();

  if (existing) {
    throw new Error("Persona is already a member of this circle.");
  }

  const { data, error } = await supabase
    .from("circle_memberships")
    .insert({
      circle_id: circleId,
      persona_id: personaId,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as CircleMembership;
}