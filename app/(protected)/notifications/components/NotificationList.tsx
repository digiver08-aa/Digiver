"use client";

import { Skeleton } from "@/components/ui";
import { useNotifications } from "@/hooks/useNotifications";

import { NotificationCard } from "./NotificationCard";
import { EmptyNotificationState } from "./EmptyNotificationState";

export function NotificationList() {
  const { notifications, loading } = useNotifications();

  if (loading) {
    return (
      <div
        className="space-y-1 p-4"
        aria-busy="true"
        aria-label="Loading notifications"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 rounded-lg p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-3 w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return <EmptyNotificationState />;
  }

  return (
    <div role="list" aria-label="Notifications">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
}
