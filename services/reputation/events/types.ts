// ============================================================
// DIGIVER
// PHASE 9 — REPUTATION SYSTEM MVP
// services/reputation/events/types.ts
// ============================================================

import type {
  ReputationEventType,
} from "@/types/reputation.types";

// ============================================================
// PUBLIC INPUT
// ============================================================

export interface EmitReputationEventInput {
  personaId: string;
  eventType: ReputationEventType;
  sourceReference: string;
}

// ============================================================
// EVENT TYPES
// ============================================================

export type ReputationEventTypeList = ReadonlyArray<
  ReputationEventType
>;

// ============================================================
// SOURCE PREFIXES
// ============================================================

export type ReputationSourcePrefix =
  | "reaction"
  | "message"
  | "circle_membership"
  | "circle_post";

// ============================================================
// VALIDATION RESULT
// ============================================================

export interface RuntimeValidationResult {
  valid: boolean;
  reason?: string;
}