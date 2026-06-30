"use client";

// =====================================================
// DIGIVER
// PHASE 7 — MESSAGING SYSTEM
// useMessages.ts
// =====================================================

import {
  useMessageContext,
} from "@/context/MessageContext";

export function useMessages() {
  return useMessageContext();
}