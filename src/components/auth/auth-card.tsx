import React from 'react';
import Link from 'next/link';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: string;
  footerAction: string;
}

export default function AuthCard({ children, title, subtitle, footerText, footerLink, footerAction }: AuthCardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold tracking-tighter text-white">SHIFT</Link>
          <h2 className="text-4xl font-extrabold text-white mt-8 tracking-tight">{title}</h2>
          <p className="text-gray-400 mt-3 text-lg">{subtitle}</p>
        </div>

        {/* The Glass Container */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          {children}
        </div>

        <p className="text-center text-gray-500 mt-10">
          {footerText}{' '}
          <Link href={footerLink} className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
            {footerAction}
          </Link>
        </p>
      </div>
    </div>
  );
}