"use client";

import {
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import { ReputationContext } from "@/context/ReputationContext";

import type {
  Reputation,
  ReputationContextValue,
  ReputationEvent,
} from "@/types/reputation.types";

interface ReputationProviderProps {
  children: ReactNode;
  initialReputation?: Reputation | null;
  initialHistory?: ReputationEvent[];
  initialError?: string | null;
}

export function ReputationProvider({
  children,
  initialReputation = null,
  initialHistory = [],
  initialError = null,
}: ReputationProviderProps) {
  const reputation = initialReputation;
  const history = initialHistory;
  const loading = false;
  const error = initialError;

  const refresh = useCallback(async (): Promise<void> => {
    // Reputation mechanics remain server-owned by the existing Phase 9 contract.
  }, []);

  const value = useMemo<ReputationContextValue>(
    () => ({
      reputation,
      history,
      loading,
      error,
      refresh,
    }),
    [
      reputation,
      history,
      loading,
      error,
      refresh,
    ],
  );

  return (
    <ReputationContext.Provider value={value}>
      {children}
    </ReputationContext.Provider>
  );
}
