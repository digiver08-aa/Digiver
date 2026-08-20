"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

import { MessageProvider } from "@/providers/MessageProvider";
import { useMessages } from "@/hooks/useMessages";
import type { Conversation } from "@/types/message.types";
import { usePersona } from "@/hooks/usePersona";

import ConversationList from "./components/ConversationList";
import ConversationHeader from "./components/ConversationHeader";
import MessageList from "./components/MessageList";
import MessageComposer from "./components/MessageComposer";
import EmptyConversationState from "./components/EmptyConversationState";

interface MessagesPageClientProps {
  initialConversations: Conversation[];
}

function MessagesLayout({
  initialConversations,
}: MessagesPageClientProps) {
  const {
    conversations,
    activeConversation,
    messages,
    loading,
    sending,
    error,
    setActiveConversation,
    refreshMessages,
    sendMessage,
  } = useMessages();

  useEffect(() => {
    if (!activeConversation && initialConversations.length > 0) {
      setActiveConversation(initialConversations[0]);
    }
  }, [
    activeConversation,
    initialConversations,
    setActiveConversation,
  ]);

  const conversationList =
    conversations.length > 0
      ? conversations
      : initialConversations;

  const { persona } = usePersona();

  const showConversationPanel =
    activeConversation !== null ||
    conversationList.length === 0;

  const isMessageLoading =
    loading && activeConversation !== null;

  return (
    <div className="flex min-h-[calc(100dvh-11rem)] overflow-hidden md:h-[calc(100dvh-5rem)] md:min-h-0">
      <aside
        className={
          showConversationPanel
            ? "hidden md:block md:w-80 md:shrink-0 md:border-r"
            : "w-full shrink-0 border-r md:w-80"
        }
        aria-label="Conversation list"
      >
        <ConversationList
          conversations={conversationList}
          activeConversationId={activeConversation?.id}
          onSelect={setActiveConversation}
          loading={loading && conversations.length === 0 && initialConversations.length === 0}
        />
      </aside>

      <section
        className={
          showConversationPanel
            ? "flex min-w-0 flex-1 flex-col"
            : "hidden min-w-0 flex-1 flex-col md:flex"
        }
        aria-label="Messages"
      >
        {!activeConversation ? (
          <EmptyConversationState />
        ) : (
          <>
            <ConversationHeader
              conversation={activeConversation}
              onBack={() => setActiveConversation(null)}
            />

            <div className="flex min-h-0 flex-1 flex-col">
              <MessageList
                messages={messages}
                currentPersonaId={persona?.id ?? ""}
                loading={isMessageLoading}
              />

              <MessageComposer
                disabled={!persona || sending}
                onSend={async (content) => {
                  if (!persona) {
                    throw new Error("No active persona found.");
                  }

                  await sendMessage({
                    conversation_id: activeConversation.id,
                    sender_persona_id: persona.id,
                    content,
                  });
                }}
              />
            </div>
          </>
        )}

        {error && (
          <div
            className="flex items-start gap-3 border-t px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1">
              <p>{error}</p>
              {activeConversation && (
                <button
                  type="button"
                  onClick={() =>
                    void refreshMessages(activeConversation.id)
                  }
                  className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <RefreshCw
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  />
                  Retry
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default function MessagesPageClient({
  initialConversations,
}: MessagesPageClientProps) {
  return (
    <MessageProvider>
      <MessagesLayout initialConversations={initialConversations} />
    </MessageProvider>
  );
}
