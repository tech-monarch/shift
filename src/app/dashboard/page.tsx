"use client";
import React, { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import {
  CheckCircle, Target, Flame, Info,
  BarChart, Users, Award, Clock, User, LogOut, DownloadCloud,
  Lightbulb, MessageSquare, Plus, Trash2, Share2
} from "lucide-react";

// ----------------------------------------------------------------------
// Types & helpers
// ----------------------------------------------------------------------
interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface DayData {
  date: string;          // YYYY-MM-DD
  completed: number;
  total: number;
}

const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------
export default function DashboardPage() {
  // ---------- Core State ----------
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [username] = useState("builder_jane");
  const [identityLabel, setIdentityLabel] = useState("Day 1 Warrior");
  const [timeLeft, setTimeLeft] = useState("");
  const [showMilestone, setShowMilestone] = useState(false);

  // Ref for the streak card (the part we want to download)
  const streakCardRef = useRef<HTMLDivElement>(null);

  // ---------- Load from localStorage (initial render only) ----------
  useEffect(() => {
    const today = getTodayString();

    const savedTasks = localStorage.getItem(`tasks_${today}`);
    if (savedTasks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTasks(JSON.parse(savedTasks));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTasks([{ id: crypto.randomUUID(), text: "Write 500 words", completed: false }]);
    }

    const savedWeek = localStorage.getItem("weekData");
    if (savedWeek) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeekData(JSON.parse(savedWeek));
    } else {
      const mockWeek: DayData[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        mockWeek.push({ date: dateStr, completed: 3, total: 4 });
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWeekData(mockWeek);
    }

    const savedStreak = localStorage.getItem("streak");
    if (savedStreak) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStreak(parseInt(savedStreak));
    }
    const savedLongest = localStorage.getItem("longestStreak");
    if (savedLongest) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLongestStreak(parseInt(savedLongest));
    }
  }, []);

  // Save tasks and update weekData/streak whenever tasks change
  useEffect(() => {
    const today = getTodayString();

    localStorage.setItem(`tasks_${today}`, JSON.stringify(tasks));

    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWeekData((prev) => {
      const existingIndex = prev.findIndex((d) => d.date === today);
      let newWeek = [...prev];
      if (existingIndex >= 0) {
        newWeek[existingIndex] = { date: today, completed: completedCount, total: totalCount };
      } else {
        newWeek.push({ date: today, completed: completedCount, total: totalCount });
      }
      newWeek.sort((a, b) => a.date.localeCompare(b.date));
      if (newWeek.length > 7) newWeek = newWeek.slice(-7);
      localStorage.setItem("weekData", JSON.stringify(newWeek));
      return newWeek;
    });

    const allCompleted = tasks.length > 0 && tasks.every((t) => t.completed);
    const todayData = weekData.find((d) => d.date === today);
    const alreadyCompletedToday = todayData ? todayData.completed === todayData.total : false;

    if (allCompleted && !alreadyCompletedToday) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("streak", newStreak.toString());
      if (newStreak > longestStreak) {
        setLongestStreak(newStreak);
        localStorage.setItem("longestStreak", newStreak.toString());
      }
      if ([7, 30, 90, 180, 365].includes(newStreak)) {
        setShowMilestone(true);
        setTimeout(() => setShowMilestone(false), 3000);
      }
    } else if (!allCompleted && streak > 0 && !alreadyCompletedToday) {
      setStreak(0);
      localStorage.setItem("streak", "0");
    }
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check for day change every minute
  useEffect(() => {
    const checkDate = () => {
      const today = getTodayString();
      const storedDate = localStorage.getItem("currentDate");
      if (storedDate !== today) {
        setTasks([]);
        localStorage.setItem("currentDate", today);
        setWeekData((prev) => {
          if (!prev.find((d) => d.date === today)) {
            const newWeek = [...prev, { date: today, completed: 0, total: 0 }].slice(-7);
            localStorage.setItem("weekData", JSON.stringify(newWeek));
            return newWeek;
          }
          return prev;
        });
      }
    };
    checkDate();
    const interval = setInterval(checkDate, 60000);
    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Identity based on streak
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (streak >= 90) setIdentityLabel("90-Day Legend");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (streak >= 30) setIdentityLabel("30-Day Master");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (streak >= 14) setIdentityLabel("14-Day Builder");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (streak >= 7) setIdentityLabel("7-Day Rookie");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else setIdentityLabel("Day 1 Warrior");
  }, [streak]);

  // ---------- Actions ----------
  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  // Download streak card as PNG
  const handleDownloadStreakCard = async () => {
    if (!streakCardRef.current) return;

    try {
      const dataUrl = await toPng(streakCardRef.current, {
        quality: 0.95,
        backgroundColor: "#0f172a", // match bg-slate-950
      });
      const link = document.createElement("a");
      link.download = `streak-${streak}-days.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate streak card:", error);
      alert("Could not generate image. Please try again.");
    }
  };

  // Stats for today and week
  const todayCompleted = tasks.filter((t) => t.completed).length;
  const todayTotal = tasks.length;
  const weekCompleted = weekData.reduce((acc, d) => acc + d.completed, 0);
  const weekTotal = weekData.reduce((acc, d) => acc + d.total, 0);
  const weekRate = weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;

  // ---------- Render ----------
  return (
    <div className="min-h-screen text-white p-4 md:p-6 space-y-6 pb-32 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-orange-500 to-pink-500 flex items-center justify-center">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-400">@{username}</p>
            <h2 className="font-bold text-lg">{identityLabel}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <Clock size={12} className="inline mr-1" />
            {timeLeft}
          </div>
          <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Milestone Banner */}
      {showMilestone && (
        <div className="animate-bounce bg-linear-to-r from-purple-600 to-pink-600 text-white p-4 rounded-3xl text-center font-bold">
          🎉 {streak} DAYS! You&apos;ve reached a milestone! 🎉
        </div>
      )}

      {/* ---------- STATS CARDS (2x2 on mobile) ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Completed Today"
          value={todayCompleted.toString()}
          total={todayTotal.toString()}
          icon={<CheckCircle className="text-green-500" />}
        />
        <StatCard
          title="Tasks Today"
          value={todayTotal.toString()}
          icon={<Target className="text-blue-500" />}
        />
        <StatCard
          title="Week Completed"
          value={weekCompleted.toString()}
          total={weekTotal.toString()}
          icon={<BarChart className="text-yellow-500" />}
        />
        <StatCard
          title="Week Rate"
          value={`${weekRate}%`}
          icon={<Award className="text-purple-500" />}
        />
      </div>

      {/* ---------- QUICK ACTIONS ---------- */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 rounded-2xl bg-linear-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center gap-2 font-medium hover:bg-white/5 transition">
          <Lightbulb size={18} className="text-yellow-500" />
          Plan with AI
        </button>
        <button className="p-4 rounded-2xl bg-linear-to-br from-green-600/20 to-teal-600/20 border border-white/10 flex items-center justify-center gap-2 font-medium hover:bg-white/5 transition">
          <MessageSquare size={18} className="text-green-500" />
          AI Postings
        </button>
      </div>

      {/* ---------- TASKS SECTION ---------- */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
            <CheckCircle size={16} /> TODAY&apos;S TASKS
          </h3>
          <span className="text-xs text-gray-500">{todayCompleted}/{todayTotal} done</span>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a new task..."
            className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addTask}
            className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks yet. Add one above!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition group"
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-5 h-5 rounded flex items-center justify-center transition ${
                    task.completed ? "bg-green-500 text-white" : "bg-white/10 border border-white/20"
                  }`}
                >
                  {task.completed && <CheckCircle size={14} />}
                </button>
                <span className={`flex-1 text-sm ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 transition"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---------- HEATMAP (Weekly Intensity) ---------- */}
      <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Weekly Intensity</h3>
            <Info size={14} className="text-gray-600" />
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span>Less</span>
            <div className="w-2 h-2 rounded-xs bg-gray-800" />
            <div className="w-2 h-2 rounded-xs bg-blue-900" />
            <div className="w-2 h-2 rounded-xs bg-blue-700" />
            <div className="w-2 h-2 rounded-xs bg-blue-500" />
            <span>More</span>
          </div>
        </div>

        <div className="grid grid-flow-col grid-rows-5 gap-1.5 h-24">
          {weekData.map((day) => {
            const intensity = day.total > 0 ? day.completed / day.total : 0;
            const bgColor =
              intensity === 0
                ? "bg-white/5"
                : intensity < 0.3
                ? "bg-blue-900"
                : intensity < 0.6
                ? "bg-blue-700"
                : "bg-blue-500";
            return (
              <div
                key={day.date}
                className={`rounded-xs transition-all duration-500 ${bgColor}`}
                title={`${day.date}: ${day.completed}/${day.total} tasks`}
              />
            );
          })}
          {[...Array(35 - weekData.length)].map((_, i) => (
            <div key={`empty-${i}`} className="bg-white/5 rounded-xs" />
          ))}
        </div>
      </div>

      {/* ---------- SOCIAL CARDS ---------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-500/20">
              <User size={18} className="text-blue-500" />
            </div>
            <h3 className="font-bold">Public Profile</h3>
          </div>
          <p className="text-sm text-gray-400 mb-3">shift.xyz/@{username}</p>
          <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm font-medium flex items-center justify-center gap-2">
            <Share2 size={14} /> Copy Link
          </button>
        </div>

        <div className="p-5 rounded-3xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-purple-500/20">
              <Users size={18} className="text-purple-500" />
            </div>
            <h3 className="font-bold">Accountability Circle</h3>
          </div>
          <div className="flex -space-x-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-500 to-orange-500 border-2 border-black" />
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 border-2 border-black" />
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-green-500 to-teal-500 border-2 border-black" />
            <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-black flex items-center justify-center text-xs">+3</div>
          </div>
          <button className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm font-medium">
            Invite Friends
          </button>
        </div>
      </div>

      {/* ---------- STREAK SHOWCASE (with ref for download) ---------- */}
      <div
        ref={streakCardRef}
        className="relative overflow-hidden rounded-[3rem] bg-slate-950 border border-white/10 group"
      >
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-transparent to-purple-600/10 opacity-50" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors" />

        <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-3">
              <Flame size={14} className="text-orange-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                {streak >= 90 ? "Legendary" : streak >= 30 ? "Master" : streak >= 14 ? "Unstoppable" : "Building Momentum"}
              </span>
            </div>
            <h2 className="text-8xl md:text-9xl font-black italic tracking-tighter leading-none bg-linear-to-b from-white to-gray-500 bg-clip-text text-transparent">
              {streak}
            </h2>
            <p className="text-gray-400 font-medium mt-2">
              Day streak · Longest: {longestStreak}
            </p>
            <div className="mt-4 w-64">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Next milestone: {streak < 7 ? 7 : streak < 30 ? 30 : streak < 90 ? 90 : 180}</span>
                <span>{Math.min(100, Math.floor((streak % 7) / 7 * 100))}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${Math.min(100, (streak % 7) / 7 * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full md:w-auto">
            <div className="p-5 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Flame size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase">Current Streak</p>
                  <p className="text-2xl font-bold">{streak} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Download button (outside the ref) */}
      <div className="flex justify-end">
        <button
          onClick={handleDownloadStreakCard}
          className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all active:scale-95 border border-white/10"
        >
          <DownloadCloud size={18} />
          Download Streak Card
        </button>
      </div>

      {/* Demo controls (development only) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4 bg-black/80 border border-white/20 p-3 rounded-2xl text-xs z-50">
          <button onClick={() => setStreak(29)} className="block mb-1">Set 29 days</button>
          <button onClick={() => setStreak(89)} className="block mb-1">Set 89 days</button>
          <button onClick={() => setStreak(0)} className="block">Reset streak</button>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// StatCard subcomponent
// ----------------------------------------------------------------------
function StatCard({ title, value, total, icon }: { title: string; value: string; total?: string; icon: React.ReactNode }) {
  return (
    <div className="p-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 rounded-xl bg-white/5">{icon}</div>
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{title}</p>
      <div className="flex items-baseline gap-1">
        <p className="text-xl font-bold">{value}</p>
        {total && <span className="text-[10px] text-gray-600">/ {total}</span>}
      </div>
    </div>
  );
}