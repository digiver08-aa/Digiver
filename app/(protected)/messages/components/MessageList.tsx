"use client";

import { useEffect, useRef } from "react";

import type { Message } from "@/types/message.types";

import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  currentPersonaId: string;
}

export default function MessageList({
  messages,
  currentPersonaId,
}: MessageListProps) {
  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={
            message.sender_persona_id ===
            currentPersonaId
          }
        />
      ))}

      <div ref={bottomRef} />
    </div>
  );
}