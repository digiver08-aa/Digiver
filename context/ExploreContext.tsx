"use client";

import { createContext } from "react";

import type { Circle } from "@/types/circle.types";
import type { Post } from "@/types/feed.types";
import type { Persona } from "@/types/persona.types";

export type ExploreTab =
  | "all"
  | "personas"
  | "circles"
  | "posts";

export interface ExploreResults {
  personas: Persona[];
  circles: Circle[];
  posts: Post[];
}

export interface ExploreFilters {
  personas: boolean;
  circles: boolean;
  posts: boolean;
}

export interface ExplorePagination {
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ExploreContextValue {
  query: string;

  setQuery(
    query: string,
  ): void;

  activeTab: ExploreTab;

  results: ExploreResults;

  filters: ExploreFilters;

  pagination: ExplorePagination;

  loading: boolean;

  error: string | null;

  search(
    query: string,
  ): Promise<void>;

  refresh(): Promise<void>;

  changeTab(
    tab: ExploreTab,
  ): void;

  changeFilter(
    filter: keyof ExploreFilters,
    enabled: boolean,
  ): Promise<void>;

  loadNextPage(): Promise<void>;
}

export const DEFAULT_EXPLORE_RESULTS: ExploreResults = {
  personas: [],
  circles: [],
  posts: [],
};

export const DEFAULT_EXPLORE_FILTERS: ExploreFilters = {
  personas: true,
  circles: true,
  posts: true,
};

export const DEFAULT_EXPLORE_PAGINATION: ExplorePagination = {
  limit: 20,
  nextCursor: null,
  hasMore: false,
};

export const DEFAULT_EXPLORE_TAB: ExploreTab =
  "all";

export const ExploreContext =
  createContext<
    ExploreContextValue | undefined
  >(undefined);