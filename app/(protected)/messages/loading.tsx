export default function Loading() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-80 border-r">
        <div className="space-y-4 p-4">
          {Array.from({
            length: 8,
          }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <div className="h-20 animate-pulse border-b bg-muted" />

        <div className="flex-1 p-4">
          <div className="space-y-4">
            {Array.from({
              length: 10,
            }).map((_, index) => (
              <div
                key={index}
                className="h-12 animate-pulse rounded-md bg-muted"
              />
            ))}
          </div>
        </div>

        <div className="h-32 animate-pulse border-t bg-muted" />
      </div>
    </div>
  );
}