"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import { NotificationProvider } from "@/providers/NotificationProvider";
import { useNotifications } from "@/hooks/useNotifications";

import { NotificationList } from "./components/NotificationList";

function NotificationsContent() {
  const {
    unreadCount,
    markAllRead,
    markingAllRead,
    error,
    refresh,
  } = useNotifications();

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Notifications
          </h1>
          <p
            className="text-sm text-muted-foreground"
            aria-live="polite"
          >
            {unreadCount} unread
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => void markAllRead().catch(() => undefined)}
            disabled={markingAllRead}
            className="min-h-11 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {markingAllRead ? "Marking…" : "Mark all read"}
          </button>
        )}
      </header>

      {error && (
        <div
          className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
          role="alert"
        >
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <div className="min-w-0 flex-1">
            <p className="text-destructive">
              {error}
            </p>
            <button
              type="button"
              onClick={() => void refresh()}
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <RefreshCw
                className="h-3.5 w-3.5"
                aria-hidden="true"
              />
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border bg-background">
        <NotificationList />
      </div>
    </main>
  );
}

interface NotificationsPageClientProps {
  personaId: string;
}

export default function NotificationsPageClient({
  personaId,
}: NotificationsPageClientProps) {
  return (
    <NotificationProvider personaId={personaId}>
      <NotificationsContent />
    </NotificationProvider>
  );
}
