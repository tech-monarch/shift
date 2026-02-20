"use client";
import BottomNav from "@/components/dashboard/bottom-nav";
import { Home, MessageSquare, Lightbulb, User, LayoutDashboard, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Planner', href: '/dashboard/planner', icon: Lightbulb },
    { name: 'AI Content', href: '/dashboard/content', icon: MessageSquare },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-sans">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 border-r border-white/10 flex-col p-6 sticky top-0 h-screen bg-[#050505]">
        <div className="mb-12 px-2">
          <span className="text-2xl font-black tracking-tighter italic text-blue-500">SHIFT</span>
        </div>
        
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-[10px] text-gray-500 uppercase font-black mb-2 tracking-widest">Operator Status</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold">PRO ACTIVE</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4" />
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 pb-32 lg:pb-12 pt-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6">
          {children}
        </div>
      </main>

      {/* MOBILE NAV */}
      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
}