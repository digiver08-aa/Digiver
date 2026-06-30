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
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="max-w-md text-center">
        <h2 className="text-xl font-semibold">
          Messages Failed To Load
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-md border px-4 py-2"
        >
          Retry
        </button>
      </div>
    </div>
  );
}