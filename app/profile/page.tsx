
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  course?: string;
  education?: string;
  careerInterest?: string;
  skills?: string[];
  experience?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [education, setEducation] = useState("");
  const [careerInterest, setCareerInterest] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("Beginner");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await apiRequest("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.success || !response.user) {
          throw new Error("Unable to load profile.");
        }

        const data: User = response.user;

        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
        setEducation(data.education || data.course || "");
        setCareerInterest(data.careerInterest || "");
        setSkills((data.skills || []).join(", "));
        setExperience(data.experience || "Beginner");

      } catch (error) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Update profile in MongoDB
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const response = await apiRequest("/api/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          education,
          careerInterest,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          experience,
        }),
      });

      if (!response.success || !response.user) {
        throw new Error(response.message || "Profile update failed.");
      }

      setUser(response.user);
      setMessage("Profile updated successfully!");

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="text-xl font-bold">
            <span className="text-blue-500">AI</span> Career Guidance
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">
              My Profile
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
              {name.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-6 py-10">

        <Link
          href="/dashboard"
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          ← Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8 mt-6">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="mt-2 text-slate-400">
            Manage your personal information and career preferences.
          </p>
        </div>

        {/* Profile Header */}
        <section className="mb-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold">
              {name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">{name}</h2>
              <p className="mt-1 text-slate-400">{education}</p>
              <p className="mt-1 text-sm text-blue-400">
                {careerInterest || "No career interest selected"}
              </p>
            </div>
          </div>
        </section>

        {/* Profile Form */}
        <form onSubmit={handleSave}>
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your details to improve career recommendations.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Full Name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-slate-400"
                />
              </div>

              {/* Education */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Education
                </label>
                <input
                  required
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Career Interest */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Career Interest
                </label>
                <select
                  required
                  value={careerInterest}
                  onChange={(e) => setCareerInterest(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Select Career</option>
                  <option>AI / ML Engineer</option>
                  <option>Software Engineer</option>
                  <option>Data Scientist</option>
                  <option>Data Analyst</option>
                  <option>Web Developer</option>
                  <option>Cloud Engineer</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Experience Level
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              {/* Skills */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-slate-300">
                  Skills
                </label>
                <textarea
                  rows={4}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Python, Machine Learning, Data Structures"
                  className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Separate multiple skills using commas.
                </p>
              </div>

            </div>

            {/* Status */}
            <div className="mt-6">
              {message && (
                <p className="mb-3 text-sm text-green-400">
                  ✓ {message}
                </p>
              )}

              {error && (
                <p className="mb-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </section>
        </form>

        {/* Career Summary */}
        <section className="mt-6 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Target Career</p>
            <p className="mt-2 font-semibold text-blue-400">
              {careerInterest || "Not selected"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Experience</p>
            <p className="mt-2 font-semibold">{experience}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-500">Education</p>
            <p className="mt-2 font-semibold">{education}</p>
          </div>

        </section>

      </div>
    </main>
  );
}
