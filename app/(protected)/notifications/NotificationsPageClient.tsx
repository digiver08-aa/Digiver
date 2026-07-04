"use client";

import { NotificationProvider } from "@/providers/NotificationProvider";

import { NotificationList } from "./components/NotificationList";

import { useNotifications } from "@/hooks/useNotifications";

function NotificationsContent() {
  const {
    unreadCount,
    markAllRead,
  } = useNotifications();

  return (
    <div className="mx-auto max-w-4xl">
      <div
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <h1
            className="text-2xl font-bold"
          >
            Notifications
          </h1>

          <p
            className="text-sm text-muted-foreground"
          >
            {unreadCount} unread
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() =>
              void markAllRead()
            }
            className="rounded-md border px-4 py-2 text-sm font-medium"
          >
            Mark all read
          </button>
        )}
      </div>

      <div
        className="overflow-hidden rounded-xl border bg-background"
      >
        <NotificationList />
      </div>
    </div>
  );
}

interface NotificationsPageClientProps {
  personaId: string;
}

export default function NotificationsPageClient({
  personaId,
}: NotificationsPageClientProps) {
  return (
    <NotificationProvider
      personaId={personaId}
    >
      <NotificationsContent />
    </NotificationProvider>
  );
}