"use client";

export function EmptyNotificationState() {
  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-10
        text-center
      "
    >
      <p
        className="
          text-sm
          text-muted-foreground
        "
      >
        No notifications yet.
      </p>
    </div>
  );
}