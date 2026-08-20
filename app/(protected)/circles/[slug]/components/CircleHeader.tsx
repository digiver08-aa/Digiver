/* eslint-disable @next/next/no-img-element */

import { Circle } from "@/types/circle.types";

import CircleMembershipButton from "./CircleMembershipButton";

interface Owner {
  id: string;
  name?: string | null;
  slug?: string | null;
  title?: string | null;
  avatar_url?: string | null;
}

interface CircleHeaderProps {
  circle: Circle;
  owner: Owner | null;
  memberCount: number;
  isMember: boolean;
}

export default function CircleHeader({
  circle,
  owner,
  memberCount,
  isMember,
}: CircleHeaderProps) {
  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="relative h-48 w-full bg-muted md:h-64">
        {circle.banner_url ? (
          <img
            src={circle.banner_url}
            alt={circle.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex min-w-0 gap-4">
            <div className="relative -mt-16 h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted">
              {circle.avatar_url ? (
                <img
                  src={circle.avatar_url}
                  alt={circle.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold sm:text-3xl">
                {circle.name}
              </h1>

              <p className="mt-2 break-words text-sm text-muted-foreground">
                {circle.description ??
                  "No description available."}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {owner && (
                  <span>
                    Owner: {owner.name}
                  </span>
                )}

                {owner?.title && (
                  <span>
                    {owner.title}
                  </span>
                )}

                {owner?.slug && (
                  <span>
                    @{owner.slug}
                  </span>
                )}
              </div>
            </div>
          </div>

          <CircleMembershipButton
            circleId={circle.id}
            ownerPersonaId={circle.owner_persona_id}
            initialIsMember={isMember}
            initialMemberCount={memberCount}
          />
        </div>
      </div>
    </div>
  );
}