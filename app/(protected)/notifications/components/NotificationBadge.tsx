"use client";

import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBadge() {
  const { unreadCount } =
    useNotifications();

  if (unreadCount <= 0) {
    return null;
  }

  return (
    <span
      className="
        absolute
        -top-1
        -right-1
        flex
        h-5
        min-w-5
        items-center
        justify-center
        rounded-full
        bg-red-500
        px-1
        text-[10px]
        font-semibold
        text-white
      "
    >
      {unreadCount > 99
        ? "99+"
        : unreadCount}
    </span>
  );
}