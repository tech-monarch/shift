"use client";
import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Sparkles, BrainCircuit, Plus, Send, Trash2,
  MessageSquare, Clock, ChevronRight, X, Download, GripVertical
} from "lucide-react";

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface Timeline {
  id: string;
  name: string;
  messages: Message[];
  createdAt: number;
}

// ----------------------------------------------------------------------
// Helper: localStorage
// ----------------------------------------------------------------------
const saveTimelines = (timelines: Timeline[]) => {
  localStorage.setItem("planner_timelines", JSON.stringify(timelines));
};

const loadTimelines = (): Timeline[] => {
  const saved = localStorage.getItem("planner_timelines");
  if (saved) return JSON.parse(saved);
  return [
    {
      id: uuidv4(),
      name: "My First Plan",
      messages: [
        {
          role: "assistant",
          content: "Hi! I'm your AI planning assistant. Tell me your goal for this timeline, and I'll help you break it down into actionable steps.",
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
    },
  ];
};

// ----------------------------------------------------------------------
// Custom Hook: useDraggable
// ----------------------------------------------------------------------
function useDraggable(initialPos: { x: number; y: number }) {
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offsetRef.current.x,
        y: e.clientY - offsetRef.current.y,
      });
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !e.touches[0]) return;
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - offsetRef.current.x,
        y: e.touches[0].clientY - offsetRef.current.y,
      });
    };
    const handleUp = () => setIsDragging(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleUp);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleUp);
    document.addEventListener("touchcancel", handleUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleUp);
      document.removeEventListener("touchcancel", handleUp);
    };
  }, [isDragging]);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    offsetRef.current = {
      x: clientX - position.x,
      y: clientY - position.y,
    };
    setIsDragging(true);
  };

  return { position, startDrag, isDragging, dragRef };
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
export default function AIPlannerPage() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [activeTimelineId, setActiveTimelineId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [newTimelineName, setNewTimelineName] = useState("");
  const [widgetOpen, setWidgetOpen] = useState(false); // dropdown open/close

  // Draggable widget position (load from localStorage if available)
  const savedPos = typeof window !== "undefined"
    ? localStorage.getItem("widgetPos")
    : null;
  const initialPos = savedPos ? JSON.parse(savedPos) : { x: 20, y: 100 };
  const { position, startDrag, isDragging, dragRef } = useDraggable(initialPos);

  // Save widget position when it changes
  useEffect(() => {
    localStorage.setItem("widgetPos", JSON.stringify(position));
  }, [position]);

  // Load timelines on mount
  useEffect(() => {
    const loaded = loadTimelines();
    setTimelines(loaded);
    if (loaded.length > 0) setActiveTimelineId(loaded[0].id);
  }, []);

  // Save whenever timelines change
  useEffect(() => {
    if (timelines.length > 0) saveTimelines(timelines);
  }, [timelines]);

  const activeTimeline = timelines.find((t) => t.id === activeTimelineId);

  // Add new timeline
  const addTimeline = () => {
    const name = newTimelineName.trim() || `Timeline ${timelines.length + 1}`;
    const newTimeline: Timeline = {
      id: uuidv4(),
      name,
      messages: [
        {
          role: "assistant",
          content: "New timeline created. What's your focus?",
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
    };
    setTimelines(prev => [...prev, newTimeline]);
    setActiveTimelineId(newTimeline.id);
    setNewTimelineName("");
    setWidgetOpen(false);
  };

  const deleteTimeline = (id: string) => {
    if (timelines.length === 1) {
      alert("You need at least one timeline.");
      return;
    }
    const updated = timelines.filter((t) => t.id !== id);
    setTimelines(updated);
    if (activeTimelineId === id) setActiveTimelineId(updated[0].id);
  };

  const renameTimeline = (id: string, newName: string) => {
    setTimelines(timelines.map((t) => (t.id === id ? { ...t, name: newName } : t)));
  };

  // Send message to AI
  const sendMessage = async () => {
    if (!inputText.trim() || !activeTimeline || loading) return;

    const userMessage: Message = {
      role: "user",
      content: inputText,
      timestamp: Date.now(),
    };
    const updatedMessages = [...activeTimeline.messages, userMessage];
    setTimelines(
      timelines.map((t) =>
        t.id === activeTimelineId ? { ...t, messages: updatedMessages } : t
      )
    );
    setInputText("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };
      setTimelines(
        timelines.map((t) =>
          t.id === activeTimelineId
            ? { ...t, messages: [...updatedMessages, assistantMessage] }
            : t
        )
      );
    } catch (error) {
      console.error("AI error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      setTimelines(
        timelines.map((t) =>
          t.id === activeTimelineId
            ? { ...t, messages: [...updatedMessages, errorMessage] }
            : t
        )
      );
    } finally {
      setLoading(false);
    }
  };

  // Prefill prompt
  const generateInitialPlan = () => {
    setInputText("I want to achieve a major goal. Help me break it down into actionable steps.");
  };

  // Send to Content Generator
  const useForContent = () => {
    if (!activeTimeline) return;
    const lastAssistantMessage = activeTimeline.messages
      .filter((m) => m.role === "assistant")
      .pop();
    if (lastAssistantMessage) {
      localStorage.setItem("contentGenDraft", JSON.stringify({
        text: lastAssistantMessage.content,
        timelineName: activeTimeline.name,
        timestamp: Date.now(),
      }));
      alert("Draft saved! Go to Content Generator to use it.");
    }
  };

  // Format time
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen text-white p-4 md:p-6 animate-in fade-in duration-1000 pb-24 relative overflow-hidden">
      {/* Main chat area - full screen */}
      <div className="h-[calc(100vh-120px)] flex flex-col bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        {activeTimeline ? (
          <ChatArea
            timeline={activeTimeline}
            loading={loading}
            onSend={sendMessage}
            inputText={inputText}
            setInputText={setInputText}
            formatTime={formatTime}
            onUseForContent={useForContent}
            onGenerateInitialPlan={generateInitialPlan}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Create a timeline to start planning.
          </div>
        )}
      </div>

      {/* Draggable Timeline Widget */}
      <DraggableTimelineWidget
        ref={dragRef}
        position={position}
        onDragStart={startDrag}
        isDragging={isDragging}
        currentTimelineName={activeTimeline?.name || "Select"}
        isOpen={widgetOpen}
        onToggle={() => setWidgetOpen(!widgetOpen)}
      >
        {widgetOpen && (
          <TimelineDropdown
            timelines={timelines}
            activeId={activeTimelineId}
            onSelect={(id) => {
              setActiveTimelineId(id);
              setWidgetOpen(false);
            }}
            onAdd={addTimeline}
            onDelete={deleteTimeline}
            onRename={renameTimeline}
            newName={newTimelineName}
            setNewName={setNewTimelineName}
            onClose={() => setWidgetOpen(false)}
          />
        )}
      </DraggableTimelineWidget>
    </div>
  );
}

// ----------------------------------------------------------------------
// Draggable Timeline Widget
// ----------------------------------------------------------------------
const DraggableTimelineWidget = React.forwardRef<
  HTMLDivElement,
  {
    position: { x: number; y: number };
    onDragStart: (e: React.MouseEvent | React.TouchEvent) => void;
    isDragging: boolean;
    currentTimelineName: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }
>(({ position, onDragStart, isDragging, currentTimelineName, isOpen, onToggle, children }, ref) => {
  return (
    <div
      ref={ref}
      className="fixed z-50"
      style={{ left: position.x, top: position.y }}
    >
      {/* Widget button */}
      <div
        className={`flex items-center gap-2 bg-slate-900 border border-white/20 rounded-full px-4 py-2 shadow-xl backdrop-blur-md cursor-pointer select-none ${
          isDragging ? "opacity-75" : ""
        }`}
        onMouseDown={onDragStart}
        onTouchStart={onDragStart}
        onClick={(e) => {
          // Only toggle if not dragging
          if (!isDragging) onToggle();
        }}
      >
        <GripVertical size={16} className="text-gray-400" />
        <span className="font-medium text-sm truncate max-w-[120px]">
          {currentTimelineName}
        </span>
        <ChevronRight size={16} className={`transition-transform ${isOpen ? "rotate-90" : ""}`} />
      </div>

      {/* Dropdown panel */}
      {children}
    </div>
  );
});
DraggableTimelineWidget.displayName = "DraggableTimelineWidget";

// ----------------------------------------------------------------------
// Timeline Dropdown (appears when widget is clicked)
// ----------------------------------------------------------------------
function TimelineDropdown({
  timelines,
  activeId,
  onSelect,
  onAdd,
  onDelete,
  onRename,
  newName,
  setNewName,
  onClose,
}: {
  timelines: Timeline[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  newName: string;
  setNewName: (name: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute left-0 top-12 w-64 bg-slate-900 border border-white/20 rounded-2xl p-3 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Timelines</h3>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10">
          <X size={14} />
        </button>
      </div>

      {/* Add new timeline */}
      <div className="flex gap-1 mb-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New name..."
          className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
        />
        <button
          onClick={onAdd}
          className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Timeline list */}
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {timelines.map((t) => (
          <div
            key={t.id}
            className={`p-2 rounded-xl border transition-all cursor-pointer group ${
              activeId === t.id
                ? "bg-blue-600/20 border-blue-500"
                : "bg-white/5 border-white/10 hover:bg-white/10"
            }`}
            onClick={() => onSelect(t.id)}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={12} className="text-gray-400" />
              <input
                type="text"
                value={t.name}
                onChange={(e) => onRename(t.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(t.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-red-500/20 transition"
              >
                <Trash2 size={10} className="text-red-400" />
              </button>
            </div>
            <div className="flex items-center gap-1 mt-0.5 text-[8px] text-gray-500">
              <Clock size={8} />
              <span>{new Date(t.createdAt).toLocaleDateString()}</span>
              <span className="ml-auto">{t.messages.length} msgs</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// ChatArea Component (unchanged)
// ----------------------------------------------------------------------
function ChatArea({
  timeline,
  loading,
  onSend,
  inputText,
  setInputText,
  formatTime,
  onUseForContent,
  onGenerateInitialPlan,
}: {
  timeline: Timeline;
  loading: boolean;
  onSend: () => void;
  inputText: string;
  setInputText: (text: string) => void;
  formatTime: (ts: number) => string;
  onUseForContent: () => void;
  onGenerateInitialPlan: () => void;
}) {
  return (
    <>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit size={20} className="text-blue-400" />
          <h2 className="font-bold text-lg truncate">{timeline.name}</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onGenerateInitialPlan}
            className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30"
            title="Start with a goal"
          >
            <Sparkles size={18} />
          </button>
          <button
            onClick={onUseForContent}
            className="p-2 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30"
            title="Use for Content"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {timeline.messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white/10 border border-white/10 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[10px] text-gray-400 mt-1 text-right">
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 border border-white/10 p-4 rounded-2xl rounded-bl-none">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-150" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-300" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSend()}
            placeholder="Ask the AI to break down your goal..."
            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            onClick={onSend}
            disabled={loading || !inputText.trim()}
            className="p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </>
  );
}