"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

import { useNotifications } from "@/hooks/useNotifications";

import { NotificationBadge } from "./NotificationBadge";
import { NotificationList } from "./NotificationList";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const {
    unreadCount,
    markAllRead,
    markingAllRead,
  } = useNotifications();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="notification-dropdown"
        aria-haspopup="dialog"
        aria-label={`Notifications${
          unreadCount > 0
            ? `, ${unreadCount} unread`
            : ""
        }`}
        onClick={() => setOpen((value) => !value)}
        className="relative flex min-h-11 min-w-11 items-center justify-center rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <Bell
          className="h-5 w-5"
          aria-hidden="true"
        />
        <NotificationBadge />
      </button>

      {open && (
        <div
          ref={panelRef}
          id="notification-dropdown"
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-12 z-50 w-[min(calc(100vw-2rem),24rem)] overflow-hidden rounded-xl border bg-background shadow-lg"
        >
          <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
            <h2 className="text-sm font-semibold">
              Notifications
            </h2>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => void markAllRead().catch(() => undefined)}
                disabled={markingAllRead}
                className="inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCheck
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                />
                {markingAllRead
                  ? "Marking…"
                  : "Mark all read"}
              </button>
            )}
          </div>

          <div className="max-h-[min(31rem,70vh)] overflow-y-auto">
            <NotificationList />
          </div>
        </div>
      )}
    </div>
  );
}
