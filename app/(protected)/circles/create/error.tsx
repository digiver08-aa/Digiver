"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-3xl items-center justify-center p-6">
      <div className="w-full rounded-lg border p-6">
        <h2 className="text-2xl font-semibold">
          Failed to Load Create Circle Page
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred while loading
          the circle creation page.
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre className="mt-4 overflow-auto rounded-md border p-3 text-xs">
            {error.message}
          </pre>
        )}

        <button
          type="button"
          onClick={() => reset()}
          className="mt-6 rounded-md border px-4 py-2"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}