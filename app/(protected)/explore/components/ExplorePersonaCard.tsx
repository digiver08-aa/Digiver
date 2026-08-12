"use client";

// ============================================================
// DIGIVER
// ExplorePersonaCard
// ============================================================

import Image from "next/image";
import Link from "next/link";

import { User } from "lucide-react";

import type { Persona } from "@/types/persona.types";

export interface ExplorePersonaCardProps {
  persona: Persona;
  className?: string;
}

export function ExplorePersonaCard({
  persona,
  className,
}: ExplorePersonaCardProps) {
  return (
    <Link
      href={`/persona/${persona.slug}`}
      aria-label={`Open ${persona.name}`}
      className={[
        `
        group
        block
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-card
        transition-all
        hover:border-primary/40
        hover:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-primary/20
        `,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative h-32 w-full overflow-hidden bg-muted">
        {persona.bannerUrl ? (
          <Image
            src={persona.bannerUrl}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <User
              className="h-10 w-10 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="absolute -bottom-8 left-5">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted">
            {persona.avatarUrl ? (
              <Image
                src={persona.avatarUrl}
                alt={`${persona.name} avatar`}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <User
                className="h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 px-5 pb-5 pt-10">
        <div>
          <h3 className="truncate text-base font-semibold">
            {persona.name}
          </h3>

          <p className="truncate text-sm text-muted-foreground">
            @{persona.slug}
          </p>
        </div>

        {persona.title && (
          <p className="line-clamp-1 text-sm font-medium">
            {persona.title}
          </p>
        )}

        {persona.bio && (
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {persona.bio}
          </p>
        )}
      </div>
    </Link>
  );
}