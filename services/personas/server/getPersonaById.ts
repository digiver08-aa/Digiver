import { createClient } from "@/supabase/server";

import { mapPersona } from "../mappers";

import type {
  PersonaResponse,
} from "@/types/persona.types";

export async function getPersonaById(
  personaId: string
): Promise<PersonaResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("personas")
    .select("*")
    .eq("id", personaId)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: "Persona not found.",
      data: null,
    };
  }

  return {
    success: true,
    message: "Persona retrieved successfully.",
    data: mapPersona(data),
  };
}