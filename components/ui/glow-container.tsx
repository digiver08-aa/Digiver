import * as React from "react";

import { cn } from "@/lib/utils";

export interface GlowContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "accent" | "blue" | "purple" | "gold";
  intensity?: "low" | "medium" | "high";
}

const glowMap = {
  accent: "bg-accent/20",
  blue: "bg-blue-500/20",
  purple: "bg-purple-500/20",
  gold: "bg-yellow-500/20",
};

const intensityMap = {
  low: "blur-2xl opacity-40",
  medium: "blur-3xl opacity-60",
  high: "blur-[120px] opacity-80",
};

export function GlowContainer({
  children,
  className,
  glow = "accent",
  intensity = "medium",
  ...props
}: GlowContainerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-0",
          glowMap[glow],
          intensityMap[intensity]
        )}
      />

      <div className="relative">
        {children}
      </div>
    </div>
  );
}