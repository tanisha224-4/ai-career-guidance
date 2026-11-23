"use client";

import { useState } from "react";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

const quickQuestions = [
  "Which career is best for me?",
  "How can I improve my skills?",
  "What should I learn for AI/ML?",
  "How do I prepare for placements?",
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
  {
    id: "initial-ai-message",
    sender: "ai",
    text: "Hello!  I'm your AI Career Assistant. I can help you with career choices, skills, learning paths, and more.",
  },
]);

  const [input, setInput] = useState("");

  const sendMessage = (messageText?: string) => {
    const text = (messageText ?? input).trim();

    if (!text) return;

    const userMessage: Message = {
    id: crypto.randomUUID(),
    sender: "user",
    text,
  };

    setMessages((current) => [...current, userMessage]);
    setInput("");

    // Temporary demo response.
    // Later this will be replaced with a real AI API call.
    setTimeout(() => {
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "That's a great question! Once the AI backend is connected, I will analyze your profile, skills, interests, and career goals to give you a personalized answer.",
      };

      setMessages((current) => [...current, aiMessage]);
    }, 700);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Chat cleared! What would you like to know about your career?",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
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
              AI Career Assistant
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold">
              T
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <a
            href="/dashboard"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            ← Back to Dashboard
          </a>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                AI Career Assistant
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Ask questions and get guidance for your career journey.
              </p>
            </div>

            <button
              onClick={clearChat}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">
          {/* Chat Header */}
          <div className="flex items-center gap-4 border-b border-slate-800 px-5 py-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-xl">
              
            </div>

            <div>
              <h2 className="font-semibold">
                Career AI Assistant
              </h2>

              <div className="mt-0.5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-400">
                  Online
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[500px] space-y-5 overflow-y-auto bg-slate-950/50 p-5 sm:p-7">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] gap-3 sm:max-w-[70%] ${
                    message.sender === "user"
                      ? "flex-row-reverse"
                      : ""
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                      message.sender === "ai"
                        ? "bg-blue-600"
                        : "bg-slate-700"
                    }`}
                  >
                    {message.sender === "ai" ? "🤖" : "T"}
                  </div>

                  {/* Message */}
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.sender === "ai"
                        ? "rounded-tl-sm border border-slate-800 bg-slate-900 text-slate-200"
                        : "rounded-tr-sm bg-blue-600 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          <div className="border-t border-slate-800 bg-slate-900 px-5 py-4">
            <p className="mb-3 text-xs font-medium text-slate-500">
              QUICK QUESTIONS
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => sendMessage(question)}
                  className="whitespace-nowrap rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-300 transition hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-slate-800 bg-slate-900 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your career..."
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <button
                onClick={() => sendMessage()}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500"
              >
                <span className="hidden sm:inline">
                  Send
                </span>
                <span className="sm:hidden">➤</span>
              </button>
            </div>

            <p className="mt-2 text-center text-xs text-slate-600">
              AI Career Assistant • Personalized career guidance
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}