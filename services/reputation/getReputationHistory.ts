import { createClient } from "@/supabase/server";

import { getReputation } from "./getReputation";

import type {
  ReputationEvent,
  ReputationHistoryResponse,
} from "@/types/reputation.types";

function validatePersonaId(personaId: string): void {
  if (!personaId.trim()) {
    throw new Error("Persona ID is required.");
  }
}

function mapEvent(data: {
  id: string;
  persona_id: string;
  event_type:
    | "REACTION_RECEIVED"
    | "CIRCLE_PARTICIPATION"
    | "MESSAGE_PARTICIPATION";
  score_delta: number;
  source_reference: string;
  created_at: string;
}): ReputationEvent {
  return {
    id: data.id,
    personaId: data.persona_id,
    eventType: data.event_type,
    scoreDelta: data.score_delta,
    sourceReference: data.source_reference,
    createdAt: data.created_at,
  };
}

export async function getReputationHistory(
  personaId: string,
): Promise<ReputationHistoryResponse> {
  validatePersonaId(personaId);

  const supabase = await createClient();

  const reputation = await getReputation(personaId);

  const { data, error } = await supabase
    .from("reputation_events")
    .select(
      `
      id,
      persona_id,
      event_type,
      score_delta,
      source_reference,
      created_at
      `,
    )
    .eq("persona_id", personaId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return {
    reputation,
    events: (data ?? []).map(mapEvent),
  };
}