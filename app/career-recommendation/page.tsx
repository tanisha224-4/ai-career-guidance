"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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

const careerData: Career[] = [
  {
    title: "AI / ML Engineer",
    match: 0,
    description:
      "Build intelligent systems using machine learning and artificial intelligence technologies.",
    skills: ["Python", "Machine Learning", "Deep Learning", "Statistics"],
    category: "Artificial Intelligence",
  },
  {
    title: "Software Engineer",
    match: 0,
    description:
      "Design, develop, test, and maintain modern software applications and systems.",
    skills: ["Programming", "Data Structures", "Git", "Problem Solving"],
    category: "Software Development",
  },
  {
    title: "Data Scientist",
    match: 0,
    description:
      "Analyze data and build predictive models to solve real-world problems.",
    skills: ["Python", "Statistics", "Data Analysis", "SQL"],
    category: "Data Science",
  },
  {
    title: "Cyber Security Analyst",
    match: 0,
    description:
      "Help protect computer systems, networks, and digital information from security threats.",
    skills: ["Networking", "Cyber Security", "Linux", "Cryptography"],
    category: "Cyber Security",
  },
  {
    title: "Cloud Engineer",
    match: 0,
    description:
      "Work with cloud platforms and develop scalable cloud-based infrastructure.",
    skills: ["Cloud Computing", "AWS", "Networking", "Linux"],
    category: "Cloud Computing",
  },
  {
    title: "Data Analyst",
    match: 0,
    description:
      "Interpret data, identify trends, and create meaningful reports for decision-making.",
    skills: ["SQL", "Excel", "Python", "Data Visualization"],
    category: "Data Science",
  },
];

export default function CareerRecommendation() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [preference, setPreference] = useState("Technology");

  const [assessment, setAssessment] =
    useState<AssessmentResult | null>(null);

  const [recommendations, setRecommendations] =
    useState<Career[]>([]);

  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const savedResult = localStorage.getItem("assessmentResult");

    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult);

        if (
          typeof parsed.score === "number" &&
          typeof parsed.total === "number" &&
          parsed.total > 0 &&
          typeof parsed.percentage === "number"
        ) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setAssessment(parsed);
        }
      } catch {
        setAssessment(null);
      }
    }
  }, []);

  // Generate career recommendations
  const generateRecommendations = () => {
    const userSkills = skills
      .toLowerCase()
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const userInterests = interests
      .toLowerCase()
      .split(",")
      .map((interest) => interest.trim())
      .filter(Boolean);

    const results = careerData.map((career) => {
      let score = 50;

      const careerSkills = career.skills.map((skill) =>
        skill.toLowerCase()
      );

      const matchingSkills = userSkills.filter((skill) =>
        careerSkills.some(
          (careerSkill) =>
            careerSkill.includes(skill) ||
            skill.includes(careerSkill)
        )
      );

      score += Math.min(matchingSkills.length * 8, 24);

      const matchingInterests = userInterests.filter((interest) => {
        const category = career.category.toLowerCase();

        return (
          category.includes(interest) ||
          interest.includes(category) ||
          career.title.toLowerCase().includes(interest)
        );
      });

      score += Math.min(matchingInterests.length * 8, 16);

      if (
        preference === "Artificial Intelligence" &&
        career.category === "Artificial Intelligence"
      ) {
        score += 10;
      }

      if (
        preference === "Data Science" &&
        career.category === "Data Science"
      ) {
        score += 10;
      }

      if (
        preference === "Software Development" &&
        career.category === "Software Development"
      ) {
        score += 10;
      }

      if (
        preference === "Cyber Security" &&
        career.category === "Cyber Security"
      ) {
        score += 10;
      }

      if (
        preference === "Cloud Computing" &&
        career.category === "Cloud Computing"
      ) {
        score += 10;
      }

      if (experience === "Intermediate") {
        score += 2;
      }

      if (experience === "Advanced") {
        score += 4;
      }

      if (assessment) {
        score += Math.round(
          (assessment.percentage / 100) * 10
        );
      }

      return {
        ...career,
        match: Math.min(score, 99),
      };
    });

    results.sort((a, b) => b.match - a.match);

    setRecommendations(results);

const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

let userId = "";

if (token) {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    userId = payload.id || payload.userId || payload._id || "";
  } catch {
    userId = "";
  }
}

if (!userId) {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);
      userId = user.id || user._id || user.email || "";
    } catch {
      userId = "";
    }
  }
}

if (userId) {
  localStorage.setItem(
    `careerRecommendation_${userId}`,
    JSON.stringify({
      skills,
      interests,
      experience,
      preference,
      recommendations: results,
      selectedCareer: results[0].title,
      topMatch: results[0].match,
      date: new Date().toISOString(),
    })
  );
}

setShowResults(true);
  };

  // Find missing skills for the top recommendation
  const getMissingSkills = () => {
    if (!recommendations.length) return [];

    const userSkills = skills
      .toLowerCase()
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    return recommendations[0].skills.filter(
      (skill) =>
        !userSkills.some(
          (userSkill) =>
            userSkill.includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(userSkill)
        )
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            href="/dashboard"
            className="text-xl font-bold text-blue-400"
          >
            AI Career Guidance
          </Link>

          <span className="hidden text-sm text-slate-400 sm:block">
            Career Recommendation
          </span>

        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Header */}
        <div className="mb-8">

          <Link
            href="/dashboard"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-4 text-3xl font-bold">
            Find Your Best Career
          </h1>

          <p className="mt-2 text-slate-400">
            Tell us about your skills, interests, and preferences.
            Our system will generate personalized career recommendations.
          </p>

        </div>

        {/* Assessment Score */}
        {assessment && (
          <div className="mb-8 rounded-2xl border border-blue-900/50 bg-blue-950/20 p-6">

            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

              <div>
                <p className="text-sm text-blue-400">
                  Your Skill Assessment
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Assessment Score: {assessment.percentage}%
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  You answered {assessment.score} out of{" "}
                  {assessment.total} questions correctly.
                </p>
              </div>

              <Link
                href="/skill-assessment"
                className="rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-semibold transition hover:bg-slate-800"
              >
                Retake Assessment
              </Link>

            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Form */}
          <div className="lg:col-span-2">

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

              <h2 className="text-xl font-semibold">
                Tell Us About Yourself
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Provide some information to generate personalized recommendations.
              </p>

              <div className="mt-6 space-y-6">

                {/* Skills */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Your Skills
                  </label>

                  <textarea
                    value={skills}
                    onChange={(e) => {
                      setSkills(e.target.value);
                      setShowResults(false);
                    }}
                    placeholder="Example: Python, C++, HTML, CSS, Machine Learning..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Enter your technical or soft skills separated by commas.
                  </p>

                </div>

                {/* Interests */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Your Interests
                  </label>

                  <textarea
                    value={interests}
                    onChange={(e) => {
                      setInterests(e.target.value);
                      setShowResults(false);
                    }}
                    placeholder="Example: Artificial Intelligence, Web Development, Data Science..."
                    rows={4}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-blue-500"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Enter your areas of interest separated by commas.
                  </p>

                </div>

                {/* Experience + Preference */}
                <div className="grid gap-5 md:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Experience Level
                    </label>

                    <select
                      value={experience}
                      onChange={(e) => {
                        setExperience(e.target.value);
                        setShowResults(false);
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Career Preference
                    </label>

                    <select
                      value={preference}
                      onChange={(e) => {
                        setPreference(e.target.value);
                        setShowResults(false);
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500"
                    >
                      <option>Technology</option>
                      <option>Artificial Intelligence</option>
                      <option>Data Science</option>
                      <option>Software Development</option>
                      <option>Cyber Security</option>
                      <option>Cloud Computing</option>
                      <option>Research</option>
                    </select>

                  </div>

                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={generateRecommendations}
                  className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-500"
                >
                  Get Career Recommendations
                </button>

                <p className="text-xs text-slate-500">
                  Recommendations are generated using a rule-based
                  matching system, not a trained AI model.
                </p>

              </div>
            </div>
          </div>

          {/* Side Information */}
          <div className="space-y-6">

            <div className="rounded-2xl border border-blue-900/50 bg-blue-950/30 p-6">

              <h3 className="text-lg font-semibold">
                Career Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your assessment score, skills, interests, experience,
                and career preference are considered to generate
                career suggestions.
              </p>

            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h3 className="font-semibold">
                What You Will Get
              </h3>

              <div className="mt-4 space-y-4">

                {[
                  "Career match score",
                  "Skill gap analysis",
                  "Recommended learning path",
                  "Personalized career suggestions",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="text-blue-400">✓</span>
                    <span className="text-sm text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}

              </div>

            </div>
          </div>

        </div>

        {/* Results */}
        {showResults && (

          <>

            <section className="mt-10">

              <div className="mb-5">

                <h2 className="text-2xl font-bold">
                  Your Career Recommendations
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  These suggestions are based on your entered profile
                  and assessment information.
                </p>

              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                {recommendations.map((career) => (

                  <div
                    key={career.title}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-700"
                  >

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-semibold text-green-400">
                      {career.match}% Match
                    </span>

                    <h3 className="mt-5 text-lg font-semibold">
                      {career.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {career.description}
                    </p>

                    <div className="mt-5">

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Important Skills
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {career.skills.map((skill) => (

                          <span
                            key={skill}
                            className="rounded-lg bg-slate-950 px-3 py-1.5 text-xs text-slate-300"
                          >
                            {skill}
                          </span>

                        ))}

                      </div>
                    </div>

                  </div>

                ))}

              </div>
            </section>

            {/* Skill Gap Analysis */}
            <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-bold">
                Skill Gap Analysis
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Skills you can focus on for your top recommended career:
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">

                <div className="rounded-xl bg-slate-950 p-5">

                  <p className="text-sm text-slate-400">
                    Assessment Score
                  </p>

                  <p className="mt-2 text-lg font-semibold text-blue-400">
                    {assessment?.percentage ?? "Not available"}
                    {assessment ? "%" : ""}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-950 p-5">

                  <p className="text-sm text-slate-400">
                    Target Career
                  </p>

                  <p className="mt-2 text-lg font-semibold">
                    {recommendations[0]?.title}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-950 p-5">

                  <p className="text-sm text-slate-400">
                    Skills to Improve
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">

                    {getMissingSkills().length > 0 ? (
                      getMissingSkills().map((skill) => (
                        <span
                          key={skill}
                          className="text-sm font-semibold text-blue-400"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-semibold text-green-400">
                        No identified skill gaps
                      </span>
                    )}

                  </div>

                </div>

              </div>
            </section>

            {/* Learning Roadmap */}
            <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-bold">
                Recommended Learning Roadmap
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Follow these steps to improve your skills and prepare
                for your target career.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

                {[
                  {
                    title: "Strengthen Programming",
                    description:
                      "Improve programming fundamentals and problem-solving skills.",
                  },
                  {
                    title: "Learn Core Concepts",
                    description:
                      "Study the important concepts related to your selected career.",
                  },
                  {
                    title: "Build Projects",
                    description:
                      "Create practical projects to demonstrate your skills.",
                  },
                  {
                    title: "Prepare for Jobs",
                    description:
                      "Improve your resume, interview skills, and portfolio.",
                  },
                ].map((step, index) => (

                  <div
                    key={step.title}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                  >

                    <span className="text-sm font-semibold text-blue-400">
                      Step {index + 1}
                    </span>

                    <h3 className="mt-2 font-semibold">
                      {step.title}
                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                      {step.description}
                    </p>

                  </div>

                ))}

              </div>

              <Link
                href="/roadmap"
                className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
              >
                Explore Learning Roadmap →
              </Link>

            </section>

          </>

        )}

      </main>
    </div>
  );
}