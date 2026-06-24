import { createClient } from "@/supabase/server";

interface CircleMembersProps {
  circleId: string;
}

interface Persona {
  id: string;
  name: string | null;
  slug: string | null;
  title: string | null;
}

interface MembershipRow {
  personas: Persona[];
}

export default async function CircleMembers({
  circleId,
}: CircleMembersProps) {
  const supabase = await createClient();

  const { data: circle, error: circleError } =
    await supabase
      .from("circles")
      .select("owner_persona_id")
      .eq("id", circleId)
      .single();

  if (circleError || !circle) {
    throw (
      circleError ??
      new Error("Circle not found.")
    );
  }

  const { data: owner, error: ownerError } =
    await supabase
      .from("personas")
      .select(
        `
        id,
        name,
        slug,
        title
        `,
      )
      .eq(
        "id",
        circle.owner_persona_id,
      )
      .maybeSingle();

  if (ownerError) {
    throw ownerError;
  }

  const {
    data: memberships,
    error: membershipsError,
  } = await supabase
    .from("circle_memberships")
    .select(
      `
      personas (
        id,
        name,
        slug,
        title
      )
      `,
    )
    .eq("circle_id", circleId);

  if (membershipsError) {
    throw membershipsError;
  }

  const members = (
    (memberships ?? []) as MembershipRow[]
  ).flatMap((row) => row.personas ?? []);

  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Members
      </h2>

      <div className="mb-4 text-sm text-muted-foreground">
        {members.length} members
      </div>

      {owner && (
        <div className="mb-4 rounded-lg border p-3">
          <div className="text-xs text-muted-foreground">
            Owner
          </div>

          <div className="font-medium">
            {owner.name}
          </div>

          {owner.title && (
            <div className="text-xs text-muted-foreground">
              {owner.title}
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="rounded-lg border p-3"
          >
            <div className="font-medium">
              {member.name}
            </div>

            {member.title && (
              <div className="text-xs text-muted-foreground">
                {member.title}
              </div>
            )}

            {member.slug && (
              <div className="text-xs text-muted-foreground">
                @{member.slug}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}