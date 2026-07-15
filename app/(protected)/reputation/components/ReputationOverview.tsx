"use client";

import { memo } from "react";

import { AlertCircle } from "lucide-react";

import {
  Card,
  Stack,
} from "@/components/ui";

import { useReputation } from "@/hooks/useReputation";

import { cn } from "@/lib/utils";

import type {
  ReputationOverviewProps,
} from "@/types/reputation.types";

import ReputationBadge from "./ReputationBadge";
import ReputationCard from "./ReputationCard";
import ReputationHistory from "./ReputationHistory";
import ReputationProgress from "./ReputationProgress";

function ReputationOverview({
  className,
}: ReputationOverviewProps) {
  const {
    reputation,
    history,
    loading,
    error,
  } = useReputation();

  return (
    <section
      aria-labelledby="reputation-overview-heading"
      className={cn("w-full", className)}
    >
      <Stack gap="lg">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              id="reputation-overview-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Reputation
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Monitor your reputation score and activity.
            </p>
          </div>

          <ReputationBadge
            reputation={reputation}
          />
        </header>

        {error && (
          <Card
            variant="glass"
            padding="sm"
            role="alert"
            aria-live="assertive"
            className="border-red-500/30"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-red-400"
                aria-hidden="true"
              />

              <div>
                <h2 className="font-medium text-red-300">
                  Unable to load reputation
                </h2>

                <p className="mt-1 text-sm text-red-200">
                  {error}
                </p>
              </div>
            </div>
          </Card>
        )}

        <ReputationCard
          reputation={reputation}
          loading={loading}
        />

        <ReputationProgress
          reputation={reputation}
        />

        <ReputationHistory
          events={history}
          loading={loading}
        />
      </Stack>
    </section>
  );
}

export default memo(
  ReputationOverview,
);