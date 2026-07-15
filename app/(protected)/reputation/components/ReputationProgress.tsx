"use client";

import { memo } from "react";

import { TrendingUp } from "lucide-react";

import {
  Badge,
  Card,
  Stack,
} from "@/components/ui";

import {
  MAX_REPUTATION_SCORE,
} from "@/constants/reputation";

import {
  getReputationProgress,
} from "@/lib/reputation";

import { cn } from "@/lib/utils";

import type {
  ReputationProgressProps,
} from "@/types/reputation.types";

function ReputationProgress({
  reputation,
  className,
}: ReputationProgressProps) {
  const score = reputation?.score ?? 0;

  const percentage =
    getReputationProgress(score);

  return (
    <Card
      variant="glass"
      className={cn(className)}
    >
      <Stack gap="lg">
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="accent">
              Progress
            </Badge>

            <h2 className="mt-3 text-xl font-semibold">
              Reputation Growth
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Current progress toward the
              next reputation milestone.
            </p>
          </div>

          <TrendingUp
            className="h-6 w-6 text-accent"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progress
            </span>

            <span className="font-semibold tabular-nums">
              {score.toLocaleString()} /{" "}
              {MAX_REPUTATION_SCORE.toLocaleString()}
            </span>
          </div>

          <div
            className="
              h-3
              w-full
              overflow-hidden
              rounded-full
              bg-white/10
            "
            role="progressbar"
            aria-label="Reputation progress"
            aria-valuemin={0}
            aria-valuemax={
              MAX_REPUTATION_SCORE
            }
            aria-valuenow={score}
            aria-valuetext={`${Math.round(
              percentage,
            )}% complete`}
          >
            <div
              className="
                h-full
                rounded-full
                bg-accent
                transition-all
                duration-500
                ease-out
              "
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0</span>

            <span>
              {Math.round(
                percentage,
              )}
              %
            </span>

            <span>
              {MAX_REPUTATION_SCORE.toLocaleString()}
            </span>
          </div>
        </div>
      </Stack>
    </Card>
  );
}

export default memo(
  ReputationProgress,
);