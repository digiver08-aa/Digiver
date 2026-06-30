import { getConversations } from "@/services/messages";

import MessagesPageClient from "././MessagesPageClient";

export default async function MessagesPage() {
  const response =
    await getConversations();

  return (
    <MessagesPageClient
      initialConversations={
        response.conversations
      }
    />
  );
}