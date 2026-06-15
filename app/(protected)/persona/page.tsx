import { redirect } from "next/navigation";

import { getCurrentPersona } from "@/services/personas/server";

export default async function PersonaRouterPage() {
  const persona = await getCurrentPersona();

  if (!persona) {
    redirect("/persona/create");
  }

  redirect(`/persona/${persona.id}`);
}