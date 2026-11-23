
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const education = String(formData.get("education") || "");
    const careerInterest = String(formData.get("interest") || "");
    const skills = String(formData.get("skills") || "")
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const password = String(formData.get("password") || "");
    const confirmPassword = String(
      formData.get("confirmPassword") || ""
    );

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
          education,
          course: education,
          careerInterest,
          skills,
        }),
      });

      if (response.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        form.reset();

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto w-full max-w-2xl">

        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold">
            <span className="text-blue-500">AI</span> Career Guidance
          </Link>

          <h1 className="mt-8 text-3xl font-bold">
            Create Your Account
          </h1>

          <p className="mt-2 text-slate-400">
            Start your personalized career journey
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

          <form onSubmit={handleSignup} className="space-y-5">

            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
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

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label htmlFor="education" className="mb-2 block text-sm font-medium text-slate-300">
                  Education
                </label>
                <select
                  id="education"
                  name="education"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none focus:border-blue-500"
                >
                  <option value="">Select education</option>
                  <option value="school">School Student</option>
                  <option value="diploma">Diploma</option>
                  <option value="btech">B.Tech / B.E.</option>
                  <option value="bca">BCA</option>
                  <option value="bsc">B.Sc.</option>
                  <option value="mca">MCA</option>
                  <option value="msc">M.Sc.</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="interest" className="mb-2 block text-sm font-medium text-slate-300">
                  Career Interest
                </label>
                <select
                  id="interest"
                  name="interest"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-300 outline-none focus:border-blue-500"
                >
                  <option value="">Select interest</option>
                  <option value="software">Software Development</option>
                  <option value="ai">AI / Machine Learning</option>
                  <option value="data">Data Science</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="web">Web Development</option>
                  <option value="cloud">Cloud Computing</option>
                  <option value="other">Not Sure Yet</option>
                </select>
              </div>

            </div>

            <div>
              <label htmlFor="skills" className="mb-2 block text-sm font-medium text-slate-300">
                Current Skills
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="e.g. Python, C++, HTML, SQL"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                You can add multiple skills separated by commas.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  minLength={8}
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

            </div>

            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 accent-blue-600"
              />
              <label htmlFor="terms" className="text-sm leading-6 text-slate-400">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-950/50 p-3 text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="rounded-lg bg-green-950/50 p-3 text-sm text-green-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-blue-500 hover:text-blue-400">
              Sign in
            </Link>
          </p>

        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-300">
            ← Back to Home
          </Link>
        </div>

      </div>
    </main>
  );
}
