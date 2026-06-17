export type ReactionType =
  | "like"
  | "love"
  | "insightful"
  | "support"
  | "applaud"
  | "curious";

export interface Reaction {
  id: string;

  post_id: string;

  persona_id: string;

  reaction_type: ReactionType;

  created_at: string;
}

export interface PersonaFeedData {
  id: string;

  display_name: string;

  title: string | null;

  avatar_url: string | null;
}

export interface Post {
  id: string;

  persona_id: string;

  content: string;

  created_at: string;

  updated_at: string;

  reactions_count: number;

  comments_count: number;

  reaction_summary: Record<ReactionType, number>;

  user_reaction: ReactionType | null;

  persona: PersonaFeedData | null;
}

export interface CreatePostInput {
  content: string;
}

export interface FeedResponse {
  success: boolean;

  posts: Post[];

  nextCursor: string | null;

  error?: string;
}

export interface PostsResponse {
  success: boolean;

  post: Post | null;

  error?: string;
}

export interface ReactionResponse {
  success: boolean;

  reaction: Reaction | null;

  error?: string;
}