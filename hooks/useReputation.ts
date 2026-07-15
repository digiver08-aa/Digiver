"use client";

import { useContext } from "react";

import { ReputationContext } from "@/context/ReputationContext";

import type {
  ReputationContextValue,
} from "@/types/reputation.types";

export function useReputation(): ReputationContextValue {
  const context = useContext(
    ReputationContext,
  );

  if (!context) {
    throw new Error(
      "useReputation must be used within a ReputationProvider.",
    );
  }

  return context;
}