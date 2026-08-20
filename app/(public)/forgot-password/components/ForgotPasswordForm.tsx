"use client";

import Link from "next/link";

import { useState } from "react";

import { authService } from "@/services/auth";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    setLoading(true);

    try {
      const result =
        await authService.resetPassword(normalizedEmail);

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(
        "Password reset email sent. Check your inbox."
      );

      setEmail("");
    } catch {
      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-3xl font-bold">
          Forgot Password
        </h1>

        <form
          onSubmit={handleSubmit}
          aria-describedby={error ? "forgot-password-status" : success ? "forgot-password-success" : undefined}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded border p-3"
              placeholder="Enter your email"
            />
          </div>

          {error && (
            <p id="forgot-password-status" role="alert" aria-live="assertive" className="text-sm text-red-500">
              {error}
            </p>
          )}

          {success && (
            <p id="forgot-password-success" role="status" aria-live="polite" className="text-sm text-green-500">
              {success}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Remembered your password? <Link href="/login" className="underline underline-offset-4">Log in</Link>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded border p-3"
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}