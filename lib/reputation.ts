// ============================================================
// DIGIVER
// PHASE 9 — REPUTATION SYSTEM MVP
// lib/reputation.ts
// ============================================================

import { MAX_REPUTATION_SCORE } from "@/constants/reputation";

// ============================================================
// DATE FORMATTER
// ============================================================

export function formatReputationDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

// ============================================================
// PROGRESS
// ============================================================

export function getReputationProgress(
  score: number,
): number {
  if (score <= 0) {
    return 0;
  }

  return Math.min(
    (score / MAX_REPUTATION_SCORE) * 100,
    100,
  );
}