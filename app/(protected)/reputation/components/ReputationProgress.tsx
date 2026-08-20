"use client";

import { memo } from "react";
import { TrendingUp } from "lucide-react";

import {
  Badge,
  Card,
  Stack,
} from "@/components/ui";
import { MAX_REPUTATION_SCORE } from "@/constants/reputation";
import { getReputationProgress } from "@/lib/reputation";
import { cn } from "@/lib/utils";
import type { ReputationProgressProps } from "@/types/reputation.types";

function ReputationProgress({
  reputation,
  className,
}: ReputationProgressProps) {
  if (!reputation) {
    return (
      <Card
        variant="glass"
        className={cn(className)}
      >
        <Stack
          gap="md"
          className="items-center py-6 text-center"
        >
          <TrendingUp
            className="h-9 w-9 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 className="font-medium">
            Progress unavailable
          </h2>
          <p className="text-sm text-muted-foreground">
            Progress will be shown when a reputation score is available.
          </p>
        </Stack>
      </Card>
    );
  }

  const score = Math.max(0, reputation.score);
  const percentage = getReputationProgress(score);
  const ariaValue = Math.min(score, MAX_REPUTATION_SCORE);

  return (
    <Card
      variant="glass"
      className={cn(className)}
    >
      <Stack gap="lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="accent">Progress</Badge>
            <h2 className="mt-3 text-xl font-semibold">
              Reputation Growth
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current progress toward the reputation milestone.
            </p>
          </div>

          <TrendingUp
            className="h-6 w-6 shrink-0 text-accent"
            aria-hidden="true"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">
              Progress
            </span>
            <span className="font-semibold tabular-nums">
              {score.toLocaleString()} /{" "}
              {MAX_REPUTATION_SCORE.toLocaleString()}
            </span>
          </div>

          <div
            className="h-3 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="Reputation progress"
            aria-valuemin={0}
            aria-valuemax={MAX_REPUTATION_SCORE}
            aria-valuenow={ariaValue}
            aria-valuetext={`${Math.round(percentage)}% complete`}
          >
            <div
              className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0</span>
            <span>{Math.round(percentage)}%</span>
            <span>{MAX_REPUTATION_SCORE.toLocaleString()}</span>
          </div>
        </div>
      </Stack>
    </Card>
  );
}

export default memo(ReputationProgress);
