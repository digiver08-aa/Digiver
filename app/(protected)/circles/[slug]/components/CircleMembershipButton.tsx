"use client";

import { useState } from "react";

import { usePersona } from "@/hooks/usePersona";
import { joinCircle } from "@/services/circles/joinCircle";
import { leaveCircle } from "@/services/circles/leaveCircle";

interface CircleMembershipButtonProps {
  circleId: string;
  ownerPersonaId: string;
  initialIsMember: boolean;
  initialMemberCount: number;
}

export default function CircleMembershipButton({
  circleId,
  ownerPersonaId,
  initialIsMember,
  initialMemberCount,
}: CircleMembershipButtonProps) {
  const { persona } = usePersona();
  const [isMember, setIsMember] = useState(initialIsMember);
  const [memberCount, setMemberCount] = useState(initialMemberCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwner = persona?.id === ownerPersonaId;

  async function handleToggle() {
    if (!persona || loading || isOwner) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isMember) {
        await leaveCircle(circleId, persona.id);
        setIsMember(false);
        setMemberCount((count) => Math.max(0, count - 1));
      } else {
        await joinCircle(circleId, persona.id);
        setIsMember(true);
        setMemberCount((count) => count + 1);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update circle membership.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:items-end">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {memberCount} members
        </span>

        <button
          type="button"
          onClick={() => void handleToggle()}
          disabled={loading || !persona || isOwner}
          aria-busy={loading}
          className="min-h-11 shrink-0 rounded-md border px-4 py-2 transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Updating..."
            : isOwner
              ? "Owner"
              : isMember
                ? "Leave Circle"
                : "Join Circle"}
        </button>
      </div>

      {error && (
        <p className="max-w-xs text-right text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
