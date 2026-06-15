import { createClient } from "@/supabase/client";

import { hasPersona } from "./hasPersona";

import type {
  CreatePersonaInput,
  Persona,
  PersonaResponse,
} from "@/types/persona.types";

export async function createPersona(
  input: CreatePersonaInput
): Promise<PersonaResponse> {
  const supabase = createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      success: false,
      message: "Authentication required.",
      data: null,
    };
  }

  const alreadyHasPersona = await hasPersona(
    user.id
  );

  if (alreadyHasPersona) {
    return {
      success: false,
      message:
        "You already have a persona.",
      data: null,
    };
  }

  const normalizedSlug =
    input.slug.trim().toLowerCase();

  const {
    data: existingSlug,
    error: slugError,
  } = await supabase
    .from("personas")
    .select("id")
    .eq("slug", normalizedSlug)
    .maybeSingle();

  if (slugError) {
    return {
      success: false,
      message:
        "Failed to validate persona slug.",
      data: null,
    };
  }

  if (existingSlug) {
    return {
      success: false,
      message: "Slug is already taken.",
      data: null,
    };
  }

  const { data, error } = await supabase
    .from("personas")
    .insert({
      user_id: user.id,
      name: input.name.trim(),
      slug: normalizedSlug,
      title: input.title?.trim() || null,
      bio: input.bio?.trim() || null,
      avatar_url:
        input.avatarUrl?.trim() || null,
      banner_url:
        input.bannerUrl?.trim() || null,
      is_public: input.isPublic ?? true,
    })
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      message:
        error?.message ??
        "Failed to create persona.",
      data: null,
    };
  }

  const persona: Persona = {
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

  return {
    success: true,
    message:
      "Persona created successfully.",
    data: persona,
  };
}