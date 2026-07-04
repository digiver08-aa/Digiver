// ============================================================
// DIGIVER
// PHASE 8 — NOTIFICATION SYSTEM MVP
// notification.types.ts
// ============================================================

export type NotificationType =
  | "follow"
  | "follow_request"
  | "follow_accepted"
  | "circle_invite"
  | "circle_join"
  | "circle_role_update"
  | "post_like"
  | "post_comment"
  | "comment_like"
  | "comment_reply"
  | "message"
  | "system";

export interface Notification {
  id: string;

  recipient_persona_id: string;

  actor_persona_id: string | null;

  type: NotificationType | string;

  title: string;

  body: string;

  link: string | null;

  metadata: Record<string, unknown>;

  is_read: boolean;

  read_at: string | null;

  created_at: string;
}

export interface NotificationResponse {
  notifications: Notification[];

  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkReadInput {
  notificationId: string;
}

export interface MarkAllReadInput {
  personaId: string;
}