"use client";

import { MessageSquare } from "lucide-react";

export default function EmptyConversationState() {
  return (
    <div className="flex h-full items-center justify-center p-6 text-center">
      <div className="max-w-sm">
        <MessageSquare
          className="mx-auto h-10 w-10 text-muted-foreground"
          aria-hidden="true"
        />
        <h2 className="mt-3 text-lg font-semibold">
          Select a conversation
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a conversation from the list to view messages.
        </p>
      </div>
    </div>
  );
}
