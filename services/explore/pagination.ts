// ============================================================
// DIGIVER
// EXPLORE CURSOR PAGINATION
// ============================================================

const CURSOR_VERSION = 1;

interface CursorPayload {
  v: number;
  value: string;
  id: string;
}

function encodeCursor(
  payload: CursorPayload,
): string {
  return Buffer.from(
    JSON.stringify(payload),
    "utf8",
  ).toString("base64url");
}

function decodeCursor(
  cursor: string,
): CursorPayload | null {
  try {
    const decoded =
      Buffer.from(
        cursor,
        "base64url",
      ).toString("utf8");

    const payload =
      JSON.parse(decoded) as Partial<CursorPayload>;

    if (
      payload.v !== CURSOR_VERSION ||
      typeof payload.value !== "string" ||
      typeof payload.id !== "string" ||
      !payload.value ||
      !payload.id
    ) {
      return null;
    }

    return {
      v: CURSOR_VERSION,
      value: payload.value,
      id: payload.id,
    };
  } catch {
    return null;
  }
}

export function createCursor(
  value: string,
  id: string,
): string {
  return encodeCursor({
    v: CURSOR_VERSION,
    value,
    id,
  });
}

export function parseCursor(
  cursor?: string | null,
): {
  value: string;
  id: string;
} | null {
  if (!cursor) {
    return null;
  }

  const payload =
    decodeCursor(cursor);

  if (!payload) {
    return null;
  }

  return {
    value: payload.value,
    id: payload.id,
  };
}

export function createPersonaCursor(
  name: string,
  id: string,
): string {
  return createCursor(name, id);
}

export function createCircleCursor(
  createdAt: string,
  id: string,
): string {
  return createCursor(
    createdAt,
    id,
  );
}

export function createPostCursor(
  createdAt: string,
  id: string,
): string {
  return createCursor(
    createdAt,
    id,
  );
}