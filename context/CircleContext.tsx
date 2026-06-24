"use client";

import { createContext } from "react";

import {
  Circle,
  CreateCircleInput,
} from "@/types/circle.types";

export interface CircleContextValue {
  circles: Circle[];

  activeCircle: Circle | null;

  loading: boolean;
  error: string | null;

  refreshCircles: () => Promise<void>;

  createCircle: (
    input: CreateCircleInput,
  ) => Promise<Circle>;

  joinCircle: (
    circleId: string,
    personaId: string,
  ) => Promise<void>;

  leaveCircle: (
    circleId: string,
    personaId: string,
  ) => Promise<void>;

  setActiveCircle: (
    circle: Circle | null,
  ) => void;
}

export const CircleContext =
  createContext<CircleContextValue | null>(
    null,
  );