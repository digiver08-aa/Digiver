"use client";

import { createContext } from "react";

import type {
  CreatePostInput,
  Post,
  ReactionType,
} from "@/types/feed.types";

export interface FeedContextValue {
  posts: Post[];

  loading: boolean;

  error: string | null;

  refreshFeed: () => Promise<void>;

  createPost: (
    input: CreatePostInput
  ) => Promise<boolean>;

  addReaction: (
    postId: string,
    reactionType: ReactionType
  ) => Promise<boolean>;

  removeReaction: (
    postId: string
  ) => Promise<boolean>;
}

export const FeedContext =
  createContext<FeedContextValue | null>(
    null
  );