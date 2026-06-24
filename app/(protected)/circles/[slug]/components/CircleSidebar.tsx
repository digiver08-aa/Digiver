import { Circle } from "@/types/circle.types";

interface Owner {
  id: string;
  name?: string | null;
  slug?: string | null;
  title?: string | null;
}

interface CircleSidebarProps {
  circle: Circle;
  owner: Owner | null;
  memberCount: number;
  isMember: boolean;
}

export default function CircleSidebar({
  circle,
  owner,
  memberCount,
}: CircleSidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="rounded-xl border p-6">
        <h3 className="mb-3 font-semibold">
          About
        </h3>

        <p className="text-sm text-muted-foreground">
          {circle.description ??
            "No description available."}
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <h3 className="mb-3 font-semibold">
          Members
        </h3>

        <div className="text-sm text-muted-foreground">
          {memberCount} members
        </div>

        {owner && (
          <div className="mt-3">
            <div className="font-medium">
              {owner.name}
            </div>

            {owner.title && (
              <div className="text-xs text-muted-foreground">
                {owner.title}
              </div>
            )}

            {owner.slug && (
              <div className="text-xs text-muted-foreground">
                @{owner.slug}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border p-6">
        <h3 className="mb-3 font-semibold">
          Rules
        </h3>

        <ul className="list-disc space-y-1 pl-4 text-sm">
          <li>Respect members.</li>
          <li>Stay on topic.</li>
        </ul>
      </div>
    </aside>
  );
}