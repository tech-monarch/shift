"use client";
import AuthCard from "@/components/auth/auth-card";

export default function LoginPage() {
  return (
    <AuthCard 
      title="Welcome back" 
      subtitle="Sign in to your Shift account"
      footerText="New to Shift?"
      footerLink="/register"
      footerAction="Create an account"
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
          <input 
            type="email" 
            placeholder="you@example.com"
            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot?</a>
          </div>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          />
        </div>
        <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all active:scale-[0.98] shadow-xl shadow-white/5">
          Sign In
        </button>
      </form>
    </AuthCard>
  );
}