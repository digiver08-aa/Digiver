"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ExploreErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ExploreError({
  error,
  reset,
}: ExploreErrorProps) {
  return (
    <main
      className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center px-4 py-12 sm:px-6 lg:px-8"
      role="alert"
    >
      <section
        className="
          w-full
          rounded-2xl
          border
          border-border
          bg-card
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-destructive/10
            "
            aria-hidden="true"
          >
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold">
              Something went wrong
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Explore could not be loaded right now. Please try again.
            </p>

            {process.env.NODE_ENV === "development" &&
              error.message && (
                <details className="mt-4 rounded-xl border border-border bg-background p-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    Development error details
                  </summary>

                  <pre className="mt-3 overflow-x-auto whitespace-pre-wrap wrap-break-word text-xs leading-5 text-muted-foreground">
                    {error.message}
                  </pre>
                </details>
              )}

            <button
              type="button"
              onClick={reset}
              className="
                mt-6
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary
                px-5
                text-sm
                font-medium
                text-primary-foreground
                transition-colors
                hover:bg-primary/90
                focus:outline-none
                focus:ring-2
                focus:ring-primary/20
              "
            >
              <RotateCcw
                className="h-4 w-4"
                aria-hidden="true"
              />

              Try again
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}