import * as React from "react";

import { cn } from "@/lib/utils";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  circle?: boolean;
}

export function Skeleton({
  className,
  circle = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/10",
        circle ? "rounded-full" : "rounded-xl",
        className
      )}
      {...props}
    />
  );
}