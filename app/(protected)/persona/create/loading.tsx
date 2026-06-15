export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-64 rounded bg-muted" />
        <div className="h-4 w-96 rounded bg-muted" />
        <div className="h-125 rounded bg-muted" />
      </div>
    </div>
  );
}