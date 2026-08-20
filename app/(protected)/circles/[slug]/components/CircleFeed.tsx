export default async function CircleFeed() {
  // The current MVP posts schema has no circle_id field.
  // Do not invent a circle-post relationship during a UX-only polish pass.
  const posts: { id: string; content: string; created_at: string }[] = [];
  const error: Error | null = null;

  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Feed
      </h2>

      <div className="space-y-4">
        {error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
            Unable to load this circle feed right now. Please try again.
          </div>
        ) : (posts ?? []).length === 0 ? (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            Circle-specific posts are not available in the current MVP data model.
          </div>
        ) : null}

        {(posts ?? []).map((post) => (
          <article
            key={post.id}
            className="rounded-lg border p-4"
          >
            <p className="wrap-break-word whitespace-pre-wrap text-sm">
              {post.content}
            </p>

            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(
                post.created_at,
              ).toLocaleString()}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}