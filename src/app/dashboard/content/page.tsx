"use client";
import React, { useState, useEffect } from "react";
import {
  MessageSquare, Twitter, Linkedin, Copy, RefreshCw,
  Check, Instagram, Video, Sparkles, FileText, Clock
} from "lucide-react";

// ----------------------------------------------------------------------
// Types for localStorage data
// ----------------------------------------------------------------------
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface DayData {
  date: string;
  completed: number;
  total: number;
}

interface PlannerMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

interface PlannerTimeline {
  id: string;
  name: string;
  messages: PlannerMessage[];
  createdAt: number;
}

// ----------------------------------------------------------------------
// Helper: build context string from localStorage
// ----------------------------------------------------------------------
const buildContextFromStorage = (): string => {
  const today = new Date().toISOString().split("T")[0];
  const streak = localStorage.getItem("shift_streak") || "0";
  const tasksToday = localStorage.getItem(`tasks_${today}`);
  const weekData = localStorage.getItem("weekData");
  const plannerTimelines = localStorage.getItem("planner_timelines");

  const parts: string[] = [];

  // Streak
  parts.push(`You have a streak of ${streak} days.`);

  // Today's tasks
  if (tasksToday) {
    try {
      const tasks: Task[] = JSON.parse(tasksToday);
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      const taskTexts = tasks.map(t => t.text).join(", ");
      parts.push(`Today you completed ${completed} out of ${total} tasks: ${taskTexts}.`);
    } catch { /* ignore parse errors */ }
  }

  // Week data
  if (weekData) {
    try {
      const week: DayData[] = JSON.parse(weekData);
      const totalCompleted = week.reduce((acc, d) => acc + d.completed, 0);
      const totalTasks = week.reduce((acc, d) => acc + d.total, 0);
      const avg = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
      parts.push(`Over the last 7 days, you completed ${totalCompleted} out of ${totalTasks} tasks (${avg}% consistency).`);
    } catch { /* ignore parse errors */ }
  }

  // Recent planning insights (last 5 assistant messages)
  if (plannerTimelines) {
    try {
      const timelines: PlannerTimeline[] = JSON.parse(plannerTimelines);
      const allMessages = timelines.flatMap(t => t.messages || []);
      const assistantMessages = allMessages
        .filter(m => m.role === "assistant")
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 5)
        .map(m => m.content)
        .join(" ");
      if (assistantMessages) {
        parts.push(`Recent planning insights: ${assistantMessages}`);
      }
    } catch { /* ignore parse errors */ }
  }

  return parts.join(" ");
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
type Platform = "x" | "linkedin" | "instagram" | "tiktok" | "devto" | "medium";
type Tone = "professional" | "casual" | "hype" | "storyteller" | "minimal";

export default function AIContentPage() {
  const [platform, setPlatform] = useState<Platform>("x");
  const [task, setTask] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoContext, setAutoContext] = useState("");
  const [nextAutoTime, setNextAutoTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("");

  // Load context on mount
  useEffect(() => {
    setAutoContext(buildContextFromStorage());
  }, []);

  // Auto‑generate every 8 hours
  useEffect(() => {
    const checkAndGenerate = () => {
      const lastGen = localStorage.getItem("lastContentGen");
      const now = Date.now();
      const eightHours = 8 * 60 * 60 * 1000;

      if (!lastGen || now - parseInt(lastGen) > eightHours) {
        generateContent(true); // auto generate using only context
        localStorage.setItem("lastContentGen", now.toString());
      }
      setNextAutoTime((parseInt(lastGen || "0") + eightHours) - now);
    };

    checkAndGenerate();
    const interval = setInterval(checkAndGenerate, 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // generateContent is stable enough

  // Update countdown display
  useEffect(() => {
    if (!nextAutoTime) return;
    const updateCountdown = () => {
      if (nextAutoTime <= 0) {
        setCountdown("Ready");
        return;
      }
      const hours = Math.floor(nextAutoTime / (1000 * 60 * 60));
      const minutes = Math.floor((nextAutoTime % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown(`${hours}h ${minutes}m`);
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextAutoTime]);

  // Generate content (isAuto = true for timer‑triggered)
  const generateContent = async (isAuto = false) => {
    const promptText = isAuto
      ? autoContext
      : (task.trim() ? task + "\n\nContext:\n" + autoContext : autoContext);

    if (!promptText.trim()) {
      alert("No context available. Please complete some tasks first.");
      return;
    }

    setLoading(true);
    setGeneratedContent("");

    try {
      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, task: promptText, tone }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setGeneratedContent(data.content);
    } catch (error) {
      console.error("Generation error:", error);
      setGeneratedContent("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPlatformIcon = (p: Platform) => {
    switch (p) {
      case "x": return <Twitter size={18} />;
      case "linkedin": return <Linkedin size={18} />;
      case "instagram": return <Instagram size={18} />;
      case "tiktok": return <Video size={18} />;
      case "devto": return <FileText size={18} />;
      case "medium": return <FileText size={18} />;
    }
  };

  const platformLabels: Record<Platform, string> = {
    x: "X",
    linkedin: "LinkedIn",
    instagram: "Instagram",
    tiktok: "TikTok",
    devto: "Dev.to",
    medium: "Medium",
  };

  const getPlatformNotice = (p: Platform) => {
    switch (p) {
      case "instagram":
      case "tiktok":
        return "🎥 Generates a short video script (hook, main content, CTA)";
      case "devto":
      case "medium":
        return "📝 Generates a full article with title, sections, and tags";
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-6 animate-in fade-in duration-1000 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with auto‑generation countdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">AI Content</h1>
            <p className="text-gray-500">Turn your streak into social proof instantly.</p>
          </div>
          <div className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <Clock size={16} className="text-blue-400" />
            <span>Next auto: {countdown}</span>
          </div>
        </div>

        {/* Platform selector */}
        <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl flex-wrap">
          {(Object.keys(platformLabels) as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
                platform === p ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"
              }`}
            >
              {getPlatformIcon(p)} {platformLabels[p]}
            </button>
          ))}
        </div>

        {/* Platform notice */}
        {getPlatformNotice(platform) && (
          <div className="text-sm text-blue-400 bg-blue-600/10 border border-blue-500/30 rounded-xl px-4 py-2">
            {getPlatformNotice(platform)}
          </div>
        )}

        {/* User input – combined with context */}
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Your custom instructions <span className="text-gray-500 font-normal">(optional – we wll combine with your actual data)</span>
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., Make it funny, focus on the technical challenge, or leave empty to use only your actual progress."
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-blue-500 min-h-30"
          />
          {autoContext && (
            <p className="text-xs text-gray-500 italic">
              Context that will be added: {autoContext.substring(0, 150)}…
            </p>
          )}
        </div>

        {/* Tone selector */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Tone:</span>
          <div className="flex gap-2 flex-wrap">
            {(["professional", "casual", "hype", "storyteller", "minimal"] as Tone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  tone === t ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div className="flex gap-4">
          <button
            onClick={() => generateContent(false)}
            disabled={loading}
            className="flex-1 py-5 bg-blue-600 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-500 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                GENERATING...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                GENERATE CONTENT
              </>
            )}
          </button>
        </div>

        {/* Generated content display */}
        {generatedContent && (
          <div className="p-8 rounded-[3rem] bg-white/5 border border-white/10 relative">
            <div className="absolute top-8 right-8 text-white/5">
              <MessageSquare size={120} />
            </div>
            <p className="text-xl font-medium leading-relaxed whitespace-pre-wrap relative z-10">
              {generatedContent}
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={copyToClipboard}
                className="flex-1 py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {copied ? <><Check size={20} /> COPIED</> : <><Copy size={20} /> COPY</>}
              </button>
              <button
                onClick={() => generateContent(false)}
                className="py-4 px-6 bg-white/10 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/20 transition"
              >
                <RefreshCw size={20} />
                REGENERATE
              </button>
            </div>
          </div>
        )}

        {/* Context preview (if no generation yet) */}
        {autoContext && !generatedContent && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-gray-400">
            <p className="font-bold mb-1">Your current context:</p>
            <p className="italic">{autoContext}</p>
          </div>
        )}
      </div>
    </div>
  );
}