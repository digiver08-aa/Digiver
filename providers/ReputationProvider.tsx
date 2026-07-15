"use client";

import {
  useCallback,
  useMemo,
  useState,
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
}

export function ReputationProvider({
  children,
  initialReputation = null,
  initialHistory = [],
}: ReputationProviderProps) {
  const [reputation, setReputation] =
    useState<Reputation | null>(
      initialReputation,
    );

  const [history, setHistory] =
    useState<ReputationEvent[]>(
      initialHistory,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(
    async (
    ): Promise<void> => {
      /**
       * Reserved for future implementations.
       *
       * Reputation refresh will eventually:
       * - retrieve the latest reputation
       * - retrieve the latest event history
       * - update shared state
       *
       * The provider already exposes the
       * complete state API, so consumers
       * will not need to change when this
       * functionality is implemented.
       */

      setLoading(true);
      setError(null);

      try {
        setReputation((current) => current);
        setHistory((current) => current);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to refresh reputation.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value =
    useMemo<ReputationContextValue>(
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
    <ReputationContext.Provider
      value={value}
    >
      {children}
    </ReputationContext.Provider>
  );
}