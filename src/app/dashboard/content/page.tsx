"use client";
import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Twitter, Linkedin, Copy, RefreshCw, 
  Check, Instagram, Video, Sparkles, FileText, Clock 
} from "lucide-react";

type Platform = "x" | "linkedin" | "instagram" | "tiktok" | "devto" | "medium";
type Tone = "professional" | "casual" | "hype" | "storyteller" | "minimal";

// ----------------------------------------------------------------------
// Helper: gather context from localStorage
// ----------------------------------------------------------------------
const buildContextFromStorage = (): string => {
  const today = new Date().toISOString().split("T")[0];
  const streak = localStorage.getItem("shift_streak") || "0";
  const tasksToday = localStorage.getItem(`tasks_${today}`);
  const weekData = localStorage.getItem("weekData");
  const plannerTimelines = localStorage.getItem("planner_timelines");

  let context = `You have a streak of ${streak} days. `;

  // Today's tasks
  if (tasksToday) {
    try {
      const tasks = JSON.parse(tasksToday);
      const completed = tasks.filter((t: any) => t.completed).length;
      const total = tasks.length;
      context += `Today you completed ${completed} out of ${total} tasks: `;
      context += tasks.map((t: any) => t.text).join(", ");
      context += ". ";
    } catch (e) {}
  }

  // Week data summary
  if (weekData) {
    try {
      const week = JSON.parse(weekData);
      const totalCompleted = week.reduce((acc: number, d: any) => acc + d.completed, 0);
      const totalTasks = week.reduce((acc: number, d: any) => acc + d.total, 0);
      const avg = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;
      context += `Over the last 7 days, you completed ${totalCompleted} out of ${totalTasks} tasks (${avg}% consistency). `;
    } catch (e) {}
  }

  // Recent planning conversations (last 5 assistant messages)
  if (plannerTimelines) {
    try {
      const timelines = JSON.parse(plannerTimelines);
      // Flatten all messages from all timelines, sort by timestamp, take last 5 assistant messages
      const allMessages = timelines.flatMap((t: any) => t.messages || []);
      const assistantMessages = allMessages
        .filter((m: any) => m.role === "assistant")
        .sort((a: any, b: any) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 5)
        .map((m: any) => m.content)
        .join(" ");
      if (assistantMessages) {
        context += `Recent planning insights: ${assistantMessages}`;
      }
    } catch (e) {}
  }

  return context;
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
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

  // Load context from localStorage on mount
  useEffect(() => {
    const context = buildContextFromStorage();
    setAutoContext(context);
    // Optionally prefill task with context (or leave empty for auto‑use)
  }, []);

  // Auto‑generate every 8 hours
  useEffect(() => {
    const checkAndGenerate = () => {
      const lastGen = localStorage.getItem("lastContentGen");
      const now = Date.now();
      const eightHours = 8 * 60 * 60 * 1000;

      if (!lastGen || now - parseInt(lastGen) > eightHours) {
        // Auto‑generate
        generateContent(true);
        localStorage.setItem("lastContentGen", now.toString());
      }
      setNextAutoTime((parseInt(lastGen || "0") + eightHours) - now);
    };

    checkAndGenerate();
    const interval = setInterval(checkAndGenerate, 60 * 1000); // check every minute
    return () => clearInterval(interval);
  }, []);

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

  const generateContent = async (useAutoContext = false) => {
    const promptText = useAutoContext && !task.trim() ? autoContext : task;
    if (!promptText.trim()) {
      alert("Please describe your task or achievement, or wait for auto‑context.");
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

  // Platform-specific notices
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
        {/* Header with auto‑generation info */}
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
            <PlatformButton
              key={p}
              active={platform === p}
              onClick={() => setPlatform(p)}
              icon={getPlatformIcon(p)}
              label={platformLabels[p]}
            />
          ))}
        </div>

        {/* Platform notice */}
        {getPlatformNotice(platform) && (
          <div className="text-sm text-blue-400 bg-blue-600/10 border border-blue-500/30 rounded-xl px-4 py-2">
            {getPlatformNotice(platform)}
          </div>
        )}

        {/* Task input – can be left empty to use auto context */}
        <div className="space-y-2">
          <label className="text-sm font-bold uppercase tracking-widest text-gray-400">
            What did you accomplish? <span className="text-gray-500 font-normal">(leave empty to use your actual data)</span>
          </label>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., I completed my daily Lock-In task: 'Write 500 words' for 14 days straight."
            className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-lg focus:outline-none focus:border-blue-500 min-h-[120px]"
          />
          {!task && autoContext && (
            <p className="text-xs text-gray-500 italic">Using your actual data: {autoContext.substring(0, 100)}…</p>
          )}
        </div>

        {/* Tone selector */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Tone:</span>
          <div className="flex gap-2 flex-wrap">
            <ToneButton active={tone === "professional"} onClick={() => setTone("professional")} label="Professional" />
            <ToneButton active={tone === "casual"} onClick={() => setTone("casual")} label="Casual" />
            <ToneButton active={tone === "hype"} onClick={() => setTone("hype")} label="Hype" />
            <ToneButton active={tone === "storyteller"} onClick={() => setTone("storyteller")} label="Storyteller" />
            <ToneButton active={tone === "minimal"} onClick={() => setTone("minimal")} label="Minimal" />
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
                GENERATE NOW
              </>
            )}
          </button>
          <button
            onClick={() => generateContent(true)}
            disabled={loading}
            className="py-5 px-6 bg-white/10 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-white/20 transition disabled:opacity-50"
            title="Use auto context even if you typed something"
          >
            <RefreshCw size={20} />
            AUTO
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

        {/* Context preview */}
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

// Helper components
function PlatformButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold transition-all ${
        active ? "bg-blue-600 text-white" : "text-gray-500 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function ToneButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
        active ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}