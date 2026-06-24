import { createClient } from "@/supabase/client";
import {
  Circle,
  CreateCircleInput,
} from "@/types/circle.types";

export async function createCircle(
  input: CreateCircleInput,
): Promise<Circle> {
  const supabase = await createClient();

  const slug = input.slug.trim().toLowerCase();

  const { data: existing } = await supabase
    .from("circles")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (existing) {
    throw new Error("Circle slug already exists.");
  }

  const { data: circle, error: circleError } =
    await supabase
      .from("circles")
      .insert({
        owner_persona_id:
          input.owner_persona_id,
        name: input.name.trim(),
        slug,
        description:
          input.description ?? null,
        avatar_url:
          input.avatar_url ?? null,
        banner_url:
          input.banner_url ?? null,
      })
      .select()
      .single();

  if (circleError) {
    throw circleError;
  }

  const { error: membershipError } =
    await supabase
      .from("circle_memberships")
      .insert({
        circle_id: circle.id,
        persona_id:
          input.owner_persona_id,
      });

  if (membershipError) {
    throw membershipError;
  }

  return circle as Circle;
}