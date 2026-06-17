"use client";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center justify-center px-4 py-8">
      <div className="w-full rounded-2xl border border-red-900 bg-red-950/30 p-8 text-center">
        <h2 className="mb-3 font-serif text-2xl text-red-300">
          Feed Unavailable
        </h2>

        <p className="mb-6 text-sm text-red-200">
          {error.message ||
            "An unexpected error occurred while loading the society feed."}
        </p>

        <button
          onClick={reset}
          className="rounded-lg bg-red-700 px-5 py-2 text-sm text-white transition hover:bg-red-600"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}