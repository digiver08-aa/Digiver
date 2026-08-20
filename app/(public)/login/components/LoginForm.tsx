"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result =
        await authService.signIn({
          email: normalizedEmail,
          password,
        });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError(
        "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={error ? "login-error" : undefined}
      className="flex flex-col gap-4"
    >
      <h1 className="text-2xl font-semibold">
        Login
      </h1>

      {error ? (
        <p id="login-error" role="alert" aria-live="assertive" className="text-sm text-red-500">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-2">
        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          disabled={isSubmitting}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          className="rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password">
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          disabled={isSubmitting}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
          className="rounded-md border px-3 py-2"
        />
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <Link href="/forgot-password" className="underline underline-offset-4">
          Forgot your password?
        </Link>
        <span className="text-muted-foreground">
          New to Digiver? <Link href="/signup" className="underline underline-offset-4">Create an account</Link>
        </span>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md border px-4 py-2"
      >
        {isSubmitting
          ? "Signing In..."
          : "Login"}
      </button>
    </form>
  );
}