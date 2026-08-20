"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { MessageContext } from "@/context/MessageContext";

import type {
  Conversation,
  Message,
  CreateConversationInput,
  SendMessageInput,
} from "@/types/message.types";

import {
  createConversation as createConversationService,
  getConversations,
  getMessages,
  sendMessage as sendMessageService,
  subscribeToConversation,
  unsubscribeFromConversation,
} from "@/services/messages";

interface Props {
  children: React.ReactNode;
}

export function MessageProvider({ children }: Props) {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversationState] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribedConversationRef =
    useRef<string | null>(null);

  const refreshConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getConversations();
      setConversations(response.conversations);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load conversations.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMessages = useCallback(
    async (conversationId: string) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getMessages(conversationId);
        setMessages(response.messages);
      } catch (err) {
        setMessages([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load messages.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const createConversation = useCallback(
    async (input: CreateConversationInput) => {
      try {
        setLoading(true);
        setError(null);

        const response =
          await createConversationService(input);

        setConversations((previous) => [
          response.conversation,
          ...previous,
        ]);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create conversation.",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (input: SendMessageInput) => {
      try {
        setSending(true);
        setError(null);

        const response =
          await sendMessageService(input);

        setMessages((previous) => [
          ...previous,
          response.message,
        ]);

        await refreshConversations();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to send message.",
        );
        throw err;
      } finally {
        setSending(false);
      }
    },
    [refreshConversations],
  );

  const setActiveConversation = useCallback(
    (conversation: Conversation | null) => {
      setError(null);

      if (!conversation) {
        setMessages([]);
      } else if (
        activeConversation?.id !== conversation.id
      ) {
        setMessages([]);
      }

      setActiveConversationState(conversation);
    },
    [activeConversation?.id],
  );

  useEffect(() => {
    queueMicrotask(() => {
      void refreshConversations();
    });
  }, [refreshConversations]);

  useEffect(() => {
    const conversationId = activeConversation?.id;

    if (!conversationId) {
      return;
    }

    queueMicrotask(() => {
      void refreshMessages(conversationId);
    });

    if (
      subscribedConversationRef.current &&
      subscribedConversationRef.current !== conversationId
    ) {
      unsubscribeFromConversation(
        subscribedConversationRef.current,
      );
    }

    subscribeToConversation(
      conversationId,
      async () => {
        await refreshMessages(conversationId);
        await refreshConversations();
      },
    );

    subscribedConversationRef.current = conversationId;

    return () => {
      unsubscribeFromConversation(conversationId);
      subscribedConversationRef.current = null;
    };
  }, [
    activeConversation?.id,
    refreshMessages,
    refreshConversations,
  ]);

  const value = useMemo(
    () => ({
      conversations,
      messages,
      activeConversation,
      loading,
      sending,
      error,
      refreshConversations,
      refreshMessages,
      createConversation,
      sendMessage,
      setActiveConversation,
    }),
    [
      conversations,
      messages,
      activeConversation,
      loading,
      sending,
      error,
      refreshConversations,
      refreshMessages,
      createConversation,
      sendMessage,
      setActiveConversation,
    ],
  );

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}
