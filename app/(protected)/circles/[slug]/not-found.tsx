import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-xl border p-6 text-center">
        <h1 className="text-3xl font-bold">
          Circle Not Found
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          The circle you are looking for does not
          exist or may have been removed.
        </p>

        <Link
          href="/circles"
          className="mt-6 inline-flex rounded-md border px-4 py-2"
        >
          Browse Circles
        </Link>
      </div>
    </div>
  );
}