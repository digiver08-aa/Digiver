export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-48 rounded-xl bg-muted" />

        <div className="h-24 rounded-xl bg-muted" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="h-40 rounded-xl bg-muted" />
            <div className="h-40 rounded-xl bg-muted" />
            <div className="h-96 rounded-xl bg-muted" />
          </div>

          <div className="space-y-6">
            <div className="h-48 rounded-xl bg-muted" />
            <div className="h-64 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}