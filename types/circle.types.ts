// =====================================================
// DIGIVER
// PHASE 6 — CIRCLE SYSTEM
// circle.types.ts
// =====================================================

export interface Circle {
  id: string;
  owner_persona_id: string;

  name: string;
  slug: string;
  description: string | null;

  avatar_url: string | null;
  banner_url: string | null;

  created_at: string;
  updated_at: string;
}

export interface CircleMembership {
  id: string;

  circle_id: string;
  persona_id: string;

  created_at: string;
}

// =====================================================
// INPUTS
// =====================================================

export interface CreateCircleInput {
  owner_persona_id: string;

  name: string;
  slug: string;

  description?: string | null;

  avatar_url?: string | null;
  banner_url?: string | null;
}

export interface UpdateCircleInput {
  name?: string;
  slug?: string;

  description?: string | null;

  avatar_url?: string | null;
  banner_url?: string | null;
}

// =====================================================
// RESPONSES
// =====================================================

export interface CircleResponse {
  circle: Circle;
}

export interface CirclesResponse {
  circles: Circle[];
}

export interface MembershipResponse {
  membership: CircleMembership;
}