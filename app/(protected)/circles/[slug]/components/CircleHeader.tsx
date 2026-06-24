import Image from "next/image";

import { Circle } from "@/types/circle.types";

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
          <Image
            src={circle.banner_url}
            alt={circle.name}
            fill
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-4">
            <div className="relative -mt-16 h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted">
              {circle.avatar_url ? (
                <Image
                  src={circle.avatar_url}
                  alt={circle.name}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                {circle.name}
              </h1>

              <p className="mt-2 text-sm text-muted-foreground">
                {circle.description ??
                  "No description available."}
              </p>

              <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>
                  {memberCount} members
                </span>

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

          <button
            type="button"
            className="rounded-md border px-4 py-2"
          >
            {isMember
              ? "Joined"
              : "Join Circle"}
          </button>
        </div>
      </div>
    </div>
  );
}