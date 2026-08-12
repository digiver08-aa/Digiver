// ============================================================
// DIGIVER
// EXPLORE SEARCH API
// ============================================================

import { NextResponse } from "next/server";

import {
  searchCircles,
  searchPersonas,
  searchPosts,
} from "@/services/explore";

import {
  DEFAULT_EXPLORE_LIMIT,
  MAX_EXPLORE_LIMIT,
  MAX_EXPLORE_QUERY_LENGTH,
} from "@/services/explore/types";

import type { ExploreFilters } from "@/context/ExploreContext";

import { createClient } from "@/supabase/server";

// ============================================================
// Unified Cursor
// ============================================================

const EXPLORE_CURSOR_VERSION = 1;

interface ExhaustedCursor {
  status: "exhausted";
}

type ExploreCursorValue =
  | string
  | ExhaustedCursor
  | null;

interface ExploreCursor {
  version: number;
  personas: ExploreCursorValue;
  circles: ExploreCursorValue;
  posts: ExploreCursorValue;
}

const EXHAUSTED_CURSOR: ExhaustedCursor = {
  status: "exhausted",
};

function encodeExploreCursor(
  cursor: ExploreCursor,
): string {
  return Buffer.from(
    JSON.stringify(cursor),
    "utf8",
  ).toString("base64url");
}

function decodeExploreCursor(
  value: string | null,
): ExploreCursor {
  if (!value) {
    return {
      version: EXPLORE_CURSOR_VERSION,
      personas: null,
      circles: null,
      posts: null,
    };
  }

  try {
    const decoded =
      Buffer.from(
        value,
        "base64url",
      ).toString("utf8");

    const parsed =
      JSON.parse(decoded) as Partial<ExploreCursor>;

    if (
      parsed.version !==
      EXPLORE_CURSOR_VERSION
    ) {
      throw new Error(
        "Invalid Explore cursor.",
      );
    }

    return {
      version: EXPLORE_CURSOR_VERSION,
      personas:
        parseCursorValue(
          parsed.personas,
        ),
      circles:
        parseCursorValue(
          parsed.circles,
        ),
      posts:
        parseCursorValue(
          parsed.posts,
        ),
    };
  } catch {
    throw new Error(
      "Invalid Explore cursor.",
    );
  }
}

function parseCursorValue(
  value: unknown,
): ExploreCursorValue {
  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    if (!value) {
      throw new Error(
        "Invalid Explore cursor.",
      );
    }

    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    value.status === "exhausted"
  ) {
    return EXHAUSTED_CURSOR;
  }

  throw new Error(
    "Invalid Explore cursor.",
  );
}

function getServiceCursor(
  value: ExploreCursorValue,
): string | null {
  return typeof value === "string"
    ? value
    : null;
}

function isDatasetExhausted(
  value: ExploreCursorValue,
): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    value.status === "exhausted"
  );
}

function createNextCursorValue(
  nextCursor: string | null,
  hasMore: boolean,
): ExploreCursorValue {
  if (hasMore) {
    return nextCursor;
  }

  return EXHAUSTED_CURSOR;
}

// ============================================================
// Query Parsing
// ============================================================

function parseBoolean(
  value: string | null,
  fallback: boolean,
): boolean {
  if (value === null) {
    return fallback;
  }

  return value === "true";
}

function parsePositiveInteger(
  value: string | null,
  fallback: number,
  maximum: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsed =
    Number.parseInt(value, 10);

  if (
    !Number.isFinite(parsed) ||
    parsed < 1
  ) {
    return fallback;
  }

  return Math.min(
    parsed,
    maximum,
  );
}

// ============================================================
// GET /api/explore/search
// ============================================================

export async function GET(
  request: Request,
) {
  try {
    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    const url =
      new URL(request.url);

    const query =
      (
        url.searchParams.get(
          "query",
        ) ?? ""
      )
        .normalize("NFKC")
        .trim()
        .slice(
          0,
          MAX_EXPLORE_QUERY_LENGTH,
        );

    const cursor =
      decodeExploreCursor(
        url.searchParams.get(
          "cursor",
        ),
      );

    const limit =
      parsePositiveInteger(
        url.searchParams.get(
          "limit",
        ),
        DEFAULT_EXPLORE_LIMIT,
        MAX_EXPLORE_LIMIT,
      );

    const filters: ExploreFilters =
      {
        personas:
          parseBoolean(
            url.searchParams.get(
              "personas",
            ),
            true,
          ),

        circles:
          parseBoolean(
            url.searchParams.get(
              "circles",
            ),
            true,
          ),

        posts:
          parseBoolean(
            url.searchParams.get(
              "posts",
            ),
            true,
          ),
      };

    // ========================================================
    // Execute Searches
    // ========================================================

    /*
     * An exhausted dataset must NOT be queried again.
     *
     * null means "not started / no cursor yet".
     * { status: "exhausted" } means "this dataset is finished".
     *
     * This distinction prevents an exhausted dataset from
     * restarting at page one while another dataset still has
     * more results.
     */

    const [
      personasResponse,
      circlesResponse,
      postsResponse,
    ] = await Promise.all([
      filters.personas &&
      !isDatasetExhausted(
        cursor.personas,
      )
        ? searchPersonas({
            query,
            cursor:
              getServiceCursor(
                cursor.personas,
              ),
            limit,
          })
        : Promise.resolve(null),

      filters.circles &&
      !isDatasetExhausted(
        cursor.circles,
      )
        ? searchCircles({
            query,
            cursor:
              getServiceCursor(
                cursor.circles,
              ),
            limit,
          })
        : Promise.resolve(null),

      filters.posts &&
      !isDatasetExhausted(
        cursor.posts,
      )
        ? searchPosts({
            query,
            cursor:
              getServiceCursor(
                cursor.posts,
              ),
            limit,
          })
        : Promise.resolve(null),
    ]);

    // ========================================================
    // Determine Pagination State
    // ========================================================

    const personasHasMore =
      Boolean(
        personasResponse?.hasMore,
      );

    const circlesHasMore =
      Boolean(
        circlesResponse?.hasMore,
      );

    const postsHasMore =
      Boolean(
        postsResponse?.hasMore,
      );

    const hasMore =
      personasHasMore ||
      circlesHasMore ||
      postsHasMore;

    /**
     * Preserve independent pagination state for every
     * enabled dataset.
     *
     * A dataset that still has results receives its real
     * service cursor.
     *
     * A dataset that is exhausted receives an explicit
     * exhausted marker instead of null.
     *
     * Disabled datasets remain null.
     */
    const nextCursor =
      hasMore
        ? encodeExploreCursor({
            version:
              EXPLORE_CURSOR_VERSION,

            personas:
              filters.personas
                ? createNextCursorValue(
                    personasResponse
                      ?.nextCursor ?? null,
                    personasHasMore,
                  )
                : null,

            circles:
              filters.circles
                ? createNextCursorValue(
                    circlesResponse
                      ?.nextCursor ?? null,
                    circlesHasMore,
                  )
                : null,

            posts:
              filters.posts
                ? createNextCursorValue(
                    postsResponse
                      ?.nextCursor ?? null,
                    postsHasMore,
                  )
                : null,
          })
        : null;

    // ========================================================
    // Response
    // ========================================================

    return NextResponse.json(
      {
        personas:
          personasResponse?.results ??
          [],

        circles:
          circlesResponse?.results ??
          [],

        posts:
          postsResponse?.results ??
          [],

        limit,
        nextCursor,
        hasMore,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "private, no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "Explore search API error:",
      error,
    );

    if (
      error instanceof Error &&
      error.message ===
        "Invalid Explore cursor."
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid Explore cursor.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to search Explore.",
      },
      {
        status: 500,
      },
    );
  }
}