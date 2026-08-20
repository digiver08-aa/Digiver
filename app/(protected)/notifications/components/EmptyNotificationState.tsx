"use client";

import { Bell } from "lucide-react";

export function EmptyNotificationState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <Bell
        className="h-9 w-9 text-muted-foreground"
        aria-hidden="true"
      />
      <h2 className="mt-3 text-sm font-medium">
        All caught up
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        No notifications yet.
      </p>
    </div>
  );
}
