
"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
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
};

type AssessmentResult = {
  score: number;
  total: number;
  percentage: number;
};

type Career = {
  title: string;
  match: number;
  description: string;
  skills: string[];
  category: string;
};

type SavedRecommendation = {
  recommendations?: Career[];
  topMatch?: number;
};

type SavedRoadmap = {
  career?: string;
  completed?: number[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [assessment, setAssessment] =
    useState<AssessmentResult | null>(null);

  const [recommendations, setRecommendations] =
    useState<Career[]>([]);

  const [careerMatch, setCareerMatch] =
    useState<number | null>(null);

  const [roadmapProgress, setRoadmapProgress] =
    useState<number | null>(null);

  const [resumeScore] = useState<number | null>(null);

  // 1. Fetch logged-in user's profile
  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await apiRequest(
          "/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.success && response.user) {
          if (isMounted) {
            setUser(response.user);
          }
        } else {
          throw new Error("Unable to load profile");
        }
      } catch {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");

        router.replace("/login");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // 2. Load dashboard data
  const loadDashboardData = useCallback(() => {
    if (!user) return;

    // Skill Assessment
    try {
      const savedAssessment =
        localStorage.getItem("assessmentResult");

      if (savedAssessment) {
        const parsed: AssessmentResult =
          JSON.parse(savedAssessment);

        if (
          typeof parsed.score === "number" &&
          typeof parsed.total === "number" &&
          parsed.total > 0 &&
          typeof parsed.percentage === "number"
        ) {
          setAssessment(parsed);
        } else {
          setAssessment(null);
        }
      } else {
        setAssessment(null);
      }
    } catch {
      setAssessment(null);
    }

    // Career Recommendations
    try {
      const savedCareer = localStorage.getItem(
        `careerRecommendation_${user.id}`
      );

      if (savedCareer) {
        const parsed: SavedRecommendation =
          JSON.parse(savedCareer);

        if (
          Array.isArray(parsed.recommendations) &&
          parsed.recommendations.length > 0
        ) {
          setRecommendations(parsed.recommendations);

          const highestMatch = Math.max(
            ...parsed.recommendations.map(
              (career) => Number(career.match) || 0
            )
          );

          setCareerMatch(
            typeof parsed.topMatch === "number"
              ? parsed.topMatch
              : highestMatch
          );
        } else {
          setRecommendations([]);
          setCareerMatch(null);
        }
      } else {
        setRecommendations([]);
        setCareerMatch(null);
      }
    } catch {
      setRecommendations([]);
      setCareerMatch(null);
    }

    // Roadmap Progress
    try {
      const roadmapKey = `roadmap_${user.id}`;

      const savedRoadmap =
        localStorage.getItem(roadmapKey);

      if (savedRoadmap) {
        const parsed: SavedRoadmap =
          JSON.parse(savedRoadmap);

        const completed = parsed.completed;
        const totalSteps = 5;

        if (
          parsed.career &&
          Array.isArray(completed)
        ) {
          const validCompleted = completed.filter(
            (index) =>
              Number.isInteger(index) &&
              index >= 0 &&
              index < totalSteps
          );

          // Avoid counting duplicate completed steps
          const uniqueCompleted = new Set(validCompleted);

          const progress = Math.round(
            (uniqueCompleted.size / totalSteps) * 100
          );

          setRoadmapProgress(progress);
        } else {
          setRoadmapProgress(null);
        }
      } else {
        setRoadmapProgress(null);
      }
    } catch {
      setRoadmapProgress(null);
    }
  }, [user]);

  // 3. Refresh dashboard data
  useEffect(() => {
    if (!user) return;

    // Schedule initial storage read after effect setup
    const timeoutId = window.setTimeout(() => {
      loadDashboardData();
    }, 0);

    const handleUpdate = () => {
      loadDashboardData();
    };

    window.addEventListener("focus", handleUpdate);

    window.addEventListener(
      "roadmapProgressUpdated",
      handleUpdate
    );

    window.addEventListener("storage", handleUpdate);

    return () => {
      window.clearTimeout(timeoutId);

      window.removeEventListener("focus", handleUpdate);

      window.removeEventListener(
        "roadmapProgressUpdated",
        handleUpdate
      );

      window.removeEventListener("storage", handleUpdate);
    };
  }, [user, loadDashboardData]);

  // 4. Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    localStorage.removeItem("user");
    sessionStorage.removeItem("user");

    router.replace("/login");
  };

  // 5. Profile Completion
  const profileCompletion = user
    ? Math.round(
        ([
          user.name,
          user.email,
          user.course || user.education,
          user.careerInterest,
          user.skills?.length ? "skills" : "",
        ].filter(Boolean).length /
          5) *
          100
      )
    : 0;

  // Loading screen
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <header className="border-b border-slate-800 bg-slate-950">
        <div className="flex h-16 items-center justify-between px-6">

          <Link href="/" className="text-xl font-bold">
            <span className="text-blue-500">AI</span>{" "}
            Career Guidance
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium">
                {user.name}
              </p>

              <p className="text-xs text-slate-500">
                {user.course || user.education || "Student"}
              </p>
            </div>
          </div>

        </div>
      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside className="hidden min-h-[calc(100vh-4rem)] w-64 border-r border-slate-800 bg-slate-950 p-4 md:block">

          <nav className="space-y-2">

            <Link
              href="/dashboard"
              className="block rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium"
            >
              Dashboard
            </Link>

            <Link
              href="/career-recommendation"
              className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              Career Recommendation
            </Link>

            <Link
              href="/skill-assessment"
              className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              Skill Assessment
            </Link>

            <Link
              href="/roadmap"
              className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              Learning Roadmap
            </Link>

            <Link
              href="/resume-builder"
              className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              Resume Builder
            </Link>

            <Link
              href="/chatbot"
              className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              AI Career Chat
            </Link>

            <Link
              href="/profile"
              className="block rounded-lg px-4 py-3 text-sm text-slate-400 hover:bg-slate-900 hover:text-white"
            >
              Profile
            </Link>

          </nav>

          <div className="mt-8 border-t border-slate-800 pt-6">

            <Link
              href="/"
              className="block rounded-lg px-4 py-3 text-sm text-slate-500 hover:bg-slate-900 hover:text-white"
            >
              ← Back to Home
            </Link>

            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-lg px-4 py-3 text-left text-sm text-slate-500 hover:bg-slate-900 hover:text-white"
            >
              Logout
            </button>

          </div>
        </aside>

        {/* Main Content */}
        <section className="w-full p-6 md:p-8">

          {/* Welcome */}
          <div className="mb-8">
            <p className="text-sm font-medium text-blue-500">
              Your Career Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Welcome back, {user.name}!
            </h1>

            <p className="mt-2 text-slate-400">
              Track your career progress and discover your next opportunity.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="Career Match"
              value={
                careerMatch !== null
                  ? `${careerMatch}%`
                  : "Not available"
              }
              description={
                careerMatch !== null
                  ? "Based on your career recommendations"
                  : "Generate career recommendations first"
              }
            />

            <StatCard
              title="Skill Progress"
              value={
                assessment
                  ? `${assessment.percentage}%`
                  : "Not started"
              }
              description={
                assessment
                  ? `${assessment.score}/${assessment.total} correct answers`
                  : "Complete your skill assessment"
              }
            />

            <StatCard
              title="Roadmap Progress"
              value={
                roadmapProgress !== null
                  ? `${roadmapProgress}%`
                  : "Not started"
              }
              description={
                roadmapProgress !== null
                  ? "Learning journey completed"
                  : "Start your learning roadmap"
              }
            />

            <StatCard
              title="Resume Score"
              value={
                resumeScore !== null
                  ? `${resumeScore}%`
                  : "Not available"
              }
              description="Build and evaluate your resume"
            />

          </div>

          {/* Main Grid */}
          <div className="mt-8 grid gap-6 lg:grid-cols-3">

            {/* Recommended Careers */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">
                    Recommended Careers
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Based on your latest career analysis
                  </p>
                </div>

                <Link
                  href="/career-recommendation"
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-6 space-y-4">

                {recommendations.length > 0 ? (
                  recommendations.slice(0, 3).map((career) => (
                    <CareerCard
                      key={career.title}
                      title={career.title}
                      match={`${career.match}%`}
                      description={career.description}
                    />
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-700 p-6 text-center">

                    <p className="text-slate-400">
                      No career recommendations available yet.
                    </p>

                    <Link
                      href="/career-recommendation"
                      className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold hover:bg-blue-500"
                    >
                      Find My Career
                    </Link>

                  </div>
                )}

              </div>
            </div>

            {/* Profile Completion */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-semibold">
                Profile Completion
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Complete your profile to improve recommendations.
              </p>

              <div className="mt-6 flex items-center justify-center">

                <div
                  className="flex h-32 w-32 items-center justify-center rounded-full"
                  style={{
                    background: `conic-gradient(#2563eb ${profileCompletion}%, #1e293b ${profileCompletion}% 100%)`,
                  }}
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900">

                    <div className="text-center">
                      <p className="text-3xl font-bold">
                        {profileCompletion}%
                      </p>

                      <p className="text-xs text-slate-500">
                        Complete
                      </p>
                    </div>

                  </div>
                </div>

              </div>

              <Link
                href="/profile"
                className="mt-6 block rounded-lg border border-slate-700 py-3 text-center text-sm font-medium hover:bg-slate-800"
              >
                Complete Profile
              </Link>

            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">

            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <QuickAction
                title="Take Assessment"
                href="/skill-assessment"
              />

              <QuickAction
                title="Find My Career"
                href="/career-recommendation"
              />

              <QuickAction
                title="Build Resume"
                href="/resume-builder"
              />

              <QuickAction
                title="Ask AI"
                href="/chatbot"
              />

            </div>
          </div>

        </section>
      </div>
    </main>
  );
}

// Reusable Components

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

      <span className="text-2xl font-bold">
        {value}
      </span>

      <h3 className="mt-4 font-medium">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

    </div>
  );
}

function CareerCard({
  title,
  match,
  description,
}: {
  title: string;
  match: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">

      <div className="flex items-center justify-between gap-4">

        <div>
          <h3 className="font-semibold">
            {title}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <div className="shrink-0 text-center">
          <p className="text-xl font-bold text-blue-500">
            {match}
          </p>

          <p className="text-xs text-slate-600">
            Match
          </p>
        </div>

      </div>
    </div>
  );
}

function QuickAction({
  title,
  href,
}: {
  title: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-800 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-blue-500/50"
    >
      <h3 className="mt-3 font-medium">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Open →
      </p>
    </Link>
  );
}
