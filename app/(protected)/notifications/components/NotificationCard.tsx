"use client";

import Link from "next/link";

import { useNotifications } from "@/hooks/useNotifications";

import type {
  Notification,
} from "@/types/notification.types";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({
  notification,
}: NotificationCardProps) {
  const { markRead } =
    useNotifications();

  const handleClick = async () => {
    if (!notification.is_read) {
      await markRead(
        notification.id
      );
    }
  };

  const content = (
    <div
      className={`
        border-b
        p-4
        transition-colors
        hover:bg-muted/40
        ${
          !notification.is_read
            ? "bg-muted/20"
            : ""
        }
      `}
    >
      <div className="flex items-start gap-2">
        {!notification.is_read && (
          <span
            className="
              mt-2
              h-2
              w-2
              rounded-full
              bg-blue-500
            "
          />
        )}

        <div className="flex-1">
          <p className="text-sm font-medium">
            {notification.title}
          </p>

          <p
            className="
              mt-1
              text-sm
              text-muted-foreground
            "
          >
            {notification.body}
          </p>

          <p
            className="
              mt-2
              text-xs
              text-muted-foreground
            "
          >
            {new Date(
              notification.created_at
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link
        href={notification.link}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full text-left"
    >
      {content}
    </button>
  );
}