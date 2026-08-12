import { createClient } from "@/supabase/server";

import type { Circle } from "@/types/circle.types";

import type {
  SearchCirclesResponse,
  SearchOptions,
} from "./types";

import {
  createPaginationResult,
  createSearchPattern,
  createTimestampCursor,
  getPagination,
  handleExploreError,
  parseTimestampCursor,
} from "./utils";

interface CircleRow {
  id: string;
  owner_persona_id: string;

  name: string;
  slug: string;

  description: string | null;
  banner_url: string | null;
  avatar_url: string | null;

  created_at: string;
  updated_at: string;
}

export async function searchCircles({
  query,
  cursor,
  limit,
}: SearchOptions): Promise<SearchCirclesResponse> {
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
      parseTimestampCursor(rawCursor);

    let request = supabase
      .from("circles")
      .select(
        `
          id,
          owner_persona_id,
          name,
          slug,
          description,
          banner_url,
          avatar_url,
          created_at,
          updated_at,
          owner_persona:personas!inner(
            id,
            is_public,
            is_active
          )
        `,
        {
          count: "exact",
        },
      )
      .eq("owner_persona.is_public", true)
      .eq("owner_persona.is_active", true);

    if (search) {
      request = request.or(
        [
          `name.ilike.${search}`,
          `slug.ilike.${search}`,
          `description.ilike.${search}`,
        ].join(","),
      );
    }

    if (parsedCursor) {
      request = request.or(
        [
          `created_at.lt.${parsedCursor.createdAt}`,
          `and(created_at.eq.${parsedCursor.createdAt},id.lt.${parsedCursor.id})`,
        ].join(","),
      );
    }

    const {
      data,
      error,
    } = await request
      .order("created_at", {
        ascending: false,
      })
      .order("id", {
        ascending: false,
      })
      .limit(pageSize + 1);

    if (error) {
      throw error;
    }

    const rows =
      (data ?? []) as unknown as CircleRow[];

    const hasMore =
      rows.length > pageSize;

    const pageRows =
      hasMore
        ? rows.slice(0, pageSize)
        : rows;

    const circles =
      pageRows as Circle[];

    const lastRow =
      pageRows[pageRows.length - 1];

    const nextCursor =
      hasMore && lastRow
        ? createTimestampCursor(
            lastRow.created_at,
            lastRow.id,
          )
        : null;

    return {
      results: circles,
      ...createPaginationResult(
        pageSize,
        nextCursor,
        hasMore,
      ),
    };
  } catch (error) {
    handleExploreError(
      error,
      "Failed to search circles.",
    );
  }
}