import { createClient } from "@/supabase/client";

export async function hasPersona(
  userId: string
): Promise<boolean> {
  const { count, error } = await createClient()
    .from("personas")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (error) {
    return false;
  }

  return (count ?? 0) > 0;
}