"use client";

import type { Conversation } from "@/types/message.types";

interface ConversationHeaderProps {
  conversation: Conversation;
}

export default function ConversationHeader({
  conversation,
}: ConversationHeaderProps) {
  return (
    <header className="border-b px-6 py-4">
      <div className="flex flex-col">
        <h2 className="font-semibold">
          Conversation
        </h2>

        <span className="text-xs text-muted-foreground">
          Private Conversation
        </span>

        <span className="text-xs text-muted-foreground">
          Created{" "}
          {new Date(
            conversation.created_at
          ).toLocaleString()}
        </span>
      </div>
    </header>
  );
}