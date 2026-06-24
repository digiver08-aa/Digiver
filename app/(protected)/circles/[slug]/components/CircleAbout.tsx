interface CircleAboutProps {
  description: string | null;
  createdAt?: string;
}

export default function CircleAbout({
  description,
  createdAt,
}: CircleAboutProps) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-4 text-xl font-semibold">
        About
      </h2>

      <p className="whitespace-pre-wrap text-sm text-muted-foreground">
        {description ??
          "No description available."}
      </p>

      {createdAt && (
        <div className="mt-4 text-sm text-muted-foreground">
          Created{" "}
          {new Date(
            createdAt,
          ).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}