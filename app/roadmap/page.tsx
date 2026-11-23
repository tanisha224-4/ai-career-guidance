
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type RoadmapStep = {
  title: string;
  duration: string;
  description: string;
  topics: string[];
  project: string;
  resource: string;
};

const roadmapData: Record<string, RoadmapStep[]> = {
  "AI / ML Engineer": [
    {
      title: "Python Programming",
      duration: "3 Weeks",
      description: "Learn programming fundamentals required for AI development.",
      topics: ["Python Basics", "Functions", "OOP", "NumPy", "Pandas"],
      project: "Build a Student Marks Analysis Program",
      resource: "https://www.w3schools.com/python/"
    },
    {
      title: "Mathematics and Statistics",
      duration: "3 Weeks",
      description: "Understand the mathematical concepts used in machine learning.",
      topics: ["Linear Algebra", "Probability", "Statistics", "Calculus"],
      project: "Create a Basic Data Analysis Project",
      resource: "https://www.khanacademy.org/math"
    },
    {
      title: "Machine Learning",
      duration: "4 Weeks",
      description: "Understand machine learning algorithms and model evaluation.",
      topics: ["Regression", "Classification", "Clustering", "Scikit-learn"],
      project: "Build a House Price Prediction Model",
      resource: "https://scikit-learn.org/stable/tutorial/"
    },
    {
      title: "Deep Learning",
      duration: "4 Weeks",
      description: "Learn neural networks and deep learning fundamentals.",
      topics: ["Neural Networks", "TensorFlow", "CNN", "Model Training"],
      project: "Build an Image Classification Model",
      resource: "https://www.tensorflow.org/tutorials"
    },
    {
      title: "Final AI Project",
      duration: "3 Weeks",
      description: "Apply your knowledge to develop a complete AI application.",
      topics: ["Data Preparation", "Model Development", "Testing", "Deployment"],
      project: "Develop an AI-Based Prediction Application",
      resource: "https://www.kaggle.com/learn"
    }
  ],

  "Software Engineer": [
    {
      title: "Programming Fundamentals",
      duration: "3 Weeks",
      description: "Build a strong foundation in programming.",
      topics: ["C++", "Python", "Variables", "Functions", "OOP"],
      project: "Student Management System",
      resource: "https://www.w3schools.com/"
    },
    {
      title: "Data Structures and Algorithms",
      duration: "4 Weeks",
      description: "Learn efficient problem-solving techniques.",
      topics: ["Arrays", "Linked Lists", "Stacks", "Queues", "Trees"],
      project: "Build a Library Management System",
      resource: "https://www.geeksforgeeks.org/"
    },
    {
      title: "Web Development",
      duration: "4 Weeks",
      description: "Learn how modern web applications are developed.",
      topics: ["HTML", "CSS", "JavaScript", "React", "Next.js"],
      project: "Build a Personal Portfolio Website",
      resource: "https://developer.mozilla.org/"
    },
    {
      title: "Database and Backend",
      duration: "3 Weeks",
      description: "Understand server-side development and databases.",
      topics: ["Node.js", "Express", "MongoDB", "REST APIs"],
      project: "Build a User Authentication System",
      resource: "https://www.mongodb.com/docs/"
    },
    {
      title: "Final Software Project",
      duration: "3 Weeks",
      description: "Develop and test a complete software application.",
      topics: ["Git", "Testing", "Deployment", "Debugging"],
      project: "Develop a Full-Stack Web Application",
      resource: "https://docs.github.com/"
    }
  ],

  "Data Scientist": [
    {
      title: "Python and Data Handling",
      duration: "3 Weeks",
      description: "Learn Python and essential data handling libraries.",
      topics: ["Python", "NumPy", "Pandas", "Data Cleaning"],
      project: "Analyze a Student Performance Dataset",
      resource: "https://www.kaggle.com/learn"
    },
    {
      title: "Statistics and Mathematics",
      duration: "3 Weeks",
      description: "Understand statistics for data analysis.",
      topics: ["Probability", "Statistics", "Hypothesis Testing", "Linear Algebra"],
      project: "Perform Statistical Data Analysis",
      resource: "https://www.khanacademy.org/math"
    },
    {
      title: "Data Visualization",
      duration: "3 Weeks",
      description: "Learn how to visualize and communicate data.",
      topics: ["Matplotlib", "Seaborn", "Power BI", "Charts"],
      project: "Create a Data Visualization Dashboard",
      resource: "https://matplotlib.org/stable/tutorials/"
    },
    {
      title: "Machine Learning",
      duration: "4 Weeks",
      description: "Learn predictive modeling and machine learning.",
      topics: ["Regression", "Classification", "Clustering", "Scikit-learn"],
      project: "Build a Customer Prediction Model",
      resource: "https://scikit-learn.org/stable/tutorial/"
    },
    {
      title: "Final Data Science Project",
      duration: "3 Weeks",
      description: "Apply data science techniques to a real dataset.",
      topics: ["Data Collection", "Analysis", "Model Evaluation", "Reporting"],
      project: "Develop a Complete Data Science Project",
      resource: "https://www.kaggle.com/"
    }
  ],

  "Data Analyst": [
    {
      title: "Excel Fundamentals",
      duration: "2 Weeks",
      description: "Learn spreadsheet operations and data handling.",
      topics: ["Excel", "Formulas", "Pivot Tables", "Data Cleaning"],
      project: "Create a Sales Report",
      resource: "https://support.microsoft.com/excel"
    },
    {
      title: "SQL and Databases",
      duration: "3 Weeks",
      description: "Learn how to retrieve and manage data.",
      topics: ["SQL", "SELECT", "JOIN", "GROUP BY", "Database Basics"],
      project: "Create a Student Database Analysis",
      resource: "https://www.w3schools.com/sql/"
    },
    {
      title: "Python for Analysis",
      duration: "3 Weeks",
      description: "Use Python libraries to analyze datasets.",
      topics: ["Python", "Pandas", "NumPy", "Data Cleaning"],
      project: "Analyze a Public Dataset",
      resource: "https://www.kaggle.com/learn"
    },
    {
      title: "Data Visualization",
      duration: "3 Weeks",
      description: "Present insights using visual dashboards.",
      topics: ["Power BI", "Matplotlib", "Charts", "Dashboards"],
      project: "Build a Business Dashboard",
      resource: "https://learn.microsoft.com/power-bi/"
    },
    {
      title: "Final Analytics Project",
      duration: "2 Weeks",
      description: "Combine your skills to solve a data problem.",
      topics: ["Data Analysis", "Reporting", "Insights", "Presentation"],
      project: "Develop a Business Analytics Report",
      resource: "https://www.kaggle.com/"
    }
  ],

  "Cyber Security Analyst": [
    {
      title: "Computer and Networking Basics",
      duration: "3 Weeks",
      description: "Understand computer systems and networking fundamentals.",
      topics: ["Operating Systems", "Networking", "TCP/IP", "DNS"],
      project: "Create a Basic Network Documentation Project",
      resource: "https://www.netacad.com/"
    },
    {
      title: "Linux Fundamentals",
      duration: "2 Weeks",
      description: "Understand Linux operating system fundamentals.",
      topics: ["Linux Commands", "File Systems", "Permissions", "Shell Basics"],
      project: "Create Linux Administration Notes",
      resource: "https://linuxjourney.com/"
    },
    {
      title: "Security Fundamentals",
      duration: "4 Weeks",
      description: "Learn defensive security concepts.",
      topics: ["Encryption", "Authentication", "Firewalls", "Security Principles"],
      project: "Create a Security Awareness Guide",
      resource: "https://www.coursera.org/"
    },
    {
      title: "Security Monitoring",
      duration: "3 Weeks",
      description: "Understand how organizations monitor security events.",
      topics: ["Logs", "Incident Response", "Threat Detection", "SIEM Basics"],
      project: "Create a Sample Security Incident Report",
      resource: "https://tryhackme.com/"
    },
    {
      title: "Final Security Project",
      duration: "3 Weeks",
      description: "Apply defensive security knowledge in a controlled lab.",
      topics: ["Risk Assessment", "Monitoring", "Documentation", "Prevention"],
      project: "Develop a Network Security Assessment Report",
      resource: "https://owasp.org/"
    }
  ],

  "Cloud Engineer": [
    {
      title: "Linux and Networking",
      duration: "3 Weeks",
      description: "Understand operating systems and networking.",
      topics: ["Linux", "Networking", "TCP/IP", "DNS"],
      project: "Create a Network Architecture Diagram",
      resource: "https://linuxjourney.com/"
    },
    {
      title: "Cloud Fundamentals",
      duration: "3 Weeks",
      description: "Understand cloud computing and service models.",
      topics: ["Cloud Computing", "IaaS", "PaaS", "SaaS"],
      project: "Document a Cloud Architecture",
      resource: "https://aws.amazon.com/training/"
    },
    {
      title: "Cloud Platforms",
      duration: "4 Weeks",
      description: "Learn cloud platform fundamentals.",
      topics: ["AWS", "Storage", "Compute", "Networking"],
      project: "Deploy a Sample Cloud Application",
      resource: "https://learn.microsoft.com/training/azure/"
    },
    {
      title: "DevOps Fundamentals",
      duration: "3 Weeks",
      description: "Learn development and deployment workflows.",
      topics: ["Git", "Docker", "CI/CD", "Linux"],
      project: "Create a Basic CI/CD Workflow",
      resource: "https://docs.docker.com/get-started/"
    },
    {
      title: "Final Cloud Project",
      duration: "3 Weeks",
      description: "Build and document a cloud-based application.",
      topics: ["Deployment", "Monitoring", "Security", "Documentation"],
      project: "Deploy a Full-Stack Cloud Application",
      resource: "https://aws.amazon.com/training/"
    }
  ]
};


export default function RoadmapPage() {
  const [career, setCareer] = useState("AI / ML Engineer");
  const [completed, setCompleted] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);
  const storageKeyRef = useRef("");

  useEffect(() => {
    let userId = "";

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(
          atob(token.split(".")[1])
        );

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

          userId =
            user.id ||
            user._id ||
            user.email ||
            "";
        } catch {
          userId = "";
        }
      }
    }

  if (!userId) {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setLoaded(true);
  return;
}

    const key = `roadmap_${userId}`;
    console.log("Roadmap Storage Key:", key);
console.log("Saved Roadmap:", localStorage.getItem(key));
    storageKeyRef.current = key;

    const savedData = localStorage.getItem(key);

    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        if (data.career && roadmapData[data.career]) {
         
          setCareer(data.career);
        }

        if (Array.isArray(data.completed)) {
         
          setCompleted(data.completed);
        }
      } catch {
        
        setCompleted([]);
      }
    }

   
    setLoaded(true);
  }, []);

  const steps =
    roadmapData[career] ||
    roadmapData["AI / ML Engineer"];

  const toggleComplete = (index: number) => {
    const updated = completed.includes(index)
      ? completed.filter((item) => item !== index)
      : [...completed, index];

    setCompleted(updated);

    if (storageKeyRef.current) {
      localStorage.setItem(
        storageKeyRef.current,
        JSON.stringify({
          career,
          completed: updated,
        })
      );
    }
  };

  const progress = Math.round(
    (completed.length / steps.length) * 100
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">
          Loading your learning roadmap...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-blue-400"
          >
            AI Career Guidance
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-blue-400"
          >
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold">
          Learning Roadmap
        </h1>

        <p className="mt-2 text-slate-400">
          Follow your personalized career learning path step by step.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <label className="text-sm text-slate-300">
            Select Target Career
          </label>

          <select
            value={career}
            onChange={(e) => {
              const newCareer = e.target.value;

              setCareer(newCareer);
              setCompleted([]);

              if (storageKeyRef.current) {
                localStorage.setItem(
                  storageKeyRef.current,
                  JSON.stringify({
                    career: newCareer,
                    completed: [],
                  })
                );
              }
            }}
            className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white"
          >
            {Object.keys(roadmapData).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="mt-6 flex justify-between text-sm">
            <span>Learning Progress</span>

            <span className="text-blue-400">
              {progress}%
            </span>
          </div>

          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-slate-400">
            {completed.length} of {steps.length} phases completed
          </p>
        </section>

        <section className="mt-8 space-y-5">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <p className="text-sm font-semibold text-blue-400">
                    PHASE {index + 1} · {step.duration}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {step.title}
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    {step.description}
                  </p>
                </div>

                <button
                  onClick={() => toggleComplete(index)}
                  className={`h-fit rounded-lg px-4 py-2 text-sm font-semibold ${
                    completed.includes(index)
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {completed.includes(index)
                    ? "Completed"
                    : "Mark as Completed"}
                </button>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold">
                  Topics to Learn
                </h3>

                <div className="mt-3 flex flex-wrap gap-2">
                  {step.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-lg bg-slate-950 px-3 py-2 text-sm text-slate-300"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-slate-950 p-4">
                <h3 className="font-semibold">
                  Practical Project
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  {step.project}
                </p>
              </div>

              <a
                href={step.resource}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block text-sm font-semibold text-blue-400 hover:text-blue-300"
              >
                Explore Learning Resource →
              </a>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}