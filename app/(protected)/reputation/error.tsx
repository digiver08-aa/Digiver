"use client";

import { useEffect } from "react";

import { AlertTriangle } from "lucide-react";

import {
  Button,
  Card,
  Stack,
} from "@/components/ui";

interface ErrorProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center justify-center px-6 py-10">
      <Card
        variant="glass"
        className="w-full"
      >
        <Stack
          gap="lg"
          className="items-center text-center"
        >
          <AlertTriangle
            className="h-12 w-12 text-destructive"
            aria-hidden="true"
          />

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
              Unable to load reputation
            </h1>

            <p className="text-sm text-muted-foreground">
              An unexpected error occurred while
              loading your reputation information.
            </p>
          </div>

          <Button
            onClick={reset}
            variant="primary"
          >
            Try Again
          </Button>
        </Stack>
      </Card>
    </main>
  );
}