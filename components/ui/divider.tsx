import * as React from "react";

import { cn } from "@/lib/utils";

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full"
          : "h-full w-px",
        "bg-white/10",
        className
      )}
      {...props}
    />
  );
}