"use client";

import { createContext } from "react";

import type { Persona } from "@/types/persona.types";

export interface PersonaContextType {
  persona: Persona | null;
  loading: boolean;
  refreshPersona: () => Promise<void>;
}

export const PersonaContext =
  createContext<PersonaContextType | null>(null);