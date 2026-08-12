import { createClient } from "@/supabase/server";

import { mapPersona } from "@/services/personas/mappers";

import type { Circle } from "@/types/circle.types";
import type {
  Post,
  ReactionType,
} from "@/types/feed.types";

import type {
  ExploreFeedResponse,
  PaginationOptions,
} from "./types";

import {
  createExploreFeedCursor,
  createPaginationResult,
  createTimestampCursor,
  getPagination,
  handleExploreError,
  parseExploreFeedCursor,
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

export async function getExploreFeed({
  cursor,
  limit,
}: PaginationOptions = {}): Promise<ExploreFeedResponse> {
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

    const parsedCursor =
      parseExploreFeedCursor(rawCursor);

    const postsQuery =
      supabase
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
        )
        .eq(
          "personas.is_public",
          true,
        )
        .eq(
          "personas.is_active",
          true,
        );

    if (parsedCursor?.posts) {
      postsQuery.or(
        [
          `created_at.lt.${parsedCursor.posts.createdAt}`,
          `and(created_at.eq.${parsedCursor.posts.createdAt},id.lt.${parsedCursor.posts.id})`,
        ].join(","),
      );
    }

    const personasQuery =
      supabase
        .from("personas")
        .select(
          `
            id,
            user_id,
            name,
            slug,
            title,
            bio,
            avatar_url,
            banner_url,
            is_active,
            is_public,
            created_at,
            updated_at
          `,
        )
        .eq(
          "is_public",
          true,
        )
        .eq(
          "is_active",
          true,
        );

    if (parsedCursor?.personas) {
      personasQuery.or(
        [
          `name.gt.${parsedCursor.personas.name}`,
          `and(name.eq.${parsedCursor.personas.name},id.gt.${parsedCursor.personas.id})`,
        ].join(","),
      );
    }

    const circlesQuery =
      supabase
        .from("circles")
        .select(
          `
            id,
            owner_persona_id,
            name,
            slug,
            description,
            avatar_url,
            banner_url,
            created_at,
            updated_at,
            owner_persona:personas!inner(
              id,
              is_public,
              is_active
            )
          `,
        )
        .eq("owner_persona.is_public", true)
        .eq("owner_persona.is_active", true);

    const [
      postsResult,
      personasResult,
      circlesResult,
    ] = await Promise.all([
      postsQuery
        .order("created_at", {
          ascending: false,
        })
        .order("id", {
          ascending: false,
        })
        .limit(pageSize + 1),

      personasQuery
        .order("name", {
          ascending: true,
        })
        .order("id", {
          ascending: true,
        })
        .limit(pageSize + 1),

      circlesQuery
        .order("created_at", {
          ascending: false,
        })
        .order("id", {
          ascending: false,
        })
        .limit(pageSize + 1),
    ]);

    if (postsResult.error) {
      throw postsResult.error;
    }

    if (personasResult.error) {
      throw personasResult.error;
    }

    if (circlesResult.error) {
      throw circlesResult.error;
    }

    const postRows =
      (postsResult.data ??
        []) as unknown as ExplorePostRow[];

    const personaRows =
      personasResult.data ?? [];

    const circleRows =
      circlesResult.data ?? [];

    const postsHasMore =
      postRows.length > pageSize;

    const personasHasMore =
      personaRows.length > pageSize;

    const circlesHasMore =
      circleRows.length > pageSize;

    const pagePostRows =
      postsHasMore
        ? postRows.slice(0, pageSize)
        : postRows;

    const pagePersonaRows =
      personasHasMore
        ? personaRows.slice(0, pageSize)
        : personaRows;

    const pageCircleRows =
      circlesHasMore
        ? circleRows.slice(0, pageSize)
        : circleRows;

    const postIds =
      pagePostRows.map(
        (post) => post.id,
      );

    let reactions: ReactionRow[] =
      [];

    if (postIds.length > 0) {
      const {
        data,
        error,
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

      if (error) {
        throw error;
      }

      reactions =
        (data ?? []) as ReactionRow[];
    }

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
        error,
      } = await supabase
        .from("personas")
        .select("id")
        .eq(
          "user_id",
          user.id,
        );

      if (error) {
        throw error;
      }

      currentUserPersonaIds =
        (personas ?? []).map(
          (persona) => persona.id,
        );
    }

    const posts: Post[] =
      pagePostRows.map((post) => {
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

    const personas =
      pagePersonaRows.map(
        (row) =>
          mapPersona(row),
      );

    const circles =
      pageCircleRows as Circle[];

    const nextCursor =
      createExploreFeedCursor({
        posts:
          postsHasMore &&
          pagePostRows.length > 0
            ? createTimestampCursor(
                pagePostRows[
                  pagePostRows.length - 1
                ].created_at,
                pagePostRows[
                  pagePostRows.length - 1
                ].id,
              )
                ? {
                    createdAt:
                      pagePostRows[
                        pagePostRows.length - 1
                      ].created_at,
                    id:
                      pagePostRows[
                        pagePostRows.length - 1
                      ].id,
                  }
                : null
            : null,

        personas:
          personasHasMore &&
          pagePersonaRows.length > 0
            ? {
                name:
                  pagePersonaRows[
                    pagePersonaRows.length - 1
                  ].name,
                id:
                  pagePersonaRows[
                    pagePersonaRows.length - 1
                  ].id,
              }
            : null,

        circles:
          circlesHasMore &&
          pageCircleRows.length > 0
            ? {
                createdAt:
                  pageCircleRows[
                    pageCircleRows.length - 1
                  ].created_at,
                id:
                  pageCircleRows[
                    pageCircleRows.length - 1
                  ].id,
              }
            : null,
      });

    const hasMore =
      postsHasMore ||
      personasHasMore ||
      circlesHasMore;

    return {
      posts,
      personas,
      circles,
      ...createPaginationResult(
        pageSize,
        hasMore
          ? nextCursor
          : null,
        hasMore,
      ),
    };
  } catch (error) {
    handleExploreError(
      error,
      "Failed to load explore feed.",
    );
  }
}