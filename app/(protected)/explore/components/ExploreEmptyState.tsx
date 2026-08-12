"use client";

// ============================================================
// DIGIVER
// ExploreEmptyState
// ============================================================

import { SearchX } from "lucide-react";

import { useExplore } from "@/hooks/useExplore";

export interface ExploreEmptyStateProps {
  className?: string;
}

export function ExploreEmptyState({
  className,
}: ExploreEmptyStateProps) {
  const {
    query,
    activeTab,
  } = useExplore();

  const hasQuery =
    query.trim().length > 0;

  const label =
    activeTab === "all"
      ? "results"
      : activeTab;

  return (
    <section
      aria-live="polite"
      className={[
        `
        flex
        min-h-60
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-border
        bg-card
        px-6
        py-12
        text-center
        `,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted"
        aria-hidden="true"
      >
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>

      <h2 className="text-base font-semibold">
        {hasQuery
          ? "No results found"
          : "Nothing to explore yet"}
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {hasQuery
          ? `We couldn't find any ${label} matching "${query.trim()}". Try a different search term.`
          : "Search for personas, circles, or posts to discover something new."}
      </p>
    </section>
  );
}