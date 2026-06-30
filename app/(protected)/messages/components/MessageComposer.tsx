"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";

const MAX_LENGTH = 2000;

interface MessageComposerProps {
  onSend: (
    content: string
  ) => Promise<void>;
}

export default function MessageComposer({
  onSend,
}: MessageComposerProps) {
  const [content, setContent] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const remaining = useMemo(
    () => MAX_LENGTH - content.length,
    [content]
  );

  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    const trimmed =
      content.trim();

    if (!trimmed) {
      return;
    }

    if (
      trimmed.length > MAX_LENGTH
    ) {
      return;
    }

    try {
      setSending(true);

      await onSend(trimmed);

      setContent("");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-4"
    >
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) =>
            setContent(
              e.target.value
            )
          }
          maxLength={MAX_LENGTH}
          rows={3}
          placeholder="Type a message..."
          className="flex-1 resize-none rounded-md border p-3"
        />

        <button
          type="submit"
          disabled={
            sending ||
            !content.trim()
          }
          className="rounded-md border px-4 py-2"
        >
          Send
        </button>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        {remaining} characters remaining
      </div>
    </form>
  );
}