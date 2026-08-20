"use client";

import type { Message } from "@/types/message.types";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({
  message,
  isOwnMessage,
}: MessageBubbleProps) {
  const timestamp = new Date(message.created_at);
  const accessibleTime = Number.isNaN(timestamp.getTime())
    ? "Time unavailable"
    : timestamp.toLocaleString();

  return (
    <div
      className={`flex ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[85%] rounded-xl px-4 py-3 sm:max-w-[75%] ${
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word text-sm">
          {message.content}
        </p>

        <time
          dateTime={message.created_at}
          title={accessibleTime}
          className="mt-2 block text-[10px] opacity-70"
        >
          {Number.isNaN(timestamp.getTime())
            ? "Time unavailable"
            : timestamp.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
        </time>
      </div>
    </div>
  );
}
