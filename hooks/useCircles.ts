"use client";

import { useContext } from "react";

import {
  CircleContext,
  CircleContextValue,
} from "@/context/CircleContext";

export function useCircles(): CircleContextValue {
  const context =
    useContext(CircleContext);

  if (!context) {
    throw new Error(
      "useCircles must be used within CircleProvider.",
    );
  }

  return context;
}