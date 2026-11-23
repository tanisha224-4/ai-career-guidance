
export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <div className="text-2xl font-bold">
          <span className="text-blue-500">AI</span> Career Guidance
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
          <a href="#" className="hover:text-white transition">
            Home
          </a>
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
          <a href="#about" className="hover:text-white transition">
            About
          </a>
          <a href="/login" className="hover:text-white transition">
            Login   
          </a>
        </div>

        <a
          href="/signup"
          className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
             AI-Powered Career Guidance
          </div>

          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Discover the
            <span className="text-blue-500"> Right Career </span>
            for Your Future
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Get personalized career recommendations, identify your skill gaps,
            build a learning roadmap, and prepare yourself for your dream career
            with AI-powered guidance.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/signup"
              className="rounded-lg bg-blue-600 px-7 py-3.5 font-semibold hover:bg-blue-700 transition"
            >
              Get Started →
            </a>

            <a
              href="#features"
              className="rounded-lg border border-slate-700 px-7 py-3.5 font-semibold hover:bg-slate-900 transition"
            >
              Explore Features
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20 bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              Platform Features
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Everything You Need for Your Career
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              One platform to understand your skills, explore career options,
              and plan your professional journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              
              title="Career Recommendation"
              description="Get AI-powered career recommendations based on your skills, interests, personality, and goals."
            />

            <FeatureCard
              
              title="Skill Assessment"
              description="Evaluate your current skills and discover the areas where you need improvement."
            />

            <FeatureCard
              
              title="Learning Roadmap"
              description="Follow a personalized roadmap with courses, certifications, projects, and milestones."
            />

            <FeatureCard
              
              title="Resume Builder"
              description="Create a professional, ATS-friendly resume using your career profile and skills."
            />

            <FeatureCard
              
              title="AI Career Chatbot"
              description="Ask career-related questions and get instant guidance from your AI assistant."
            />

            <FeatureCard
              
              title="Progress Tracking"
              description="Track your skills, learning progress, assessments, and career development."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="px-8 py-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-blue-500/20 bg-blue-500/10 p-10 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to Plan Your Career?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Start your personalized career journey with AI-powered guidance.
          </p>

          <a
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-7 py-3.5 font-semibold hover:bg-blue-700 transition"
          >
            Create Your Account
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-8 py-8 text-center text-sm text-slate-500">
        © 2026 AI Career Guidance Portal. All rights reserved.
      </footer>
    </main>
  );
}

function FeatureCard({
  
  title,
  description,
}: {

  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-blue-500/50">
     

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </div>
  );
}

