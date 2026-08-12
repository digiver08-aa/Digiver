import type { Circle } from "@/types/circle.types";
import type { Post } from "@/types/feed.types";
import type { Persona } from "@/types/persona.types";

export const DEFAULT_EXPLORE_LIMIT = 20;
export const MAX_EXPLORE_LIMIT = 50;
export const MAX_EXPLORE_QUERY_LENGTH = 100;

export interface PaginationOptions {
  limit?: number;
  cursor?: string | null;
}

export interface SearchOptions extends PaginationOptions {
  query: string;
}

export interface PaginationResult {
  limit: number;
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ExploreFeedResponse extends PaginationResult {
  posts: Post[];
  personas: Persona[];
  circles: Circle[];
}

export interface SearchPersonasResponse extends PaginationResult {
  results: Persona[];
}

export interface SearchCirclesResponse extends PaginationResult {
  results: Circle[];
}

export interface SearchPostsResponse extends PaginationResult {
  results: Post[];
}

export interface TrendingPreviewResponse {
  personas: Persona[];
  circles: Circle[];
  hashtags: string[];
}