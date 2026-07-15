// ============================================================
// DIGIVER
// PHASE 9 — REPUTATION SYSTEM MVP
// services/reputation/events/constants.ts
// ============================================================

import type {
  ReputationEventTypeList,
} from "./types";

// ============================================================
// REPUTATION EVENT TYPES
// ============================================================

export const REPUTATION_EVENT_TYPES: ReputationEventTypeList =
  Object.freeze([
    "REACTION_RECEIVED",
    "MESSAGE_PARTICIPATION",
    "CIRCLE_PARTICIPATION",
  ]);

// ============================================================
// SOURCE PREFIXES
// ============================================================

export const REPUTATION_SOURCE_PREFIXES = Object.freeze({
  REACTION: "reaction",
  MESSAGE: "message",
  CIRCLE_MEMBERSHIP: "circle_membership",
  CIRCLE_POST: "circle_post",
} as const);

// ============================================================
// SOURCE REFERENCE PATTERNS
// ============================================================

export const REPUTATION_SOURCE_PATTERNS = Object.freeze({
  REACTION: /^reaction:[a-f0-9-]{36}$/i,
  MESSAGE: /^message:[a-f0-9-]{36}$/i,
  CIRCLE_MEMBERSHIP:
    /^circle_membership:[a-f0-9-]{36}$/i,
  CIRCLE_POST:
    /^circle_post:[a-f0-9-]{36}$/i,
} as const);

// ============================================================
// VALID SOURCE PREFIXES
// ============================================================

export const VALID_SOURCE_PREFIXES =
  Object.freeze(
    Object.values(
      REPUTATION_SOURCE_PREFIXES,
    ),
  );