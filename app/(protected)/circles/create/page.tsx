import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";
import CircleCreateForm from "./components/CircleCreateForm";

export default async function CreateCirclePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: persona } = await supabase
    .from("personas")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!persona) {
    redirect("/personas/create");
  }

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Create Circle
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a new community around a shared identity,
          interest, ideology, or purpose.
        </p>
      </div>

      <CircleCreateForm
        ownerPersonaId={persona.id}
      />
    </div>
  );
}