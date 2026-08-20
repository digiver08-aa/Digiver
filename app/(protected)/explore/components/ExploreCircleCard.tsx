/* eslint-disable @next/next/no-img-element */

// ============================================================
// DIGIVER
// ExploreCircleCard
// ============================================================

import Link from "next/link";

import { Users } from "lucide-react";

import type { Circle } from "@/types/circle.types";

export interface ExploreCircleCardProps {
  circle: Circle;
  className?: string;
}

export function ExploreCircleCard({
  circle,
  className,
}: ExploreCircleCardProps) {
  return (
    <Link
      href={`/circles/${circle.slug}`}
      aria-label={`Open ${circle.name}`}
      className={[
        "group block overflow-hidden rounded-2xl border border-border bg-card transition-all",
        "hover:border-primary/40 hover:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary/20",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative h-36 w-full overflow-hidden bg-muted">
        {circle.banner_url ? (
          <img
            src={circle.banner_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Users
              aria-hidden="true"
              className="h-10 w-10 text-muted-foreground"
            />
          </div>
        )}

        <div className="absolute -bottom-8 left-5">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted">
            {circle.avatar_url ? (
              <img
                src={circle.avatar_url}
                alt={`${circle.name} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <Users
                aria-hidden="true"
                className="h-8 w-8 text-muted-foreground"
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 px-5 pb-5 pt-10">
        <div>
          <h3 className="truncate text-base font-semibold">
            {circle.name}
          </h3>

          <p className="truncate text-sm text-muted-foreground">
            @{circle.slug}
          </p>
        </div>

        {circle.description && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {circle.description}
          </p>
        )}
      </div>
    </Link>
  );
}