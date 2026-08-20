"use client";

import { ArrowLeft } from "lucide-react";

import type { Conversation } from "@/types/message.types";

interface ConversationHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
}

export default function ConversationHeader({
  conversation,
  onBack,
}: ConversationHeaderProps) {
  return (
    <header className="border-b px-4 py-4 sm:px-6">
      <div className="flex min-w-0 items-start gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to conversations"
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md border md:hidden"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        <div className="flex min-w-0 flex-col">
          <h2 className="font-semibold">
            Conversation
          </h2>

          <span className="text-xs text-muted-foreground">
            Private Conversation
          </span>

          <span className="break-words text-xs text-muted-foreground">
            Created{" "}
            {new Date(
              conversation.created_at
            ).toLocaleString()}
          </span>
        </div>
      </div>
    </header>
  );
}