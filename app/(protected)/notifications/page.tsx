// app/(protected)/notifications/page.tsx

import { createClient } from "@/supabase/server";

import NotificationsPageClient from "./NotificationsPageClient";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: persona } = await supabase
    .from("personas")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!persona) {
    return null;
  }

  return (
    <NotificationsPageClient
      personaId={persona.id}
    />
  );
}