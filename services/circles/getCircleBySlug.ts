import { createClient } from "@/supabase/server";
import { Circle } from "@/types/circle.types";

export async function getCircleBySlug(
  slug: string,
): Promise<Circle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("circles")
    .select("*")
    .eq("slug", slug.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Circle | null;
}