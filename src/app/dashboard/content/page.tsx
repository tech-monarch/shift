"use client";
import React, { useState } from "react";
import { MessageSquare, Twitter, Linkedin, Copy, RefreshCw, Check } from "lucide-react";

export default function AIContentPage() {
  const [platform, setPlatform] = useState<"x" | "li">("x");
  const [copied, setCopied] = useState(false);

  const xContent = "Day 14 of the Lock-In.\n\nBuilt the entire AI content engine for Shift. The momentum is getting scary now. \n\nDon't let your streaks die. Keep building. \n\n#Shift #BuildInPublic";
  const liContent = "Consistent execution is the only hack.\n\nToday marks 14 days of building Shift. We just deployed the AI content automation layer.\n\nIf you want to move the needle, you have to lock in. No excuses. #Productivity #Founders";

  const copy = () => {
    navigator.clipboard.writeText(platform === "x" ? xContent : liContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase">AI Content</h1>
          <p className="text-gray-500">Turn your streak into social proof instantly.</p>
        </div>
        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-blue-400">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="flex gap-3 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <button 
          onClick={() => setPlatform("x")}
          className={`px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all ${platform === 'x' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
        >
          <Twitter size={18} /> X
        </button>
        <button 
          onClick={() => setPlatform("li")}
          className={`px-6 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-all ${platform === 'li' ? 'bg-blue-700 text-white' : 'text-gray-500'}`}
        >
          <Linkedin size={18} /> LinkedIn
        </button>
      </div>

      <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 relative">
        <div className="absolute top-8 right-8 text-white/5">
          <MessageSquare size={120} />
        </div>
        <p className="text-2xl font-medium leading-relaxed whitespace-pre-wrap relative z-10">
          {platform === "x" ? xContent : liContent}
        </p>
        
        <button 
          onClick={copy}
          className="mt-12 w-full py-5 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          {copied ? <><Check size={20} /> COPIED TO CLIPBOARD</> : <><Copy size={20} /> COPY DRAFT</>}
        </button>
      </div>
    </div>
  );
}