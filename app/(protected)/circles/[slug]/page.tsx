import { notFound } from "next/navigation";

import { createClient } from "@/supabase/server";
import {
  getCircleBySlug,
  getMembership,
} from "@/services/circles";

import CircleHeader from "./components/CircleHeader";
import CircleAbout from "./components/CircleAbout";
import CircleRules from "./components/CircleRules";
import CircleMembers from "./components/CircleMembers";
import CircleFeed from "./components/CircleFeed";
import CircleSidebar from "./components/CircleSidebar";

interface CircleProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CircleProfilePage({
  params,
}: CircleProfilePageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  const circle = await getCircleBySlug(slug);

  if (!circle) {
    notFound();
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let membership = null;

  if (user) {
    const { data: persona } = await supabase
      .from("personas")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (persona) {
      membership = await getMembership(
        circle.id,
        persona.id,
      );
    }
  }

  const [{ data: owner }, { count: memberCount }] =
    await Promise.all([
      supabase
        .from("personas")
        .select(
          `
          id,
          name,
          slug,
          title,
          avatar_url
          `,
        )
        .eq(
          "id",
          circle.owner_persona_id,
        )
        .maybeSingle(),

      supabase
        .from("circle_memberships")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("circle_id", circle.id),
    ]);

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="space-y-6">
        <CircleHeader
          circle={circle}
          owner={owner}
          isMember={Boolean(membership)}
          memberCount={memberCount ?? 0}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <CircleAbout
              description={circle.description}
              createdAt={circle.created_at}
            />

            <CircleRules />

            <CircleFeed
              circleId={circle.id}
            />
          </div>

          <div className="space-y-6">
            <CircleSidebar
              circle={circle}
              owner={owner}
              memberCount={memberCount ?? 0}
              isMember={Boolean(membership)}
            />

            <CircleMembers
              circleId={circle.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}