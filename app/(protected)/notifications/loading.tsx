// app/(protected)/notifications/loading.tsx

export default function Loading() {
  return (
    <div
      className="
        mx-auto
        max-w-4xl
      "
    >
      <div
        className="
          animate-pulse
          space-y-4
        "
      >
        <div
          className="
            h-8
            w-48
            rounded
            bg-muted
          "
        />

        <div
          className="
            h-96
            rounded-xl
            border
            bg-muted/40
          "
        />
      </div>
    </div>
  );
}