// =====================================================
// DIGIVER
// PHASE 7 — MESSAGING SYSTEM
// message.types.ts
// =====================================================

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;

  recipient_name?: string;
  recipient_slug?: string;
  recipient_avatar_url?: string;

  last_message?: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  persona_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_persona_id: string;
  content: string;
  created_at: string;
}

// =====================================================
// INPUTS
// =====================================================

export interface CreateConversationInput {
  participant_persona_ids: string[];
}

export interface SendMessageInput {
  conversation_id: string;
  sender_persona_id: string;
  content: string;
}

// =====================================================
// RESPONSES
// =====================================================

export interface ConversationResponse {
  success: boolean;
  conversation: Conversation;
  participants: ConversationParticipant[];
}

export interface ConversationsResponse {
  success: boolean;
  conversations: Conversation[];
}

export interface MessageResponse {
  success: boolean;
  message: Message;
}

export interface MessagesResponse {
  success: boolean;
  messages: Message[];
}