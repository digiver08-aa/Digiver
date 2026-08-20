"use client";

import { memo } from "react";
import { Award } from "lucide-react";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { ReputationBadgeProps } from "@/types/reputation.types";

function ReputationBadge({
  reputation,
  className,
}: ReputationBadgeProps) {
  if (!reputation) {
    return (
      <Badge
        variant="muted"
        className={cn(
          "inline-flex items-center gap-2 rounded-full select-none",
          className,
        )}
      >
        <Award className="h-4 w-4" aria-hidden="true" />
        <span>Reputation unavailable</span>
      </Badge>
    );
  }

  return (
    <Badge
      variant="accent"
      className={cn(
        "inline-flex items-center gap-2 rounded-full select-none",
        className,
      )}
      aria-label={`Current reputation score: ${reputation.score.toLocaleString()}`}
    >
      <Award className="h-4 w-4" aria-hidden="true" />
      <span className="tracking-wide uppercase">
        Reputation
      </span>
      <span className="font-semibold tabular-nums">
        {reputation.score.toLocaleString()}
      </span>
    </Badge>
  );
}

export default memo(ReputationBadge);
