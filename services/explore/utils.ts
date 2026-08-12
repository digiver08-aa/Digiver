import {
  DEFAULT_EXPLORE_LIMIT,
  MAX_EXPLORE_LIMIT,
  MAX_EXPLORE_QUERY_LENGTH,
} from "./types";

export interface PaginationState {
  limit: number;
  cursor: string | null;
}

export function getPagination(
  limit = DEFAULT_EXPLORE_LIMIT,
  cursor: string | null = null,
): PaginationState {
  const safeLimit =
    Number.isFinite(limit)
      ? Math.min(
          MAX_EXPLORE_LIMIT,
          Math.max(1, Math.floor(limit)),
        )
      : DEFAULT_EXPLORE_LIMIT;

  return {
    limit: safeLimit,
    cursor: cursor ?? null,
  };
}

export function normalizeSearchQuery(
  query: string,
): string {
  return query
    .normalize("NFKC")
    .trim()
    .slice(0, MAX_EXPLORE_QUERY_LENGTH);
}

function escapeIlikeValue(
  value: string,
): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_");
}

export function createSearchPattern(
  query: string,
): string {
  const normalized =
    normalizeSearchQuery(query);

  if (!normalized) {
    return "";
  }

  return `%${escapeIlikeValue(normalized)}%`;
}

export interface PersonaCursor {
  name: string;
  id: string;
}

export interface TimestampCursor {
  createdAt: string;
  id: string;
}

export interface ExploreFeedCursor {
  personas: PersonaCursor | null;
  circles: TimestampCursor | null;
  posts: TimestampCursor | null;
}

function encodeCursor(
  value: unknown,
): string {
  return Buffer.from(
    JSON.stringify(value),
    "utf8",
  ).toString("base64url");
}

function decodeCursor<T>(
  cursor: string,
): T | null {
  try {
    const decoded =
      Buffer.from(
        cursor,
        "base64url",
      ).toString("utf8");

    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}

export function createPersonaCursor(
  name: string,
  id: string,
): string {
  return encodeCursor({
    name,
    id,
  } satisfies PersonaCursor);
}

export function parsePersonaCursor(
  cursor: string | null,
): PersonaCursor | null {
  if (!cursor) {
    return null;
  }

  const decoded =
    decodeCursor<PersonaCursor>(cursor);

  if (
    !decoded ||
    typeof decoded.name !== "string" ||
    typeof decoded.id !== "string"
  ) {
    return null;
  }

  return decoded;
}

export function createTimestampCursor(
  createdAt: string,
  id: string,
): string {
  return encodeCursor({
    createdAt,
    id,
  } satisfies TimestampCursor);
}

export function parseTimestampCursor(
  cursor: string | null,
): TimestampCursor | null {
  if (!cursor) {
    return null;
  }

  const decoded =
    decodeCursor<TimestampCursor>(cursor);

  if (
    !decoded ||
    typeof decoded.createdAt !== "string" ||
    typeof decoded.id !== "string"
  ) {
    return null;
  }

  return decoded;
}

export function createExploreFeedCursor(
  cursor: ExploreFeedCursor,
): string {
  return encodeCursor(cursor);
}

export function parseExploreFeedCursor(
  cursor: string | null,
): ExploreFeedCursor | null {
  if (!cursor) {
    return null;
  }

  const decoded =
    decodeCursor<ExploreFeedCursor>(cursor);

  if (!decoded) {
    return null;
  }

  return decoded;
}

export function createPaginationResult(
  limit: number,
  nextCursor: string | null,
  hasMore: boolean,
) {
  return {
    limit,
    nextCursor,
    hasMore,
  };
}

export function handleExploreError(
  error: unknown,
  message: string,
): never {
  console.error(
    "Explore service error:",
    error,
  );

  throw new Error(message, {
    cause:
      error instanceof Error
        ? error
        : undefined,
  });
}