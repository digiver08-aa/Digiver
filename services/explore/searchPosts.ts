import { createClient } from "@/supabase/server";

import type {
  Post,
  ReactionType,
} from "@/types/feed.types";

import type {
  SearchOptions,
  SearchPostsResponse,
} from "./types";

import {
  createPaginationResult,
  createSearchPattern,
  createTimestampCursor,
  getPagination,
  handleExploreError,
  parseTimestampCursor,
} from "./utils";

const EMPTY_REACTION_SUMMARY: Record<
  ReactionType,
  number
> = {
  like: 0,
  love: 0,
  insightful: 0,
  support: 0,
  applaud: 0,
  curious: 0,
};

interface ExplorePostRow {
  id: string;
  persona_id: string;
  content: string;
  created_at: string;
  updated_at: string;

  personas:
    | {
        id: string;
        name: string;
        title: string | null;
        avatar_url: string | null;
      }
    | null;
}

interface ReactionRow {
  id: string;
  post_id: string;
  persona_id: string;
  type: ReactionType;
  created_at: string;
}

export async function searchPosts({
  query,
  cursor,
  limit,
}: SearchOptions): Promise<SearchPostsResponse> {
  try {
    const supabase =
      await createClient();

    const {
      limit: pageSize,
      cursor: rawCursor,
    } = getPagination(
      limit,
      cursor,
    );

    const search =
      createSearchPattern(query);

    const parsedCursor =
      parseTimestampCursor(rawCursor);

    let request = supabase
      .from("posts")
      .select(
        `
          id,
          persona_id,
          content,
          created_at,
          updated_at,
          personas!inner(
            id,
            name,
            title,
            avatar_url,
            is_public,
            is_active
          )
        `,
        {
          count: "exact",
        },
      )
      .eq(
        "personas.is_public",
        true,
      )
      .eq(
        "personas.is_active",
        true,
      );

    if (search) {
      request = request.ilike(
        "content",
        search,
      );
    }

    if (parsedCursor) {
      request = request.or(
        [
          `created_at.lt.${parsedCursor.createdAt}`,
          `and(created_at.eq.${parsedCursor.createdAt},id.lt.${parsedCursor.id})`,
        ].join(","),
      );
    }

    const {
      data,
      error,
    } = await request
      .order("created_at", {
        ascending: false,
      })
      .order("id", {
        ascending: false,
      })
      .limit(pageSize + 1);

    if (error) {
      throw error;
    }

    const rows =
      (data ?? []) as unknown as ExplorePostRow[];

    const hasMore =
      rows.length > pageSize;

    const pageRows =
      hasMore
        ? rows.slice(0, pageSize)
        : rows;

    if (pageRows.length === 0) {
      return {
        results: [],
        ...createPaginationResult(
          pageSize,
          null,
          false,
        ),
      };
    }

    const postIds =
      pageRows.map(
        (post) => post.id,
      );

    const {
      data: reactionsData,
      error: reactionsError,
    } = await supabase
      .from("reactions")
      .select(
        `
          id,
          post_id,
          persona_id,
          type,
          created_at
        `,
      )
      .in(
        "post_id",
        postIds,
      );

    if (reactionsError) {
      throw reactionsError;
    }

    const reactions =
      (reactionsData ??
        []) as ReactionRow[];

    const {
      data: {
        user,
      },
    } = await supabase.auth.getUser();

    let currentUserPersonaIds: string[] =
      [];

    if (user) {
      const {
        data: personas,
        error: personasError,
      } = await supabase
        .from("personas")
        .select("id")
        .eq(
          "user_id",
          user.id,
        );

      if (personasError) {
        throw personasError;
      }

      currentUserPersonaIds =
        (personas ?? []).map(
          (persona) => persona.id,
        );
    }

    const results: Post[] =
      pageRows.map((post) => {
        const postReactions =
          reactions.filter(
            (reaction) =>
              reaction.post_id ===
              post.id,
          );

        const reactionSummary = {
          ...EMPTY_REACTION_SUMMARY,
        };

        for (
          const reaction of postReactions
        ) {
          reactionSummary[
            reaction.type
          ] += 1;
        }

        const userReaction =
          postReactions.find(
            (reaction) =>
              currentUserPersonaIds.includes(
                reaction.persona_id,
              ),
          );

        return {
          id: post.id,
          persona_id:
            post.persona_id,
          content: post.content,
          created_at:
            post.created_at,
          updated_at:
            post.updated_at,

          reactions_count:
            postReactions.length,

          comments_count: 0,

          reaction_summary:
            reactionSummary,

          user_reaction:
            userReaction?.type ??
            null,

          persona:
            post.personas
              ? {
                  id:
                    post.personas.id,
                  display_name:
                    post.personas.name,
                  title:
                    post.personas.title,
                  avatar_url:
                    post.personas
                      .avatar_url,
                }
              : null,
        };
      });

    const lastRow =
      pageRows[pageRows.length - 1];

    const nextCursor =
      hasMore && lastRow
        ? createTimestampCursor(
            lastRow.created_at,
            lastRow.id,
          )
        : null;

    return {
      results,
      ...createPaginationResult(
        pageSize,
        nextCursor,
        hasMore,
      ),
    };
  } catch (error) {
    handleExploreError(
      error,
      "Failed to search posts.",
    );
  }
}