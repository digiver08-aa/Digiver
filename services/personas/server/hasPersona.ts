import { createClient } from "@/supabase/server";

export async function hasPersona(
  userId: string
): Promise<boolean> {
  const supabase = await createClient();

  const { count } = await supabase
    .from("personas")
    .select("*", {
      head: true,
      count: "exact",
    })
    .eq("user_id", userId);

  return (count ?? 0) > 0;
}