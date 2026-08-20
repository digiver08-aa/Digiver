"use client";

import {
  FormEvent,
  useId,
  useMemo,
  useState,
} from "react";

const MAX_LENGTH = 2000;

interface MessageComposerProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export default function MessageComposer({
  onSend,
  disabled = false,
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const countId = useId();
  const errorId = useId();

  const remaining = useMemo(
    () => MAX_LENGTH - content.length,
    [content],
  );

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmed = content.trim();

    if (!trimmed || trimmed.length > MAX_LENGTH || sending || disabled) {
      return;
    }

    try {
      setSending(true);
      setSubmitError(null);
      await onSend(trimmed);
      setContent("");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Unable to send message. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  const isDisabled =
    disabled ||
    sending ||
    !content.trim() ||
    content.trim().length > MAX_LENGTH;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-3 sm:p-4"
      aria-label="Send a message"
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="message-composer" className="sr-only">
          Message
        </label>
        <textarea
          id="message-composer"
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
            if (submitError) {
              setSubmitError(null);
            }
          }}
          maxLength={MAX_LENGTH}
          aria-describedby={
            submitError ? `${countId} ${errorId}` : countId
          }
          aria-invalid={submitError ? true : undefined}
          disabled={disabled || sending}
          rows={3}
          placeholder="Type a message..."
          className="min-h-11 flex-1 resize-none rounded-md border bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isDisabled}
          className="min-h-11 shrink-0 rounded-md border px-4 py-2 font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:self-end"
          aria-disabled={isDisabled}
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>

      <div
        id={countId}
        className="mt-2 text-xs text-muted-foreground"
        aria-live="polite"
      >
        {remaining} characters remaining
      </div>

      {submitError && (
        <p
          id={errorId}
          className="mt-2 text-sm text-destructive"
          role="alert"
        >
          {submitError}
        </p>
      )}
    </form>
  );
}
