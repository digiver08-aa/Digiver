import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";
import { getReputationHistory } from "@/services/reputation";

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

  let reputation: Awaited<
    ReturnType<typeof getReputationHistory>
  >["reputation"] = null;

  let history: Awaited<
    ReturnType<typeof getReputationHistory>
  >["events"] = [];

  let reputationError: string | undefined;

  try {
    const result = await getReputationHistory(persona.id);

    reputation = result.reputation;
    history = result.events;
  } catch (err) {
    reputationError =
      err instanceof Error
        ? err.message
        : "Unable to load reputation.";
  }

  return (
    <ReputationPageClient
      reputation={reputation}
      history={history}
      error={reputationError}
    />
  );
}