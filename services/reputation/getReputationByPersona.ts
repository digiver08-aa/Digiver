import { getReputation } from "./getReputation";

import type { ReputationResponse } from "@/types/reputation.types";

function validatePersonaId(personaId: string): void {
  if (!personaId.trim()) {
    throw new Error("Persona ID is required.");
  }
}

export async function getReputationByPersona(
  personaId: string,
): Promise<ReputationResponse> {
  validatePersonaId(personaId);

  return {
    reputation: await getReputation(personaId),
  };
}