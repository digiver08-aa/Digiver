"use client";

// ============================================================
// DIGIVER
// ExploreResults
// ============================================================

import { useMemo } from "react";

import { useExplore } from "@/hooks/useExplore";

import { ExploreCircleCard } from "./ExploreCircleCard";
import { ExploreEmptyState } from "./ExploreEmptyState";
import { ExplorePersonaCard } from "./ExplorePersonaCard";
import { ExplorePostCard } from "./ExplorePostCard";
import { LoadingSkeleton } from "./LoadingSkeleton";

export interface ExploreResultsProps {
  className?: string;
}

export function ExploreResults({
  className,
}: ExploreResultsProps) {
  const {
    activeTab,
    results,
    loading,
  } = useExplore();

  const visibleResults =
    useMemo(() => {
      switch (activeTab) {
        case "personas":
          return (
            results.personas
              .length > 0
          );

        case "circles":
          return (
            results.circles
              .length > 0
          );

        case "posts":
          return (
            results.posts
              .length > 0
          );

        default:
          return (
            results.personas
              .length > 0 ||
            results.circles
              .length > 0 ||
            results.posts
              .length > 0
          );
      }
    }, [
      activeTab,
      results,
    ]);

  if (loading) {
    return (
      <LoadingSkeleton />
    );
  }

  if (!visibleResults) {
    return (
      <ExploreEmptyState />
    );
  }

  return (
    <section
      aria-live="polite"
      className={[
        "space-y-8",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(activeTab ===
        "all" ||
        activeTab ===
          "personas") &&
        results.personas
          .length > 0 && (
          <section
            id="explore-panel-personas"
            role="tabpanel"
            aria-labelledby="explore-tab-personas"
            className="space-y-4"
          >
            {activeTab ===
              "all" && (
              <h2 className="text-lg font-semibold">
                Personas
              </h2>
            )}

            <div
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {results.personas.map(
                (
                  persona,
                ) => (
                  <ExplorePersonaCard
                    key={
                      persona.id
                    }
                    persona={
                      persona
                    }
                  />
                ),
              )}
            </div>
          </section>
        )}

      {(activeTab ===
        "all" ||
        activeTab ===
          "circles") &&
        results.circles
          .length > 0 && (
          <section
            id="explore-panel-circles"
            role="tabpanel"
            aria-labelledby="explore-tab-circles"
            className="space-y-4"
          >
            {activeTab ===
              "all" && (
              <h2 className="text-lg font-semibold">
                Circles
              </h2>
            )}

            <div
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            >
              {results.circles.map(
                (
                  circle,
                ) => (
                  <ExploreCircleCard
                    key={
                      circle.id
                    }
                    circle={
                      circle
                    }
                  />
                ),
              )}
            </div>
          </section>
        )}

      {(activeTab ===
        "all" ||
        activeTab ===
          "posts") &&
        results.posts
          .length > 0 && (
          <section
            id="explore-panel-posts"
            role="tabpanel"
            aria-labelledby="explore-tab-posts"
            className="space-y-4"
          >
            {activeTab ===
              "all" && (
              <h2 className="text-lg font-semibold">
                Posts
              </h2>
            )}

            <div className="space-y-4">
              {results.posts.map(
                (
                  post,
                ) => (
                  <ExplorePostCard
                    key={
                      post.id
                    }
                    post={post}
                  />
                ),
              )}
            </div>
          </section>
        )}
    </section>
  );
}