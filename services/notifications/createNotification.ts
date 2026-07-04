import "server-only";

import { createClient } from "@/supabase/server";

import type {
  Notification,
  NotificationType,
} from "@/types/notification.types";

interface CreateNotificationInput {
  recipientPersonaId: string;

  actorPersonaId?: string | null;

  type: NotificationType | string;

  title: string;

  body: string;

  link?: string | null;

  metadata?: Record<string, unknown>;
}

export async function createNotification(
  input: CreateNotificationInput
): Promise<Notification> {
  const supabase = await createClient();

  const metadata =
    input.metadata ?? {};

  const metadataSize =
    JSON.stringify(metadata).length;

  if (metadataSize > 8192) {
    throw new Error(
      "Notification metadata exceeds 8KB limit."
    );
  }

  const link =
    input.link ?? null;

  if (
    link !== null &&
    !link.startsWith("/")
  ) {
    throw new Error(
      "Notification links must be internal routes."
    );
  }

  const { data, error } = await supabase
    .from("notifications")
    .insert({
      recipient_persona_id:
        input.recipientPersonaId,

      actor_persona_id:
        input.actorPersonaId ?? null,

      type: input.type,

      title: input.title,

      body: input.body,

      link,

      metadata,
    })
    .select()
    .single();

  if (error) {
    throw new Error(
      `Failed to create notification: ${error.message}`
    );
  }

  return data as Notification;
}