import type { Circle } from "./circle.types";
import type { Post } from "./feed.types";
import type { Persona } from "./persona.types";

export interface Pagination {
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface SearchFilters {
  query: string;
  cursor?: string | null;
  limit?: number;
}

export interface PersonaSearchResult {
  personas: Persona[];
  pagination: Pagination;
}

export interface CircleSearchResult {
  circles: Circle[];
  pagination: Pagination;
}

export interface PostSearchResult {
  posts: Post[];
  pagination: Pagination;
}

export interface ExploreResult {
  personas: Persona[];
  circles: Circle[];
  posts: Post[];
}

export interface ExploreFeed {
  posts: Post[];
  personas: Persona[];
  circles: Circle[];
  pagination: Pagination;
}

export interface ExploreResponse {
  success: boolean;
  data: ExploreResult;
  pagination: Pagination;
  message?: string;
}

export interface ExploreService {
  getFeed(
    limit?: number,
    cursor?: string | null,
  ): Promise<ExploreFeed>;

  searchPersonas(
    filters: SearchFilters,
  ): Promise<PersonaSearchResult>;

  searchCircles(
    filters: SearchFilters,
  ): Promise<CircleSearchResult>;

  searchPosts(
    filters: SearchFilters,
  ): Promise<PostSearchResult>;
}

export interface ExploreContextValue {
  query: string;

  setQuery(
    query: string,
  ): void;

  activeTab:
    | "all"
    | "personas"
    | "circles"
    | "posts";

  results: ExploreResult;

  filters: {
    personas: boolean;
    circles: boolean;
    posts: boolean;
  };

  pagination: Pagination;

  loading: boolean;

  error: string | null;

  search(
    query: string,
  ): Promise<void>;

  refresh(): Promise<void>;

  changeTab(
    tab:
      | "all"
      | "personas"
      | "circles"
      | "posts",
  ): void;

  changeFilter(
    filter:
      | "personas"
      | "circles"
      | "posts",
    enabled: boolean,
  ): Promise<void>;

  loadNextPage(): Promise<void>;
}

export interface ExploreFeedProps {
  feed: ExploreFeed;
}

export interface ExploreResultsProps {
  results: ExploreResult;
}

export interface ExploreSearchBarProps {
  loading?: boolean;
  initialQuery?: string;

  onSearch(
    filters: SearchFilters,
  ): void;
}

export interface ExplorePaginationProps {
  pagination: Pagination;

  onPageChange(
    cursor: string | null,
  ): void;
}