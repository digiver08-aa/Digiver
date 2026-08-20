"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";

import { Skeleton } from "@/components/ui";
import type { Message } from "@/types/message.types";

import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
  currentPersonaId: string;
  loading?: boolean;
}

export default function MessageList({
  messages,
  currentPersonaId,
  loading = false,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  if (loading) {
    return (
      <div
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
        aria-busy="true"
        aria-label="Loading messages"
      >
        <Skeleton className="h-12 w-3/4 self-start" />
        <Skeleton className="h-16 w-2/3 self-end" />
        <Skeleton className="h-12 w-1/2 self-start" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div
        className="flex flex-1 items-center justify-center overflow-y-auto p-6 text-center"
        role="status"
      >
        <div className="max-w-sm">
          <MessageSquare
            className="mx-auto h-9 w-9 text-muted-foreground"
            aria-hidden="true"
          />
          <h3 className="mt-3 font-medium">
            No messages yet
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start the conversation by sending a message below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col gap-3 overflow-y-auto p-4"
      aria-live="polite"
      aria-label="Conversation messages"
    >
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwnMessage={
            message.sender_persona_id === currentPersonaId
          }
        />
      ))}
      <div ref={bottomRef} aria-hidden="true" />
    </div>
  );
}
