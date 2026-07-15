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
}

export default function ReputationPageClient({
  reputation,
  history,
}: ReputationPageClientProps) {
  return (
    <ReputationProvider
      initialReputation={reputation}
      initialHistory={history}
    >
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <ReputationOverview />
      </main>
    </ReputationProvider>
  );
}