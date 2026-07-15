import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";

import {
  getReputationHistory,
} from "@/services/reputation";

import ReputationPageClient from "./ReputationPageClient";

export default async function ReputationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: persona, error } = await supabase
    .from("personas")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!persona) {
    redirect("/persona/create");
  }

  const reputation =
    await getReputationHistory(persona.id);

  return (
    <ReputationPageClient
      reputation={reputation.reputation}
      history={reputation.events}
    />
  );
}