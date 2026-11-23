
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    const formData = new FormData(e.currentTarget);

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      setLoading(true);

      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.success && response.token) {
        // Store token according to Remember Me selection
        if (rememberMe) {
          localStorage.setItem("token", response.token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", response.token);
          localStorage.removeItem("token");
        }

        // Store user information
        sessionStorage.setItem(
          "user",
          JSON.stringify(response.user)
        );

        router.push("/dashboard");
      } else {
        setError(response.message || "Login failed.");
      }

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-blue-500">AI</span> Career Guidance
          </Link>

          <h1 className="mt-8 text-3xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-2 text-slate-400">
            Sign in to continue your career journey
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <span className="text-sm text-slate-500">
                  Forgot password?
                </span>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-blue-600"
              />

              <label
                htmlFor="remember"
                className="text-sm text-slate-400"
              >
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-950/50 p-3 text-sm text-red-400"
              >
                {error}
              </p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          {/* Sign Up */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Do not have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Create account
            </Link>
          </p>

        </div>

        {/* Back */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-300"
          >
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
