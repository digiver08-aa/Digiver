// ============================================================
// DIGIVER
// PHASE 9 — REPUTATION SYSTEM MVP
// services/reputation/events/reputationRuntime.ts
// ============================================================

import type {
  EmitReputationEventInput,
} from "./types";

import {
  REPUTATION_EVENT_TYPES,
  REPUTATION_SOURCE_PATTERNS,
} from "./constants";

// ============================================================
// VALIDATION
// ============================================================

function validatePersonaId(
  personaId: string,
): void {
  if (!personaId.trim()) {
    throw new Error(
      "Persona ID is required.",
    );
  }
}

function validateSourceReference(
  sourceReference: string,
): void {
  if (!sourceReference.trim()) {
    throw new Error(
      "Source reference is required.",
    );
  }

  if (sourceReference.length > 255) {
    throw new Error(
      "Source reference exceeds the maximum length.",
    );
  }

  const valid = Object.values(
    REPUTATION_SOURCE_PATTERNS,
  ).some((pattern) =>
    pattern.test(sourceReference),
  );

  if (!valid) {
    throw new Error(
      "Invalid reputation source reference.",
    );
  }
}

function validateEventType(
  eventType: EmitReputationEventInput["eventType"],
): void {
  if (
    !REPUTATION_EVENT_TYPES.includes(
      eventType,
    )
  ) {
    throw new Error(
      "Unsupported reputation event.",
    );
  }
}

// ============================================================
// PAYLOAD BUILDER
// ============================================================

export async function buildReputationEventPayload(
  input: EmitReputationEventInput,
): Promise<EmitReputationEventInput> {
  validatePersonaId(
    input.personaId,
  );

  validateEventType(
    input.eventType,
  );

  validateSourceReference(
    input.sourceReference,
  );

  return input;
}