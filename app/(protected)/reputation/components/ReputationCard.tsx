"use client";

import { memo } from "react";

import {
  Award,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

import {
  Badge,
  Card,
  Skeleton,
  Stack,
} from "@/components/ui";

import { formatReputationDate } from "@/lib/reputation";
import { cn } from "@/lib/utils";

import type {
  ReputationCardProps,
} from "@/types/reputation.types";

function ReputationCard({
  reputation,
  loading = false,
  className,
}: ReputationCardProps) {
  if (loading) {
    return (
      <Card
        variant="glass"
        className={className}
        aria-busy="true"
        aria-live="polite"
      >
        <Stack gap="md">
          <Skeleton className="h-5 w-32" />

          <Skeleton className="h-12 w-40" />

          <Skeleton className="h-20 w-full" />
        </Stack>
      </Card>
    );
  }

  if (!reputation) {
    return (
      <Card
        variant="glass"
        className={className}
      >
        <Stack
          gap="md"
          className="items-center py-6 text-center"
        >
          <Award
            className="h-10 w-10 text-accent/70"
            aria-hidden="true"
          />

          <Badge variant="muted">
            Reputation
          </Badge>

          <div className="space-y-1">
            <h3 className="font-medium">
              Reputation unavailable
            </h3>

            <p className="text-sm text-muted-foreground">
              Reputation information has not been
              generated yet.
            </p>
          </div>
        </Stack>
      </Card>
    );
  }

  return (
    <Card
      variant="glass"
      className={cn(
        "overflow-hidden",
        className,
      )}
    >
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="accent">
              Reputation
            </Badge>

            <h2 className="mt-3 text-4xl font-bold tracking-tight tabular-nums">
              {reputation.score.toLocaleString()}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Overall reputation score
            </p>
          </div>

          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-accent/10
            "
          >
            <Award
              className="h-7 w-7 text-accent"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-accent" />

              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Created
              </span>
            </div>

            <p className="text-sm font-medium">
              {formatReputationDate(
                reputation.createdAt,
              )}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-accent" />

              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Updated
              </span>
            </div>

            <p className="text-sm font-medium">
              {formatReputationDate(
                reputation.updatedAt,
              )}
            </p>
          </div>
        </div>
      </Stack>
    </Card>
  );
}

export default memo(
  ReputationCard,
);