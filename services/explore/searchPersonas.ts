import { createClient } from "@/supabase/server";

import { mapPersona } from "@/services/personas/mappers";

import type { Persona } from "@/types/persona.types";

import type {
  SearchOptions,
  SearchPersonasResponse,
} from "./types";

import {
  createPaginationResult,
  createPersonaCursor,
  createSearchPattern,
  getPagination,
  handleExploreError,
  parsePersonaCursor,
} from "./utils";

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

export async function searchPersonas({
  query,
  cursor,
  limit,
}: SearchOptions): Promise<SearchPersonasResponse> {
  try {
    const supabase =
      await createClient();

    const {
      limit: pageSize,
      cursor: rawCursor,
    } = getPagination(
      limit,
      cursor,
    );

    const search =
      createSearchPattern(query);

    const parsedCursor =
      parsePersonaCursor(rawCursor);

    let request = supabase
      .from("personas")
      .select(
        `
          id,
          user_id,
          name,
          slug,
          title,
          bio,
          avatar_url,
          banner_url,
          is_active,
          is_public,
          created_at,
          updated_at
        `,
        {
          count: "exact",
        },
      )
      .eq("is_public", true)
      .eq("is_active", true);

    if (search) {
      request = request.or(
        [
          `name.ilike.${search}`,
          `slug.ilike.${search}`,
          `title.ilike.${search}`,
        ].join(","),
      );
    }

    if (parsedCursor) {
      request = request.or(
        [
          `name.gt.${parsedCursor.name}`,
          `and(name.eq.${parsedCursor.name},id.gt.${parsedCursor.id})`,
        ].join(","),
      );
    }

    const {
      data,
      error,
    } = await request
      .order("name", {
        ascending: true,
      })
      .order("id", {
        ascending: true,
      })
      .limit(pageSize + 1);

    if (error) {
      throw error;
    }

    const rows =
      (data ?? []) as unknown as PersonaRow[];

    const hasMore =
      rows.length > pageSize;

    const pageRows =
      hasMore
        ? rows.slice(0, pageSize)
        : rows;

    const personas: Persona[] =
      pageRows.map((row) =>
        mapPersona(row),
      );

    const lastRow =
      pageRows[pageRows.length - 1];

    const nextCursor =
      hasMore && lastRow
        ? createPersonaCursor(
            lastRow.name,
            lastRow.id,
          )
        : null;

    return {
      results: personas,
      ...createPaginationResult(
        pageSize,
        nextCursor,
        hasMore,
      ),
    };
  } catch (error) {
    handleExploreError(
      error,
      "Failed to search personas.",
    );
  }
}