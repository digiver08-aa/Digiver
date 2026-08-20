"use client";

import Link from "next/link";

import { useState } from "react";

import { authService } from "@/services/auth";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await authService.signUp({
          email: normalizedEmail,
          password,
        });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(true);

      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-md rounded-lg border p-8 text-center" role="status" aria-live="polite">
        <h1 className="mb-4 text-2xl font-bold">
          Account Created
        </h1>

        <p>
          Check your email for verification.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-lg border p-8">
      <h1 className="mb-6 text-2xl font-bold">
        Create Account
      </h1>

      <form
        onSubmit={handleSubmit}
        aria-describedby={error ? "signup-error" : undefined}
        className="space-y-4"
      >
        <label htmlFor="signup-email" className="sr-only">Email</label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded-md border p-3"
        />

        <label htmlFor="signup-password" className="sr-only">Password</label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full rounded-md border p-3"
        />

        <label htmlFor="signup-confirm-password" className="sr-only">Confirm Password</label>
        <input
          id="signup-confirm-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          className="w-full rounded-md border p-3"
        />

        {error && (
          <p id="signup-error" role="alert" aria-live="assertive" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <p className="text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="underline underline-offset-4">Log in</Link>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md border p-3"
        >
          {loading
            ? "Creating Account..."
            : "Create Account"}
        </button>
      </form>
    </div>
  );
}