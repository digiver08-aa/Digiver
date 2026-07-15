"use client";

import { memo } from "react";

import { Award } from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

import type {
  ReputationBadgeProps,
} from "@/types/reputation.types";

function ReputationBadge({
  reputation,
  className,
}: ReputationBadgeProps) {
  const score = reputation?.score ?? 0;

  return (
    <Badge
      variant="accent"
      className={cn(
        "inline-flex items-center gap-2",
        "rounded-full",
        "select-none",
        className,
      )}
      aria-label={`Current reputation score: ${score}`}
    >
      <Award
        className="h-4 w-4"
        aria-hidden="true"
      />

      <span className="tracking-wide uppercase">
        Reputation
      </span>

      <span className="font-semibold tabular-nums">
        {score.toLocaleString()}
      </span>
    </Badge>
  );
}

export default memo(ReputationBadge);