"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-xl font-medium",
    "transition-all duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-accent",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-background hover:brightness-110",

        secondary:
          "bg-muted text-foreground hover:bg-muted/80",

        ghost:
          "text-foreground hover:bg-white/5",
      },

      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-5",
        lg: "h-12 px-7",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type MotionButtonProps =
  React.ComponentPropsWithoutRef<typeof motion.button>;

export interface ButtonProps
  extends MotionButtonProps,
    VariantProps<typeof buttonVariants> {}

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        buttonVariants({ variant, size }),
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}