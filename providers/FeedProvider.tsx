"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  addReaction as addReactionService,
  createPost as createPostService,
  getFeed,
  removeReaction as removeReactionService,
} from "@/services/feed";

import { FeedContext } from "@/context/FeedContext";

import { usePersona } from "@/hooks/usePersona";

import type {
  CreatePostInput,
  Post,
  ReactionType,
} from "@/types/feed.types";

interface Props {
  children: React.ReactNode;
}

export function FeedProvider({
  children,
}: Props) {
  const { persona } = usePersona();

  const [posts, setPosts] =
    useState<Post[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [nextCursor, setNextCursor] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const refreshFeed =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await getFeed();

        if (!response.success) {
          setError(
            response.error ??
              "Failed to load feed"
          );
          return;
        }

        setPosts(response.posts);
        setNextCursor(response.nextCursor);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load feed"
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshFeed();
    });
  }, [refreshFeed]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || loading || loadingMore) {
      return;
    }

    try {
      setLoadingMore(true);
      setError(null);

      const response = await getFeed(nextCursor);

      if (!response.success) {
        setError(response.error ?? "Failed to load more posts");
        return;
      }

      setPosts((prev) => {
        const existingIds = new Set(prev.map((post) => post.id));
        const additions = response.posts.filter((post) => !existingIds.has(post.id));
        return [...prev, ...additions];
      });
      setNextCursor(response.nextCursor);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load more posts"
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, nextCursor]);

  const createPost = useCallback(
    async (
      input: CreatePostInput
    ): Promise<boolean> => {
      if (!persona) {
        setError(
          "No persona available"
        );

        return false;
      }

      const response =
        await createPostService(
          persona.id,
          input
        );

      if (
        !response.success ||
        !response.post
      ) {
        setError(
          response.error ??
            "Failed to create post"
        );

        return false;
      }

      const createdPost: Post = {
        ...response.post,
        persona: persona
          ? {
              id: persona.id,
              display_name: persona.name,
              title: persona.title,
              avatar_url: persona.avatarUrl,
            }
          : response.post.persona,
      };

      setPosts((prev) => [
        createdPost,
        ...prev,
      ]);

      return true;
    },
    [persona]
  );

  const addReaction =
    useCallback(
      async (
        postId: string,
        reactionType: ReactionType
      ): Promise<boolean> => {
        if (!persona) {
          setError(
            "No persona available"
          );

          return false;
        }

        const response =
          await addReactionService(
            postId,
            persona.id,
            reactionType
          );

        if (!response.success) {
          setError(
            response.error ??
              "Failed to react"
          );

          return false;
        }

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id !== postId) {
              return post;
            }

            const summary = {
              ...post.reaction_summary,
            };

            const previousReaction =
              post.user_reaction;

            if (
              previousReaction &&
              summary[
                previousReaction
              ] > 0
            ) {
              summary[
                previousReaction
              ] -= 1;
            }

            summary[reactionType] += 1;

            return {
              ...post,
              user_reaction:
                reactionType,
              reactions_count:
                previousReaction
                  ? post.reactions_count
                  : post.reactions_count +
                    1,
              reaction_summary:
                summary,
            };
          })
        );

        return true;
      },
      [persona]
    );

  const removeReaction =
    useCallback(
      async (
        postId: string
      ): Promise<boolean> => {
        if (!persona) {
          setError(
            "No persona available"
          );

          return false;
        }

        const targetPost =
          posts.find(
            (post) =>
              post.id === postId
          );

        if (
          !targetPost ||
          !targetPost.user_reaction
        ) {
          return true;
        }

        const response =
          await removeReactionService(
            postId,
            persona.id
          );

        if (!response.success) {
          setError(
            response.error ??
              "Failed to remove reaction"
          );

          return false;
        }

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id !== postId) {
              return post;
            }

            const summary = {
              ...post.reaction_summary,
            };

            const previousReaction =
              post.user_reaction;

            if (
              previousReaction &&
              summary[
                previousReaction
              ] > 0
            ) {
              summary[
                previousReaction
              ] -= 1;
            }

            return {
              ...post,
              user_reaction: null,
              reactions_count:
                Math.max(
                  0,
                  post.reactions_count -
                    1
                ),
              reaction_summary:
                summary,
            };
          })
        );

        return true;
      },
      [persona, posts]
    );

  const hasMore = nextCursor !== null;

  const value = useMemo(
    () => ({
      posts,
      loading,
      loadingMore,
      hasMore,
      error,
      refreshFeed,
      loadMore,
      createPost,
      addReaction,
      removeReaction,
    }),
    [
      posts,
      loading,
      loadingMore,
      hasMore,
      error,
      refreshFeed,
      loadMore,
      createPost,
      addReaction,
      removeReaction,
    ]
  );

  return (
    <FeedContext.Provider
      value={value}
    >
      {children}
    </FeedContext.Provider>
  );
}