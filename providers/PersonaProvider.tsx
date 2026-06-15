"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { PersonaContext } from "@/context/PersonaContext";

import { createClient } from "@/supabase/client";

import type { Persona } from "@/types/persona.types";

interface PersonaProviderProps {
  children: React.ReactNode;
}

interface PersonaRow {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  is_active: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

function mapPersona(data: PersonaRow): Persona {
  return {
    id: data.id,
    userId: data.user_id,
    name: data.name,
    slug: data.slug,
    title: data.title,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    bannerUrl: data.banner_url,
    isActive: data.is_active,
    isPublic: data.is_public,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function PersonaProvider({
  children,
}: PersonaProviderProps) {
  const [persona, setPersona] =
    useState<Persona | null>(null);

  const [loading, setLoading] =
    useState(true);

  const mountedRef = useRef(true);

  const loadPersona = useCallback(
    async (
      updateLoading: boolean = true
    ) => {
      try {
        if (updateLoading) {
          setLoading(true);
        }

        const supabase = createClient();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!mountedRef.current) {
          return;
        }

        if (authError || !user) {
          setPersona(null);
          return;
        }

        const { data, error } =
          await supabase
            .from("personas")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        if (!mountedRef.current) {
          return;
        }

        if (error || !data) {
          setPersona(null);
          return;
        }

        setPersona(
          mapPersona(data as PersonaRow)
        );
      } catch (error) {
        console.error(
          "Failed to load persona",
          error
        );

        if (!mountedRef.current) {
          return;
        }

        setPersona(null);
      } finally {
        if (
          mountedRef.current &&
          updateLoading
        ) {
          setLoading(false);
        }
      }
    },
    []
  );

  const refreshPersona = useCallback(
    async () => {
      await loadPersona(true);
    },
    [loadPersona]
  );

  useEffect(() => {
    mountedRef.current = true;

    Promise.resolve().then(() => {
      void loadPersona(true);
    });

    return () => {
      mountedRef.current = false;
    };
  }, [loadPersona]);

  const value = useMemo(
    () => ({
      persona,
      loading,
      refreshPersona,
    }),
    [persona, loading, refreshPersona]
  );

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
}