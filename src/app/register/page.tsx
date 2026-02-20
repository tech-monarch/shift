"use client";
import AuthCard from "@/components/auth/auth-card";

export default function RegisterPage() {
  return (
    <AuthCard 
      title="Join Shift" 
      subtitle="The future of speed starts here"
      footerText="Already have an account?"
      footerLink="/login"
      footerAction="Sign in"
    >
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">First Name</label>
            <input type="text" className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Last Name</label>
            <input type="text" className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Email</label>
          <input type="email" className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Password</label>
          <input type="password" placeholder="Min. 8 characters" className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
        </div>
        <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] mt-4">
          Create Account
        </button>
      </form>
    </AuthCard>
  );
}