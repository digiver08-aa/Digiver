"use client";

import Link from "next/link";

import { useNotifications } from "@/hooks/useNotifications";
import type { Notification } from "@/types/notification.types";

interface NotificationCardProps {
  notification: Notification;
}

export function NotificationCard({
  notification,
}: NotificationCardProps) {
  const { markRead, markingReadId } = useNotifications();

  const isMarking =
    markingReadId === notification.id;

  const handleClick = () => {
    if (!notification.is_read && !isMarking) {
      void markRead(notification.id).catch(() => undefined);
    }
  };

  const content = (
    <div
      role="listitem"
      className={`border-b p-4 transition-colors hover:bg-muted/40 ${
        !notification.is_read
          ? "bg-muted/20"
          : ""
      } ${isMarking ? "opacity-70" : ""}`}
      aria-busy={isMarking}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${
            notification.is_read
              ? "bg-transparent"
              : "bg-blue-500"
          }`}
        />

        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-medium">
            {notification.title}
          </p>

          <p className="mt-1 break-words text-sm text-muted-foreground">
            {notification.body}
          </p>

          <time
            dateTime={notification.created_at}
            className="mt-2 block text-xs text-muted-foreground"
          >
            {new Date(
              notification.created_at,
            ).toLocaleString()}
          </time>
        </div>

        {isMarking && (
          <span className="shrink-0 text-xs text-muted-foreground">
            Updating…
          </span>
        )}
      </div>
    </div>
  );

  const label = `${notification.is_read ? "" : "Unread notification: "}${notification.title}`;

  if (notification.link) {
    return (
      <Link
        href={notification.link}
        onClick={handleClick}
        aria-label={label}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isMarking}
      aria-label={label}
      className="block min-h-11 w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset disabled:cursor-wait"
    >
      {content}
    </button>
  );
}
