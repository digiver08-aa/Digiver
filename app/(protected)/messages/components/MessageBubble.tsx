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
  return (
    <div
      className={`flex ${
        isOwnMessage
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-xl px-4 py-3 ${
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="whitespace-pre-wrap wrap-break-word text-sm">
          {message.content}
        </p>

        <div className="mt-2 text-[10px] opacity-70">
          {new Date(
            message.created_at
          ).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}