"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth";

export default function ResetPasswordForm() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await authService.updatePassword(
          password
        );

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess(
        "Password updated successfully."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError(
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-3xl font-bold">
          Reset Password
        </h1>

        <form
          onSubmit={handleSubmit}
          aria-describedby={error ? "reset-password-error" : success ? "reset-password-success" : undefined}
          className="space-y-4"
        >
          <label htmlFor="reset-password" className="sr-only">New Password</label>
          <input
            id="reset-password"
            type="password"
            placeholder="New Password"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded border p-3"
          />

          <label htmlFor="reset-confirm-password" className="sr-only">Confirm Password</label>
          <input
            id="reset-confirm-password"
            type="password"
            placeholder="Confirm Password"
            required
            minLength={8}
            autoComplete="new-password"
            disabled={loading}
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="w-full rounded border p-3"
          />

          {error && (
            <p id="reset-password-error" role="alert" aria-live="assertive" className="text-red-500">
              {error}
            </p>
          )}

          {success && (
            <p id="reset-password-success" role="status" aria-live="polite" className="text-green-500">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded border p-3"
          >
            {loading
              ? "Updating..."
              : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}