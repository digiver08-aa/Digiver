// ============================================================
// DIGIVER
// PHASE 9 — REPUTATION SYSTEM MVP
// services/reputation/events/reputationEvents.ts
// ============================================================

import { emitReputationEvent } from "./emitReputationEvent";

import {
  REPUTATION_SOURCE_PREFIXES,
} from "./constants";

// ============================================================
// REACTION
// ============================================================

export async function emitReactionReceived(
  personaId: string,
  reactionId: string,
): Promise<void> {
  await emitReputationEvent({
    personaId,
    eventType: "REACTION_RECEIVED",
    sourceReference:
      `${REPUTATION_SOURCE_PREFIXES.REACTION}:${reactionId}`,
  });
}

// ============================================================
// MESSAGE
// ============================================================

export async function emitMessageParticipation(
  personaId: string,
  messageId: string,
): Promise<void> {
  await emitReputationEvent({
    personaId,
    eventType: "MESSAGE_PARTICIPATION",
    sourceReference:
      `${REPUTATION_SOURCE_PREFIXES.MESSAGE}:${messageId}`,
  });
}

// ============================================================
// CIRCLE MEMBERSHIP
// ============================================================

export async function emitCircleMembershipParticipation(
  personaId: string,
  membershipId: string,
): Promise<void> {
  await emitReputationEvent({
    personaId,
    eventType: "CIRCLE_PARTICIPATION",
    sourceReference:
      `${REPUTATION_SOURCE_PREFIXES.CIRCLE_MEMBERSHIP}:${membershipId}`,
  });
}

// ============================================================
// CIRCLE POST
// ============================================================

export async function emitCirclePostParticipation(
  personaId: string,
  postId: string,
): Promise<void> {
  await emitReputationEvent({
    personaId,
    eventType: "CIRCLE_PARTICIPATION",
    sourceReference:
      `${REPUTATION_SOURCE_PREFIXES.CIRCLE_POST}:${postId}`,
  });
}