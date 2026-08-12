"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Circle } from "@/types/circle.types";
import type { Post } from "@/types/feed.types";
import type { Persona } from "@/types/persona.types";

import {
  DEFAULT_EXPLORE_FILTERS,
  DEFAULT_EXPLORE_PAGINATION,
  DEFAULT_EXPLORE_RESULTS,
  DEFAULT_EXPLORE_TAB,
  ExploreContext,
  type ExploreFilters,
  type ExplorePagination,
  type ExploreResults,
  type ExploreTab,
} from "@/context/ExploreContext";

const MAX_EXPLORE_QUERY_LENGTH = 100;
const DEFAULT_EXPLORE_LIMIT = 20;
const MAX_EXPLORE_LIMIT = 50;

interface ExploreApiResponse {
  personas: Persona[];
  circles: Circle[];
  posts: Post[];

  limit: number;
  nextCursor: string | null;
  hasMore: boolean;

  error?: string;
}

export interface ExploreProviderProps {
  children: ReactNode;
}

export function ExploreProvider({
  children,
}: ExploreProviderProps) {
  const [query, setQueryState] =
    useState("");

  const [activeTab, setActiveTab] =
    useState(
      DEFAULT_EXPLORE_TAB,
    );

  const [results, setResults] =
    useState<ExploreResults>(
      DEFAULT_EXPLORE_RESULTS,
    );

  const [filters, setFilters] =
    useState<ExploreFilters>(
      DEFAULT_EXPLORE_FILTERS,
    );

  const [pagination, setPagination] =
    useState<ExplorePagination>(
      DEFAULT_EXPLORE_PAGINATION,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * Every new Explore request receives a monotonically
   * increasing request id.
   *
   * Only the latest request is allowed to update state.
   */
  const requestSequenceRef =
    useRef(0);

  /*
   * Abort the previous in-flight request whenever a new
   * search/filter/page request starts.
   */
  const abortControllerRef =
    useRef<AbortController | null>(
      null,
    );

  const beginRequest =
    useCallback(() => {
      abortControllerRef.current?.abort();

      const controller =
        new AbortController();

      abortControllerRef.current =
        controller;

      const requestId =
        ++requestSequenceRef.current;

      return {
        requestId,
        signal: controller.signal,
      };
    }, []);

  const isCurrentRequest =
    useCallback(
      (requestId: number) =>
        requestId ===
        requestSequenceRef.current,
      [],
    );

  const finishRequest =
    useCallback(
      (requestId: number) => {
        if (
          !isCurrentRequest(
            requestId,
          )
        ) {
          return;
        }

        abortControllerRef.current =
          null;
      },
      [isCurrentRequest],
    );

  /*
   * Invalidate any in-flight request when the provider
   * unmounts.
   */
  useEffect(() => {
    return () => {
      requestSequenceRef.current += 1;

      abortControllerRef.current?.abort();

      abortControllerRef.current =
        null;
    };
  }, []);

  const requestSearch =
    useCallback(
      async (
        searchQuery: string,
        cursor: string | null,
        currentFilters: ExploreFilters,
        signal: AbortSignal,
      ): Promise<ExploreApiResponse> => {
        const normalizedQuery =
          searchQuery
            .normalize("NFKC")
            .trim()
            .slice(
              0,
              MAX_EXPLORE_QUERY_LENGTH,
            );

        const safeLimit =
          Math.min(
            DEFAULT_EXPLORE_LIMIT,
            MAX_EXPLORE_LIMIT,
          );

        const params =
          new URLSearchParams();

        params.set(
          "query",
          normalizedQuery,
        );

        params.set(
          "limit",
          String(safeLimit),
        );

        if (cursor) {
          params.set(
            "cursor",
            cursor,
          );
        }

        params.set(
          "personas",
          String(
            currentFilters.personas,
          ),
        );

        params.set(
          "circles",
          String(
            currentFilters.circles,
          ),
        );

        params.set(
          "posts",
          String(
            currentFilters.posts,
          ),
        );

        const response =
          await fetch(
            `/api/explore/search?${params.toString()}`,
            {
              method: "GET",
              credentials: "same-origin",
              cache: "no-store",
              headers: {
                Accept:
                  "application/json",
              },
              signal,
            },
          );

        const payload =
          (await response.json()) as ExploreApiResponse;

        if (!response.ok) {
          throw new Error(
            payload.error ??
              "Failed to search Explore.",
          );
        }

        return payload;
      },
      [],
    );

  const search =
    useCallback(
      async (
        searchQuery: string,
      ) => {
        const normalizedQuery =
          searchQuery
            .normalize("NFKC")
            .trim()
            .slice(
              0,
              MAX_EXPLORE_QUERY_LENGTH,
            );

        setQueryState(
          normalizedQuery,
        );

        const {
          requestId,
          signal,
        } = beginRequest();

        setLoading(true);
        setError(null);

        try {
          const payload =
            await requestSearch(
              normalizedQuery,
              null,
              filters,
              signal,
            );

          /*
           * Ignore responses from requests that have already
           * been superseded by a newer request.
           */
          if (
            !isCurrentRequest(
              requestId,
            )
          ) {
            return;
          }

          setResults({
            personas:
              payload.personas ?? [],
            circles:
              payload.circles ?? [],
            posts:
              payload.posts ?? [],
          });

          setPagination({
            limit:
              payload.limit,
            nextCursor:
              payload.nextCursor,
            hasMore:
              payload.hasMore,
          });
        } catch (requestError) {
          if (
            !isCurrentRequest(
              requestId,
            )
          ) {
            return;
          }

          /*
           * Abort is expected when a newer request supersedes
           * this one. It must not surface as a user-facing error.
           */
          if (
            requestError instanceof DOMException &&
            requestError.name ===
              "AbortError"
          ) {
            return;
          }

          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to search Explore.",
          );
        } finally {
          if (
            isCurrentRequest(
              requestId,
            )
          ) {
            finishRequest(
              requestId,
            );
            setLoading(false);
          }
        }
      },
      [
        beginRequest,
        filters,
        finishRequest,
        isCurrentRequest,
        requestSearch,
      ],
    );

  const refresh =
    useCallback(
      async () => {
        await search(query);
      },
      [query, search],
    );

  const setQuery =
    useCallback(
      (nextQuery: string) => {
        setQueryState(
          nextQuery.slice(
            0,
            MAX_EXPLORE_QUERY_LENGTH,
          ),
        );
      },
      [],
    );

  const changeTab =
    useCallback(
      (tab: ExploreTab) => {
        setActiveTab(tab);
      },
      [],
    );

  const changeFilter =
    useCallback(
      async (
        filter: keyof ExploreFilters,
        enabled: boolean,
      ) => {
        const nextFilters = {
          ...filters,
          [filter]: enabled,
        };

        setFilters(
          nextFilters,
        );

        const {
          requestId,
          signal,
        } = beginRequest();

        setLoading(true);
        setError(null);

        try {
          const payload =
            await requestSearch(
              query,
              null,
              nextFilters,
              signal,
            );

          if (
            !isCurrentRequest(
              requestId,
            )
          ) {
            return;
          }

          setResults({
            personas:
              payload.personas ?? [],
            circles:
              payload.circles ?? [],
            posts:
              payload.posts ?? [],
          });

          setPagination({
            limit:
              payload.limit,
            nextCursor:
              payload.nextCursor,
            hasMore:
              payload.hasMore,
          });
        } catch (requestError) {
          if (
            !isCurrentRequest(
              requestId,
            )
          ) {
            return;
          }

          if (
            requestError instanceof DOMException &&
            requestError.name ===
              "AbortError"
          ) {
            return;
          }

          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to update Explore filters.",
          );
        } finally {
          if (
            isCurrentRequest(
              requestId,
            )
          ) {
            finishRequest(
              requestId,
            );
            setLoading(false);
          }
        }
      },
      [
        beginRequest,
        filters,
        finishRequest,
        isCurrentRequest,
        query,
        requestSearch,
      ],
    );

  const loadNextPage =
    useCallback(
      async () => {
        if (
          loading ||
          !pagination.hasMore ||
          !pagination.nextCursor
        ) {
          return;
        }

        const {
          requestId,
          signal,
        } = beginRequest();

        setLoading(true);
        setError(null);

        try {
          const payload =
            await requestSearch(
              query,
              pagination.nextCursor,
              filters,
              signal,
            );

          if (
            !isCurrentRequest(
              requestId,
            )
          ) {
            return;
          }

          setResults(
            (current) => ({
              personas: [
                ...current.personas,
                ...(payload.personas ??
                  []),
              ],

              circles: [
                ...current.circles,
                ...(payload.circles ??
                  []),
              ],

              posts: [
                ...current.posts,
                ...(payload.posts ??
                  []),
              ],
            }),
          );

          setPagination({
            limit:
              payload.limit,
            nextCursor:
              payload.nextCursor,
            hasMore:
              payload.hasMore,
          });
        } catch (requestError) {
          if (
            !isCurrentRequest(
              requestId,
            )
          ) {
            return;
          }

          if (
            requestError instanceof DOMException &&
            requestError.name ===
              "AbortError"
          ) {
            return;
          }

          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load more Explore results.",
          );
        } finally {
          if (
            isCurrentRequest(
              requestId,
            )
          ) {
            finishRequest(
              requestId,
            );
            setLoading(false);
          }
        }
      },
      [
        beginRequest,
        filters,
        finishRequest,
        isCurrentRequest,
        loading,
        pagination.hasMore,
        pagination.nextCursor,
        query,
        requestSearch,
      ],
    );

  const value =
    useMemo(
      () => ({
        query,
        setQuery,

        activeTab,

        results,

        filters,

        pagination,

        loading,

        error,

        search,

        refresh,

        changeTab,

        changeFilter,

        loadNextPage,
      }),
      [
        query,
        setQuery,
        activeTab,
        results,
        filters,
        pagination,
        loading,
        error,
        search,
        refresh,
        changeTab,
        changeFilter,
        loadNextPage,
      ],
    );

  return (
    <ExploreContext.Provider
      value={value}
    >
      {children}
    </ExploreContext.Provider>
  );
}