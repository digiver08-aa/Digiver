import { createClient } from "@/supabase/client";

import type {
  Persona,
  PersonaResponse,
  UpdatePersonaInput,
} from "@/types/persona.types";

export async function updatePersona(
  personaId: string,
  input: UpdatePersonaInput
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

  const {
    data: existingPersona,
    error: personaError,
  } = await supabase
    .from("personas")
    .select("id, user_id")
    .eq("id", personaId)
    .single();

  if (personaError || !existingPersona) {
    return {
      success: false,
      message: "Persona not found.",
      data: null,
    };
  }

  if (
    existingPersona.user_id !== user.id
  ) {
    return {
      success: false,
      message:
        "You do not have permission to edit this persona.",
      data: null,
    };
  }

  let normalizedSlug:
    | string
    | undefined;

  if (input.slug !== undefined) {
    normalizedSlug = input.slug
      .trim()
      .toLowerCase();

    const {
      data: existingSlug,
      error: slugError,
    } = await supabase
      .from("personas")
      .select("id")
      .eq("slug", normalizedSlug)
      .neq("id", personaId)
      .maybeSingle();

    if (slugError) {
      return {
        success: false,
        message:
          "Failed to validate slug.",
        data: null,
      };
    }

    if (existingSlug) {
      return {
        success: false,
        message:
          "Slug is already taken.",
        data: null,
      };
    }
  }

  const payload = {
    ...(input.name !== undefined && {
      name: input.name.trim(),
    }),

    ...(normalizedSlug !== undefined && {
      slug: normalizedSlug,
    }),

    ...(input.title !== undefined && {
      title: input.title?.trim() || null,
    }),

    ...(input.bio !== undefined && {
      bio: input.bio?.trim() || null,
    }),

    ...(input.avatarUrl !== undefined && {
      avatar_url:
        input.avatarUrl?.trim() || null,
    }),

    ...(input.bannerUrl !== undefined && {
      banner_url:
        input.bannerUrl?.trim() || null,
    }),

    ...(input.isActive !== undefined && {
      is_active: input.isActive,
    }),

    ...(input.isPublic !== undefined && {
      is_public: input.isPublic,
    }),
  };

  const { data, error } = await supabase
    .from("personas")
    .update(payload)
    .eq("id", personaId)
    .select()
    .single();

  if (error || !data) {
    return {
      success: false,
      message:
        error?.message ??
        "Failed to update persona.",
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
      "Persona updated successfully.",
    data: persona,
  };
}