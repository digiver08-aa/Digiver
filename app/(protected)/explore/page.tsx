import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";

import { ExplorePageClient } from "./ExplorePageClient";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <ExplorePageClient />;
}