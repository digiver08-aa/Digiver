"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  console.error(error);

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="mb-3 text-2xl font-bold">
          Failed to Load Persona
        </h1>

        <p className="mb-6 text-muted-foreground">
          Something went wrong while retrieving the
          persona profile.
        </p>

        <button
          onClick={reset}
          className="rounded-lg border px-4 py-2"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}