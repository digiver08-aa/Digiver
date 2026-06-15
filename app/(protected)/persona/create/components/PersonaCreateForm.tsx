"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createPersona } from "@/services/personas/client";

const SLUG_REGEX = /^[a-z0-9-]+$/;

export function PersonaCreateForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const trimmedName = name.trim();
    const trimmedSlug = slug.trim().toLowerCase();
    const trimmedTitle = title.trim();
    const trimmedBio = bio.trim();
    const trimmedAvatarUrl = avatarUrl.trim();
    const trimmedBannerUrl = bannerUrl.trim();

    if (!trimmedName) {
      setError("Name is required.");
      return;
    }

    if (trimmedName.length < 2) {
      setError(
        "Name must be at least 2 characters long."
      );
      return;
    }

    if (trimmedName.length > 64) {
      setError(
        "Name must be 64 characters or fewer."
      );
      return;
    }

    if (!trimmedSlug) {
      setError("Slug is required.");
      return;
    }

    if (trimmedSlug.length < 3) {
      setError(
        "Slug must be at least 3 characters long."
      );
      return;
    }

    if (trimmedSlug.length > 64) {
      setError(
        "Slug must be 64 characters or fewer."
      );
      return;
    }

    if (!SLUG_REGEX.test(trimmedSlug)) {
      setError(
        "Slug may only contain lowercase letters, numbers, and hyphens."
      );
      return;
    }

    if (trimmedBio.length > 500) {
      setError(
        "Bio must be 500 characters or fewer."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createPersona({
        name: trimmedName,
        slug: trimmedSlug,
        title: trimmedTitle || undefined,
        bio: trimmedBio || undefined,
        avatarUrl:
          trimmedAvatarUrl || undefined,
        bannerUrl:
          trimmedBannerUrl || undefined,
        isPublic,
      });

      if (!response.success || !response.data) {
        setError(response.message);
        return;
      }

      router.push(
        `/persona/${response.data.id}`
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create persona."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border p-6"
    >
      {error && (
        <div className="rounded-md border border-destructive p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="text-sm font-medium"
        >
          Name *
        </label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Dark Scholar"
          maxLength={64}
          className="w-full rounded-md border px-3 py-2"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="slug"
          className="text-sm font-medium"
        >
          Slug *
        </label>

        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) =>
            setSlug(
              e.target.value.toLowerCase()
            )
          }
          placeholder="dark-scholar"
          maxLength={64}
          className="w-full rounded-md border px-3 py-2"
          required
        />

        <p className="text-xs text-muted-foreground">
          Lowercase letters, numbers, and
          hyphens only.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="text-sm font-medium"
        >
          Title
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Keeper of Forbidden Knowledge"
          maxLength={128}
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bio"
          className="text-sm font-medium"
        >
          Bio
        </label>

        <textarea
          id="bio"
          rows={4}
          value={bio}
          onChange={(e) =>
            setBio(e.target.value)
          }
          placeholder="Describe your persona..."
          maxLength={500}
          className="w-full rounded-md border px-3 py-2"
        />

        <div className="text-xs text-muted-foreground">
          {bio.length}/500
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="avatarUrl"
          className="text-sm font-medium"
        >
          Avatar URL
        </label>

        <input
          id="avatarUrl"
          type="url"
          value={avatarUrl}
          onChange={(e) =>
            setAvatarUrl(e.target.value)
          }
          placeholder="https://example.com/avatar.jpg"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="bannerUrl"
          className="text-sm font-medium"
        >
          Banner URL
        </label>

        <input
          id="bannerUrl"
          type="url"
          value={bannerUrl}
          onChange={(e) =>
            setBannerUrl(e.target.value)
          }
          placeholder="https://example.com/banner.jpg"
          className="w-full rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic}
          onChange={(e) =>
            setIsPublic(
              e.target.checked
            )
          }
        />

        <label
          htmlFor="isPublic"
          className="text-sm font-medium"
        >
          Public Persona
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md border px-4 py-2 font-medium disabled:opacity-50"
      >
        {isSubmitting
          ? "Creating Persona..."
          : "Create Persona"}
      </button>
    </form>
  );
}