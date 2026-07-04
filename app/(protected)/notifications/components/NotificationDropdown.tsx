"use client";

import { useState } from "react";

import { useNotifications } from "@/hooks/useNotifications";

import { NotificationBadge } from "./NotificationBadge";
import { NotificationList } from "./NotificationList";

export function NotificationDropdown() {
  const [open, setOpen] =
    useState(false);

  const {
    unreadCount,
    markAllRead,
  } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() =>
          setOpen(!open)
        }
        className="
          relative
          rounded-md
          p-2
          hover:bg-muted
        "
      >
        🔔

        <NotificationBadge />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-12
            z-50
            w-96
            overflow-hidden
            rounded-xl
            border
            bg-background
            shadow-lg
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              px-4
              py-3
            "
          >
            <h3
              className="
                text-sm
                font-semibold
              "
            >
              Notifications
            </h3>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() =>
                  void markAllRead()
                }
                className="
                  text-xs
                  font-medium
                "
              >
                Mark all read
              </button>
            )}
          </div>

          <div
            className="
              max-h-125
              overflow-y-auto
            "
          >
            <NotificationList />
          </div>
        </div>
      )}
    </div>
  );
}