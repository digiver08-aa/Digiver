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
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        py-12
        text-center
      "
    >
      <h2
        className="
          text-lg
          font-semibold
        "
      >
        Failed to load notifications
      </h2>

      <p
        className="
          mt-2
          text-sm
          text-muted-foreground
        "
      >
        Please try again.
      </p>

      <button
        type="button"
        onClick={reset}
        className="
          mt-4
          rounded-md
          border
          px-4
          py-2
        "
      >
        Retry
      </button>
    </div>
  );
}