// ============================================================
// DIGIVER
// PHASE 9 — REPUTATION SYSTEM MVP
// types/reputation.types.ts
// ============================================================

export type ReputationEventType =
  | "REACTION_RECEIVED"
  | "CIRCLE_PARTICIPATION"
  | "MESSAGE_PARTICIPATION";

// ============================================================
// DATABASE MODELS
// ============================================================

export interface Reputation {
  personaId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReputationEvent {
  id: string;
  personaId: string;
  eventType: ReputationEventType;
  scoreDelta: number;
  sourceReference: string;
  createdAt: string;
}

// ============================================================
// API RESPONSES
// ============================================================

export interface ReputationResponse {
  reputation: Reputation | null;
}

export interface ReputationHistoryResponse {
  reputation: Reputation | null;
  events: ReputationEvent[];
}

// ============================================================
// INPUTS
// ============================================================

export interface RefreshReputationInput {
  personaId: string;
}

// ============================================================
// SERVICE CONTRACTS
// ============================================================

export interface ReputationService {
  /**
   * Returns the current reputation for a persona.
   */
  getReputation(personaId: string): Promise<Reputation | null>;

  /**
   * Returns reputation together with event history.
   */
  getHistory(personaId: string): Promise<ReputationHistoryResponse>;

  /**
   * Refreshes/recalculates reputation.
   * Reserved for future implementations.
   */
  refresh(
    input: RefreshReputationInput
  ): Promise<ReputationResponse>;
}

// ============================================================
// PROVIDER CONTRACTS
// ============================================================

export interface ReputationContextValue {
  reputation: Reputation | null;
  history: ReputationEvent[];

  loading: boolean;
  error: string | null;

  refresh(
    input?: RefreshReputationInput
  ): Promise<void>;
}

// ============================================================
// UI CONTRACTS
// ============================================================

export interface ReputationBadgeProps {
  reputation: Reputation | null;
  className?: string;
}

export interface ReputationCardProps {
  reputation: Reputation | null;
  loading?: boolean;
  className?: string;
}

export interface ReputationHistoryListProps {
  events: ReputationEvent[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export interface ReputationProgressProps {
  reputation: Reputation | null;
  className?: string;
}

export interface ReputationOverviewProps {
  className?: string;
}