"use client";

import { Compass, Search } from "lucide-react";

import { ExploreProvider } from "@/providers/ExploreProvider";
import { useExplore } from "@/hooks/useExplore";

import { ExploreSearchBar } from "./components/ExploreSearchBar";
import { ExploreTabs } from "./components/ExploreTabs";
import { ExploreFilters } from "./components/ExploreFilters";
import { ExplorePersonaCard } from "./components/ExplorePersonaCard";
import { ExploreCircleCard } from "./components/ExploreCircleCard";
import { ExplorePostCard } from "./components/ExplorePostCard";
import { ExploreEmptyState } from "./components/ExploreEmptyState";
import { LoadingSkeleton } from "./components/LoadingSkeleton";

function ExplorePageContent() {
  const {
    activeTab,
    results,
    loading,
    error,
    pagination,
    loadNextPage,
  } = useExplore();

  const visiblePersonas =
    activeTab === "all" ||
    activeTab === "personas"
      ? results.personas
      : [];

  const visibleCircles =
    activeTab === "all" ||
    activeTab === "circles"
      ? results.circles
      : [];

  const visiblePosts =
    activeTab === "all" ||
    activeTab === "posts"
      ? results.posts
      : [];

  const hasResults =
    visiblePersonas.length > 0 ||
    visibleCircles.length > 0 ||
    visiblePosts.length > 0;

  const showEmptyState =
    !loading &&
    !error &&
    !hasResults;

  const handleLoadNextPage = () => {
    if (
      loading ||
      !pagination.hasMore
    ) {
      return;
    }

    void loadNextPage();
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <header className="space-y-5">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-card"
              aria-hidden="true"
            >
              <Compass
                className="h-6 w-6 text-primary"
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Explore
              </h1>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Discover personas, circles, and posts across Digiver.
              </p>
            </div>
          </div>

          {/* Automatic focus intentionally retained. */}
          <ExploreSearchBar autoFocus />

          <div className="flex flex-col gap-4">
            <ExploreTabs />
            <ExploreFilters />
          </div>
        </header>

        {error ? (
          <section
            role="alert"
            aria-live="assertive"
            className="rounded-2xl border border-destructive/30 bg-destructive/5 px-5 py-4"
          >
            <div className="flex items-start gap-3">
              <Search
                className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
                aria-hidden="true"
              />

              <div>
                <h2 className="text-sm font-semibold text-destructive">
                  Unable to load Explore results
                </h2>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {error}
                </p>
              </div>
            </div>
          </section>
        ) : loading && !hasResults ? (
          <LoadingSkeleton />
        ) : showEmptyState ? (
          <ExploreEmptyState />
        ) : (
          <div
            className="space-y-10"
            aria-live="polite"
            aria-busy={loading}
          >
            {(activeTab === "all" ||
              activeTab === "personas") &&
              visiblePersonas.length > 0 && (
                <section
                  aria-labelledby="explore-personas-heading"
                  className="space-y-4"
                >
                  <div>
                    <h2
                      id="explore-personas-heading"
                      className="text-lg font-semibold"
                    >
                      Personas
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Discover identities across Digiver.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visiblePersonas.map(
                      (persona) => (
                        <ExplorePersonaCard
                          key={persona.id}
                          persona={persona}
                        />
                      ),
                    )}
                  </div>
                </section>
              )}

            {(activeTab === "all" ||
              activeTab === "circles") &&
              visibleCircles.length > 0 && (
                <section
                  aria-labelledby="explore-circles-heading"
                  className="space-y-4"
                >
                  <div>
                    <h2
                      id="explore-circles-heading"
                      className="text-lg font-semibold"
                    >
                      Circles
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Find communities and societies to enter.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleCircles.map(
                      (circle) => (
                        <ExploreCircleCard
                          key={circle.id}
                          circle={circle}
                        />
                      ),
                    )}
                  </div>
                </section>
              )}

            {(activeTab === "all" ||
              activeTab === "posts") &&
              visiblePosts.length > 0 && (
                <section
                  aria-labelledby="explore-posts-heading"
                  className="space-y-4"
                >
                  <div>
                    <h2
                      id="explore-posts-heading"
                      className="text-lg font-semibold"
                    >
                      Posts
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Discover conversations and ideas.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {visiblePosts.map(
                      (post) => (
                        <ExplorePostCard
                          key={post.id}
                          post={post}
                        />
                      ),
                    )}
                  </div>
                </section>
              )}

            {pagination.hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleLoadNextPage}
                  disabled={loading}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Loading..."
                    : "Load more"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export function ExplorePageClient() {
  return (
    <ExploreProvider>
      <ExplorePageContent />
    </ExploreProvider>
  );
}