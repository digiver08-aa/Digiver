import * as React from "react";

import { cn } from "@/lib/utils";

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "sm" | "md" | "lg";
}

const gaps = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-8",
};

export function Stack({
  children,
  gap = "md",
  className,
  ...props
}: StackProps) {
  return (
    <div
      className={cn(
        "flex flex-col",
        gaps[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}