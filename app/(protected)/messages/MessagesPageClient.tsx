"use client";

import {
  useEffect,
} from "react";

import {
  MessageProvider,
} from "@/providers/MessageProvider";

import {
  useMessages,
} from "@/hooks/useMessages";

import type {
  Conversation,
} from "@/types/message.types";

import ConversationList from "./components/ConversationList";
import ConversationHeader from "./components/ConversationHeader";
import MessageList from "./components/MessageList";
import MessageComposer from "./components/MessageComposer";
import EmptyConversationState from "./components/EmptyConversationState";
import { usePersona } from "@/hooks/usePersona";

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
    error,
    setActiveConversation,
    sendMessage,
  } = useMessages();

  useEffect(() => {
    if (
      !activeConversation &&
      initialConversations.length > 0
    ) {
      setActiveConversation(
        initialConversations[0]
      );
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

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <aside className="w-80 shrink-0 border-r">
        <ConversationList
          conversations={
            conversationList
          }
          activeConversationId={
            activeConversation?.id
          }
          onSelect={
            setActiveConversation
          }
        />
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        {!activeConversation ? (
          <EmptyConversationState />
        ) : (
          <>
            <ConversationHeader
              conversation={
                activeConversation
              }
            />

            <div className="flex min-h-0 flex-1 flex-col">
              <MessageList
                messages={messages}
                currentPersonaId={
                  persona?.id ?? ""
                }
              />

              <MessageComposer
                onSend={async (
                  content
                ) => {
                  if (!persona) {
                    throw new Error(
                      "No active persona found"
                    );
                  }
                  await sendMessage({
                    conversation_id:
                      activeConversation.id,
                    sender_persona_id:
                      persona?.id ?? "",
                    content,
                  });
                }}
              />
            </div>
          </>
        )}

        {loading && (
          <div className="border-t px-4 py-2 text-xs text-muted-foreground">
            Loading...
          </div>
        )}

        {error && (
          <div className="border-t px-4 py-2 text-xs text-destructive">
            {error}
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
      <MessagesLayout
        initialConversations={
          initialConversations
        }
      />
    </MessageProvider>
  );
}