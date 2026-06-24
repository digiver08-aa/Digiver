import { createClient } from "@/supabase/server";

interface CircleFeedProps {
  circleId: string;
}

export default async function CircleFeed({
  circleId,
}: CircleFeedProps) {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id,
      content,
      created_at
    `,
    )
    .eq("circle_id", circleId)
    .order("created_at", {
      ascending: false,
    });

  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Feed
      </h2>

      <div className="space-y-4">
        {(posts ?? []).length === 0 && (
          <div className="rounded-lg border p-4 text-sm text-muted-foreground">
            No posts yet.
          </div>
        )}

        {(posts ?? []).map((post) => (
          <article
            key={post.id}
            className="rounded-lg border p-4"
          >
            <p className="whitespace-pre-wrap text-sm">
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