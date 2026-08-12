"use client";

// ============================================================
// DIGIVER
// ExploreFilters
// ============================================================

import { useCallback } from "react";

import { Check } from "lucide-react";

import { useExplore } from "@/hooks/useExplore";

export interface ExploreFiltersProps {
  className?: string;
}

interface FilterItem {
  key: "personas" | "circles" | "posts";
  label: string;
}

const FILTERS: readonly FilterItem[] = [
  {
    key: "personas",
    label: "Personas",
  },
  {
    key: "circles",
    label: "Circles",
  },
  {
    key: "posts",
    label: "Posts",
  },
] as const;

export function ExploreFilters({
  className,
}: ExploreFiltersProps) {
  const {
    filters,
    loading,
    changeFilter,
  } = useExplore();

  const handleToggle = useCallback(
    (filter: FilterItem["key"]) => {
      void changeFilter(
        filter,
        !filters[filter],
      );
    },
    [changeFilter, filters],
  );

  return (
    <section
      aria-labelledby="explore-filters-heading"
      className={className}
    >
      <h2
        id="explore-filters-heading"
        className="sr-only"
      >
        Explore filters
      </h2>

      <div className="flex flex-wrap gap-3">
        {FILTERS.map(
          ({
            key,
            label,
          }) => {
            const enabled =
              filters[key];

            return (
              <button
                key={key}
                type="button"
                disabled={loading}
                aria-pressed={enabled}
                onClick={() =>
                  handleToggle(key)
                }
                className={[
                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60",
                  enabled
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-4 w-4 items-center justify-center rounded-sm border",
                    enabled
                      ? "border-primary-foreground"
                      : "border-muted-foreground",
                  ].join(" ")}
                >
                  {enabled && (
                    <Check
                      className="h-3 w-3"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span>{label}</span>
              </button>
            );
          },
        )}
      </div>
    </section>
  );
}