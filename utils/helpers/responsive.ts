import { BREAKPOINTS, Breakpoint } from "./breakpoints";

export function isBreakpoint(
  width: number,
  breakpoint: Breakpoint
): boolean {
  return width >= BREAKPOINTS[breakpoint];
}

export function getBreakpoint(width: number): Breakpoint | "base" {
  if (width >= BREAKPOINTS["2xl"]) return "2xl";
  if (width >= BREAKPOINTS.xl) return "xl";
  if (width >= BREAKPOINTS.lg) return "lg";
  if (width >= BREAKPOINTS.md) return "md";
  if (width >= BREAKPOINTS.sm) return "sm";

  return "base";
}