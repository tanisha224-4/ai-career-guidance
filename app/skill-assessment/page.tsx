
"use client";

import { useState, useMemo, useSyncExternalStore } from "react";

type Category = "Programming" | "Problem Solving" | "Technical Knowledge";

type Question = {
  question: string;
  options: string[];
  answer: string;
  category: Category;
};

type CategoryResult = {
  category: Category;
  correct: number;
  total: number;
  percentage: number;
};

const questionBank: Question[] = [
  {
    question: "Which language is commonly used for Artificial Intelligence?",
    options: ["Python", "HTML", "CSS", "SQL"],
    answer: "Python",
    category: "Programming",
  },
  {
    question: "What does ML stand for?",
    options: ["Machine Learning", "Modern Language", "Model Logic", "Machine Logic"],
    answer: "Machine Learning",
    category: "Technical Knowledge",
  },
  {
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue",
    category: "Problem Solving",
  },
  {
    question: "Which technology creates the structure of a webpage?",
    options: ["Python", "HTML", "MongoDB", "Git"],
    answer: "HTML",
    category: "Programming",
  },
  {
    question: "What is the main purpose of a database?",
    options: [
      "Store and manage data",
      "Create animations",
      "Design logos",
      "Compile CSS",
    ],
    answer: "Store and manage data",
    category: "Technical Knowledge",
  },
  {
    question: "Which of the following is a JavaScript framework?",
    options: ["React", "MySQL", "Python", "HTML"],
    answer: "React",
    category: "Programming",
  },
  {
    question: "What does CPU stand for?",
    options: [
      "Central Processing Unit",
      "Computer Personal Unit",
      "Central Program Utility",
      "Control Processing User",
    ],
    answer: "Central Processing Unit",
    category: "Technical Knowledge",
  },
  {
    question: "Which data structure uses LIFO?",
    options: ["Queue", "Stack", "Array", "Linked List"],
    answer: "Stack",
    category: "Problem Solving",
  },
  {
    question: "Which of these is used for version control?",
    options: ["Git", "HTML", "CSS", "Excel"],
    answer: "Git",
    category: "Programming",
  },
  {
    question: "What is the full form of SQL?",
    options: [
      "Structured Query Language",
      "Simple Question Language",
      "System Query Logic",
      "Standard Quick Language",
    ],
    answer: "Structured Query Language",
    category: "Technical Knowledge",
  },
  {
    question: "Which algorithm is used for searching in a sorted array?",
    options: [
      "Binary Search",
      "Bubble Sort",
      "Linear Sort",
      "Selection Sort",
    ],
    answer: "Binary Search",
    category: "Problem Solving",
  },
  {
    question: "Which of the following is an operating system?",
    options: ["Linux", "Python", "React", "MongoDB"],
    answer: "Linux",
    category: "Technical Knowledge",
  },
  {
    question: "What does API stand for?",
    options: [
      "Application Programming Interface",
      "Advanced Program Internet",
      "Application Process Integration",
      "Automated Programming Input",
    ],
    answer: "Application Programming Interface",
    category: "Technical Knowledge",
  },
  {
    question: "Which technology is commonly used for machine learning?",
    options: ["TensorFlow", "Bootstrap", "HTML", "Figma"],
    answer: "TensorFlow",
    category: "Technical Knowledge",
  },
  {
    question: "Which of these is a NoSQL database?",
    options: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
    answer: "MongoDB",
    category: "Technical Knowledge",
  },
];

const categories: Category[] = [
  "Programming",
  "Problem Solving",
  "Technical Knowledge",
];

// Shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

// Generate random 5 questions
function generateRandomQuestions(): Question[] {
  return shuffleArray(questionBank)
    .slice(0, 5)
    .map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    }));
}

const subscribe = () => () => {};

const getSnapshot = () => true;

const getServerSnapshot = () => false;

export default function SkillAssessment() {

  
const mounted = useSyncExternalStore(
  subscribe,
  getSnapshot,
  getServerSnapshot
);

const [restartKey, setRestartKey] = useState(0);

const questions = useMemo(() => {
  if (!mounted) {
    return questionBank.slice(0, 5);
  }

  return generateRandomQuestions();
}, [mounted, restartKey]);


  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const question = questions[currentQuestion];

  // Calculate category-wise results
  function calculateCategoryResults(
    selectedQuestions: Question[],
    userAnswers: string[]
  ): CategoryResult[] {
    return categories.map((category) => {
      const categoryQuestions = selectedQuestions
        .map((q, index) => ({
          ...q,
          userAnswer: userAnswers[index],
        }))
        .filter((q) => q.category === category);

      const correct = categoryQuestions.filter(
        (q) => q.userAnswer === q.answer
      ).length;

      const total = categoryQuestions.length;

      return {
        category,
        correct,
        total,
        percentage:
          total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });
  }

  // Save result to localStorage and backend
  async function saveAssessmentResult(
    result: {
      score: number;
      total: number;
      percentage: number;
      answers: string[];
      categoryResults: CategoryResult[];
      questions: Question[];
      date: string;
    }
  ) {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    let userId = "";

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        userId =
          payload.id ||
          payload.userId ||
          payload._id ||
          "";
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
        `assessmentResult_${userId}`,
        JSON.stringify(result)
      );
    }

    if (!token) {
      setSaveMessage(
        "Result saved locally. Please log in to save it to the database."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "http://localhost:5000/api/assessment/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(result),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Database save failed");
      }

      setSaveMessage(
        "Assessment result saved successfully to database!"
      );
    } catch (error) {
      console.error("Assessment save error:", error);

      setSaveMessage(
        "Result saved locally, but database saving failed. Please check your backend."
      );
    } finally {
      setSaving(false);
    }
  }

  // Handle next question / finish
  async function handleNext() {
    if (!selectedAnswer) {
      alert("Please select an answer first.");
      return;
    }

    const updatedAnswers = [...answers, selectedAnswer];

    const newScore =
      score + (selectedAnswer === question.answer ? 1 : 0);

    setAnswers(updatedAnswers);
    setScore(newScore);

    if (currentQuestion === questions.length - 1) {
      const percentage = Math.round(
        (newScore / questions.length) * 100
      );

      const categoryResults = calculateCategoryResults(
        questions,
        updatedAnswers
      );

      const result = {
        score: newScore,
        total: questions.length,
        percentage,
        answers: updatedAnswers,
        categoryResults,
        questions,
        date: new Date().toISOString(),
      };

      setCompleted(true);

      await saveAssessmentResult(result);

      return;
    }

    setCurrentQuestion((prev) => prev + 1);
    setSelectedAnswer("");
  }

  // Retake assessment
  function restartAssessment() {
  setRestartKey((prev) => prev + 1);
  setCurrentQuestion(0);
  setSelectedAnswer("");
  setAnswers([]);
  setScore(0);
  setCompleted(false);
  setSaving(false);
  setSaveMessage("");
}

if (!mounted) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <p className="text-blue-400 text-lg">
        Preparing your assessment...
      </p>
    </main>
  );
}

  // Completed screen
  if (completed) {
    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const categoryResults = calculateCategoryResults(
      questions,
      answers
    );

    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-slate-800 bg-slate-950">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <a
              href="/dashboard"
              className="text-xl font-bold text-blue-400"
            >
              AI Career Guidance
            </a>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
              T
            </div>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl md:p-12">
            <h1 className="text-3xl font-bold">
              Assessment Complete!
            </h1>

            <p className="mt-2 text-slate-400">
              Here is your skill assessment result.
            </p>

            <div className="mx-auto mt-8 flex h-40 w-40 items-center justify-center rounded-full border-8 border-blue-500">
              <div>
                <p className="text-4xl font-bold text-blue-400">
                  {percentage}%
                </p>
                <p className="text-sm text-slate-400">
                  Score
                </p>
              </div>
            </div>

            <p className="mt-5 text-slate-300">
              You answered {score} out of {questions.length} questions correctly.
            </p>

            {/* Category-wise scores */}
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {categoryResults.map((item) => (
                <div
                  key={item.category}
                  className="rounded-2xl bg-slate-950 p-6"
                >
                  <h3 className="font-semibold">
                    {item.category}
                  </h3>

                  <p className="mt-2 text-2xl font-bold text-blue-400">
                    {item.percentage}%
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {item.correct} out of {item.total} correct
                  </p>
                </div>
              ))}
            </div>

            {/* Strengths and improvements */}
            <div className="mt-8 grid gap-5 text-left md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <h3 className="text-lg font-semibold">
                  Strengths
                </h3>

                {categoryResults
                  .filter(
                    (item) => item.total > 0 && item.percentage >= 50
                  )
                  .map((item) => (
                    <p
                      key={item.category}
                      className="mt-3 text-sm text-slate-300"
                    >
                      {item.category}: {item.percentage}%
                    </p>
                  ))}

                {categoryResults.every(
                  (item) => item.total === 0 || item.percentage < 50
                ) && (
                  <p className="mt-3 text-sm text-slate-300">
                    Keep practicing to develop your skills.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">
                <h3 className="text-lg font-semibold">
                  Areas to Improve
                </h3>

                {categoryResults
                  .filter(
                    (item) => item.total > 0 && item.percentage < 50
                  )
                  .map((item) => (
                    <p
                      key={item.category}
                      className="mt-3 text-sm text-slate-300"
                    >
                      {item.category}: Practice more
                    </p>
                  ))}

                {categoryResults.every(
                  (item) => item.total === 0 || item.percentage >= 50
                ) && (
                  <p className="mt-3 text-sm text-slate-300">
                    Continue learning and exploring new concepts.
                  </p>
                )}
              </div>
            </div>

            {/* Save status */}
            <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-4">
              <p className="text-sm text-slate-300">
                {saving
                  ? "Saving your result to database..."
                  : saveMessage}
              </p>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={restartAssessment}
                className="rounded-xl border border-slate-700 px-6 py-3 font-semibold transition hover:bg-slate-800"
              >
                Retake Assessment
              </button>

              <a
                href="/career-recommendation"
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                View Career Recommendations
              </a>
            </div>

            <div className="mt-5">
              <a
                href="/dashboard"
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Back to Dashboard
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  // Assessment screen
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a
            href="/dashboard"
            className="text-xl font-bold text-blue-400"
          >
            AI Career Guidance
          </a>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">
              Skill Assessment
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
              T
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <a
            href="/dashboard"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Back to Dashboard
          </a>

          <h1 className="mt-5 text-3xl font-bold">
            Skill Assessment
          </h1>

          <p className="mt-2 text-slate-400">
            Test your technical knowledge and understand your current skill level.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-xl md:p-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">
              Question {currentQuestion + 1} of {questions.length}
            </span>

            <span className="text-sm text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-10">
            <span className="text-sm font-medium text-blue-400">
              {question.category}
            </span>

            <h2 className="mt-3 text-2xl font-bold leading-relaxed">
              {question.question}
            </h2>
          </div>

          <div className="mt-8 space-y-4">
            {question.options.map((option, index) => (
              <button
                key={option}
                onClick={() => setSelectedAnswer(option)}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                  selectedAnswer === option
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-slate-700 bg-slate-950 hover:border-slate-500"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold ${
                    selectedAnswer === option
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >
                  {String.fromCharCode(65 + index)}
                </span>

                <span className="text-sm font-medium text-slate-200">
                  {option}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold transition hover:bg-blue-500"
          >
            {currentQuestion === questions.length - 1
              ? "Finish Assessment"
              : "Next Question"}
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-900/50 bg-blue-950/20 p-5">
          <h3 className="font-semibold">
            How this assessment works
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-400">
            Five random questions are selected from our question bank.
            Answer each question based on your current knowledge.
            Your results help identify your strengths and areas
            where you can improve.
          </p>
        </div>
      </main>
    </div>
  );
}
