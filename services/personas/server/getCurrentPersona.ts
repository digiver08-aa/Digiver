import { createClient } from "@/supabase/server";

import { getPersonaByUserId } from "./getPersonaByUserId";

export async function getCurrentPersona() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const result =
    await getPersonaByUserId(user.id);

  return result.success
    ? result.data
    : null;
}