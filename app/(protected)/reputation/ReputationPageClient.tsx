"use client";

import { ReputationProvider } from "@/providers/ReputationProvider";

import type {
  Reputation,
  ReputationEvent,
} from "@/types/reputation.types";

import ReputationOverview from "./components/ReputationOverview";

interface ReputationPageClientProps {
  reputation: Reputation | null;
  history: ReputationEvent[];
  error?: string | null;
}

export default function ReputationPageClient({
  reputation,
  history,
  error = null,
}: ReputationPageClientProps) {
  return (
    <ReputationProvider
      initialReputation={reputation}
      initialHistory={history}
      initialError={error}
    >
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <ReputationOverview />
      </main>
    </ReputationProvider>
  );
}
