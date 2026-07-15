"use client";

import { createContext } from "react";

import type {
  ReputationContextValue,
} from "@/types/reputation.types";

export const ReputationContext =
  createContext<
    ReputationContextValue | undefined
  >(undefined);

ReputationContext.displayName =
  "ReputationContext";