"use client";

// =====================================================
// DIGIVER
// PHASE 7 — MESSAGING SYSTEM
// MessageContext.tsx
// =====================================================

import {
  createContext,
  useContext,
} from "react";

import type {
  Conversation,
  Message,
  CreateConversationInput,
  SendMessageInput,
} from "@/types/message.types";

export interface MessageContextValue {
  conversations: Conversation[];
  messages: Message[];

  activeConversation: Conversation | null;

  loading: boolean;
  error: string | null;

  refreshConversations: () => Promise<void>;

  refreshMessages: (
    conversationId: string
  ) => Promise<void>;

  createConversation: (
    input: CreateConversationInput
  ) => Promise<void>;

  sendMessage: (
    input: SendMessageInput
  ) => Promise<void>;

  setActiveConversation: (
    conversation: Conversation | null
  ) => void;
}

export const MessageContext =
  createContext<MessageContextValue | null>(
    null
  );

export function useMessageContext() {
  const context =
    useContext(MessageContext);

  if (!context) {
    throw new Error(
      "useMessageContext must be used inside MessageProvider"
    );
  }

  return context;
}