"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createCircle } from "@/services/circles/createCircle";

interface CircleCreateFormProps {
  ownerPersonaId: string;
}

export default function CircleCreateForm({
  ownerPersonaId,
}: CircleCreateFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setError("");
      setIsSubmitting(true);

      const circle = await createCircle({
        owner_persona_id: ownerPersonaId,
        name,
        slug,
        description: description || null,
        avatar_url: avatarUrl || null,
        banner_url: bannerUrl || null,
      });

      router.push(`/circles/${circle.slug}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create circle.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-medium"
        >
          Name
        </label>

        <input
          id="name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => {
            const value = e.target.value;

            setName(value);

            if (!slug) {
              setSlug(generateSlug(value));
            }
          }}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-2 block text-sm font-medium"
        >
          Slug
        </label>

        <input
          id="slug"
          type="text"
          required
          value={slug}
          onChange={(e) =>
            setSlug(generateSlug(e.target.value))
          }
          className="w-full rounded-md border px-3 py-2"
        />

        <p className="mt-1 text-xs text-muted-foreground">
          Lowercase letters, numbers, and hyphens only.
        </p>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium"
        >
          Description
        </label>

        <textarea
          id="description"
          rows={5}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="avatar"
          className="mb-2 block text-sm font-medium"
        >
          Avatar URL
        </label>

        <input
          id="avatar"
          type="url"
          value={avatarUrl}
          onChange={(e) =>
            setAvatarUrl(e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div>
        <label
          htmlFor="banner"
          className="mb-2 block text-sm font-medium"
        >
          Banner URL
        </label>

        <input
          id="banner"
          type="url"
          value={bannerUrl}
          onChange={(e) =>
            setBannerUrl(e.target.value)
          }
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-500 p-3 text-sm text-red-500">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border px-4 py-2"
      >
        {isSubmitting
          ? "Creating..."
          : "Create Circle"}
      </button>
    </form>
  );
}