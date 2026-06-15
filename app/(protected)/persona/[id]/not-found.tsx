export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="text-center">
        <h1 className="mb-3 text-2xl font-bold">
          Persona Not Found
        </h1>

        <p className="text-muted-foreground">
          The requested persona does not exist.
        </p>
      </div>
    </main>
  );
}