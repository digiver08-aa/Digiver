"use client";

import { useNotifications } from "@/hooks/useNotifications";

import { NotificationCard } from "./NotificationCard";
import { EmptyNotificationState } from "./EmptyNotificationState";

export function NotificationList() {
  const {
    notifications,
    loading,
  } = useNotifications();

  if (loading) {
    return (
      <div className="p-4">
        Loading notifications...
      </div>
    );
  }

  if (
    notifications.length === 0
  ) {
    return (
      <EmptyNotificationState />
    );
  }

  return (
    <div>
      {notifications.map(
        (notification) => (
          <NotificationCard
            key={notification.id}
            notification={
              notification
            }
          />
        )
      )}
    </div>
  );
}