import {
  Card,
  Skeleton,
  Stack,
} from "@/components/ui";

export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-8">
      <Stack gap="lg">
        <Skeleton className="h-10 w-56" />

        <Card variant="glass">
          <Stack gap="md">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-16 w-40" />
            <Skeleton className="h-24 w-full" />
          </Stack>
        </Card>

        <Card variant="glass">
          <Stack gap="md">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-3 w-full" />
          </Stack>
        </Card>

        <Card variant="glass">
          <Stack gap="md">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-20 w-full"
              />
            ))}
          </Stack>
        </Card>
      </Stack>
    </main>
  );
}