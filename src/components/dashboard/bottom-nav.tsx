"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, Lightbulb, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', href: '/dashboard/planner', icon: Lightbulb },
    { name: 'Content', href: '/dashboard/content', icon: MessageSquare },
    { name: 'Profile', href: '/', icon: User },
  ];

  return (
    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6 z-50">
      <nav className="flex items-center justify-around w-full max-w-sm h-20 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] px-4 shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
                isActive ? 'text-blue-400 scale-110' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'opacity-100' : 'opacity-50'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}