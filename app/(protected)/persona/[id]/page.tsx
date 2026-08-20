/* eslint-disable @next/next/no-img-element */

import { notFound } from "next/navigation";

import { getPersonaById } from "@/services/personas/server";

interface PersonaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PersonaPage({
  params,
}: PersonaPageProps) {
  const { id } = await params;

  const response = await getPersonaById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const persona = response.data;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <section className="overflow-hidden rounded-2xl border bg-card">
        <div className="relative h-36 w-full sm:h-48">
          {persona.bannerUrl ? (
            <>
              {/* User-provided image URLs cannot be constrained to a fixed next/image host. */}
              <img
                src={persona.bannerUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </>
          ) : (
            <div className="h-full w-full bg-linear-to-r from-slate-900 via-slate-800 to-slate-900" />
          )}
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border bg-muted">
              {persona.avatarUrl ? (
                <>
                  {/* User-provided image URLs cannot be constrained to a fixed next/image host. */}
                      <img
                    src={persona.avatarUrl}
                    alt={persona.name}
                    className="h-full w-full object-cover"
                  />
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold">
                  {persona.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold sm:text-3xl">
                {persona.name}
              </h1>

              {persona.title && (
                <p className="mt-1 text-lg text-muted-foreground">
                  {persona.title}
                </p>
              )}
            </div>
          </div>

          {persona.bio && (
            <div className="mt-8">
              <h2 className="mb-2 text-lg font-semibold">
                Biography
              </h2>

              <p className="wrap-break-word whitespace-pre-wrap text-muted-foreground">
                {persona.bio}
              </p>
            </div>
          )}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-semibold">
                Persona ID
              </h3>

              <p className="break-all text-sm text-muted-foreground">
                {persona.id}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-semibold">
                Slug
              </h3>

              <p className="text-sm text-muted-foreground">
                {persona.slug}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-semibold">
                Visibility
              </h3>

              <p className="text-sm text-muted-foreground">
                {persona.isPublic ? "Public" : "Private"}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-semibold">
                Status
              </h3>

              <p className="text-sm text-muted-foreground">
                {persona.isActive ? "Active" : "Inactive"}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-semibold">
                Created
              </h3>

              <p className="text-sm text-muted-foreground">
                {new Date(persona.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="mb-2 font-semibold">
                Updated
              </h3>

              <p className="text-sm text-muted-foreground">
                {new Date(persona.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}