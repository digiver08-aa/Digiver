"use client";

import { MessageSquare } from "lucide-react";

import { Skeleton } from "@/components/ui";
import type { Conversation } from "@/types/message.types";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelect: (conversation: Conversation) => void;
  loading?: boolean;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
  loading = false,
}: ConversationListProps) {
  if (loading) {
    return (
      <div
        className="space-y-px"
        aria-busy="true"
        aria-label="Loading conversations"
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <MessageSquare
          className="h-9 w-9 text-muted-foreground"
          aria-hidden="true"
        />
        <h2 className="mt-3 text-sm font-medium">
          No conversations yet
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Your conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y" role="list" aria-label="Conversations">
      {conversations.map((conversation) => {
        const isActive =
          activeConversationId === conversation.id;

        return (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation)}
            aria-current={isActive ? "true" : undefined}
            className={`w-full min-w-0 p-4 text-left transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset ${
              isActive ? "bg-muted" : ""
            }`}
          >
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-medium">
                {conversation.recipient_name || "Conversation"}
              </span>
              <span className="text-xs text-muted-foreground">
                {conversation.last_message || "Direct message"}
              </span>
              <time
                dateTime={conversation.updated_at}
                className="text-xs text-muted-foreground"
              >
                Updated{" "}
                {new Date(conversation.updated_at).toLocaleString()}
              </time>
            </span>
          </button>
        );
      })}
    </div>
  );
}
