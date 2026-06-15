"use client";

import { useContext } from "react";

import {
  PersonaContext,
  type PersonaContextType,
} from "@/context/PersonaContext";

export function usePersona(): PersonaContextType {
  const context =
    useContext(PersonaContext);

  if (!context) {
    throw new Error(
      "usePersona must be used within PersonaProvider"
    );
  }

  return context;
}