import type { Persona } from "@/types/persona.types";

interface PersonaRow {
  id: string;
  user_id: string;

  name: string;
  slug: string;

  title: string | null;
  bio: string | null;

  avatar_url: string | null;
  banner_url: string | null;

  is_active: boolean;
  is_public: boolean;

  created_at: string;
  updated_at: string;
}

export function mapPersona(
  data: PersonaRow
): Persona {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    slug: data.slug,
    title: data.title,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    bannerUrl: data.banner_url,
    isActive: data.is_active,
    isPublic: data.is_public,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}