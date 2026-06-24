import { createClient } from "@/supabase/client";
import { Circle } from "@/types/circle.types";

export async function getCircles(): Promise<Circle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("circles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Circle[];
}