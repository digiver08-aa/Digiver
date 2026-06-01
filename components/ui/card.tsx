import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  [
    "rounded-2xl",
    "border",
    "transition-all duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-white/10 bg-muted/40",

        glass:
          "border-white/10 bg-white/5 backdrop-blur-md",

        elevated:
          "border-white/10 bg-muted shadow-atmospheric",

        interactive:
          [
            "border-white/10",
            "bg-muted/40",
            "cursor-pointer",
            "hover:border-white/20",
            "hover:-translate-y-0.5",
          ].join(" "),
      },

      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },

    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({
  className,
  variant,
  padding,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        cardVariants({
          variant,
          padding,
        }),
        className
      )}
      {...props}
    />
  );
}