import { createClient } from "@/supabase/server";

import type { Reputation } from "@/types/reputation.types";

function validatePersonaId(personaId: string): void {
  if (!personaId.trim()) {
    throw new Error("Persona ID is required.");
  }
}

function mapReputation(data: {
  persona_id: string;
  score: number;
  created_at: string;
  updated_at: string;
}): Reputation {
  return {
    personaId: data.persona_id,
    score: data.score,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function getReputation(
  personaId: string,
): Promise<Reputation | null> {
  validatePersonaId(personaId);

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reputations")
    .select("persona_id, score, created_at, updated_at")
    .eq("persona_id", personaId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapReputation(data) : null;
}