"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { CircleContext } from "@/context/CircleContext";

import { createCircle as createCircleService }
  from "@/services/circles/createCircle";

import { getCircles }
  from "@/services/circles/getCircles";

import { joinCircle as joinCircleService }
  from "@/services/circles/joinCircle";

import { leaveCircle as leaveCircleService }
  from "@/services/circles/leaveCircle";

import {
  Circle,
  CreateCircleInput,
} from "@/types/circle.types";

interface CircleProviderProps {
  children: React.ReactNode;
}

export default function CircleProvider({
  children,
}: CircleProviderProps) {
  const [circles, setCircles] = useState<
    Circle[]
  >([]);

  const [activeCircle, setActiveCircle] =
    useState<Circle | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const refreshCircles =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCircles();

        setCircles(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load circles."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  const createCircle = useCallback(
    async (
      input: CreateCircleInput,
    ): Promise<Circle> => {
      try {
        setError(null);

        const circle =
          await createCircleService(input);

        setCircles((prev) => [
          circle,
          ...prev,
        ]);

        return circle;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to create circle.";

        setError(message);

        throw err;
      }
    },
    [],
  );

  const joinCircle = useCallback(
    async (
      circleId: string,
      personaId: string,
    ): Promise<void> => {
      try {
        setError(null);

        await joinCircleService(
          circleId,
          personaId,
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to join circle.";

        setError(message);

        throw err;
      }
    },
    [],
  );

  const leaveCircle = useCallback(
    async (
      circleId: string,
      personaId: string,
    ): Promise<void> => {
      try {
        setError(null);

        await leaveCircleService(
          circleId,
          personaId,
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to leave circle.";

        setError(message);

        throw err;
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      circles,

      activeCircle,

      loading,
      error,

      refreshCircles,

      createCircle,

      joinCircle,
      leaveCircle,

      setActiveCircle,
    }),
    [
      circles,
      activeCircle,
      loading,
      error,
      refreshCircles,
      createCircle,
      joinCircle,
      leaveCircle,
    ],
  );

  return (
    <CircleContext.Provider value={value}>
      {children}
    </CircleContext.Provider>
  );
}