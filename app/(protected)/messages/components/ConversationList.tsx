"use client";

import type { Conversation } from "@/types/message.types";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelect: (conversation: Conversation) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No conversations found.
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          type="button"
          onClick={() => onSelect(conversation)}
          className={`w-full p-4 text-left transition hover:bg-muted ${
            activeConversationId === conversation.id
              ? "bg-muted"
              : ""
          }`}
        >
          <div className="flex flex-col gap-1">
            <span className="font-medium">
              Conversation
            </span>

            <span className="text-xs text-muted-foreground">
                Direct Message
            </span>

            <span className="text-xs text-muted-foreground">
              Updated{" "}
              {new Date(
                conversation.updated_at
              ).toLocaleString()}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}