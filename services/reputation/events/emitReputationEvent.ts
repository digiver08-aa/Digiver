// ============================================================
// DIGIVER
// PHASE 9 — REPUTATION SYSTEM MVP
// services/reputation/events/emitReputationEvent.ts
// ============================================================

import { createAdminClient } from "@/supabase/admin";

import { buildReputationEventPayload } from "./reputationRuntime";

import type {
  EmitReputationEventInput,
} from "./types";

// ============================================================
// HELPERS
// ============================================================

async function ensurePersonaExists(
  personaId: string,
): Promise<void> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("personas")
    .select("id")
    .eq("id", personaId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "Persona does not exist.",
    );
  }
}

// ============================================================
// EMIT EVENT
// ============================================================

export async function emitReputationEvent(
  input: EmitReputationEventInput,
): Promise<void> {
  const payload =
    await buildReputationEventPayload(
      input,
    );

  await ensurePersonaExists(
    payload.personaId,
  );

  const supabase =
    createAdminClient();

  const { error } =
    await supabase.rpc(
      "apply_reputation_event",
      {
        target_persona:
          payload.personaId,

        target_event:
          payload.eventType,

        target_source:
          payload.sourceReference,
      },
    );

  if (error) {
    throw error;
  }
}