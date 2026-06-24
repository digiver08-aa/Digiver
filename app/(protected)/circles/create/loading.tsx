export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-64 rounded bg-muted" />

        <div className="h-12 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />
        <div className="h-32 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />
        <div className="h-12 rounded bg-muted" />

        <div className="h-12 w-40 rounded bg-muted" />
      </div>
    </div>
  );
}