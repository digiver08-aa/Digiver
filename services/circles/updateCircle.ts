import { createClient } from "@/supabase/client";
import { Circle, UpdateCircleInput } from "@/types/circle.types";

export async function updateCircle(
  circleId: string,
  input: UpdateCircleInput,
): Promise<Circle> {
  const supabase = await createClient();

  if (input.slug) {
    const slug = input.slug.trim().toLowerCase();

    const { data: existing } = await supabase
      .from("circles")
      .select("id")
      .eq("slug", slug)
      .neq("id", circleId)
      .maybeSingle();

    if (existing) {
      throw new Error("Circle slug already exists.");
    }
  }

  const updates = {
    ...(input.name !== undefined && { name: input.name.trim() }),
    ...(input.slug !== undefined && {
      slug: input.slug.trim().toLowerCase(),
    }),
    ...(input.description !== undefined && {
      description: input.description,
    }),
    ...(input.avatar_url !== undefined && {
      avatar_url: input.avatar_url,
    }),
    ...(input.banner_url !== undefined && {
      banner_url: input.banner_url,
    }),
  };

  const { data, error } = await supabase
    .from("circles")
    .update(updates)
    .eq("id", circleId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Circle;
}