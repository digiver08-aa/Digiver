import { createClient } from "@/supabase/server";
import { Circle } from "@/types/circle.types";

export async function getCircleById(
  circleId: string,
): Promise<Circle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("circles")
    .select("*")
    .eq("id", circleId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Circle | null;
}