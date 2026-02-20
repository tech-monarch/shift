"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Type for the beforeinstallprompt event (not standard, so we define it)
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Home() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // --- Client-side effects ---
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
      );
      revealElements.forEach((el) => observer.observe(el));
    }

    const navbar = document.querySelector(".island-nav");
    if (navbar) {
      const handleScroll = () => {
        if (window.scrollY > 10) {
          navbar.setAttribute(
            "style",
            "box-shadow: 0 12px 40px rgba(0,0,0,0.5); background-color: rgba(0, 0, 0, 0.35);"
          );
        } else {
          navbar.setAttribute(
            "style",
            "box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36); background-color: rgba(0, 0, 0, 0.25);"
          );
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleDownload = async () => {
    if (!deferredPrompt) {
      alert("To install Shift: \n1. Open in Safari/Chrome \n2. Tap 'Share' or the menu \n3. Select 'Add to Home Screen'");
      return;
    }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    // outcome not used further, so we ignore it
  };

  return (
    <>
      <style jsx>{`
        .island-nav {
          background: rgba(0, 0, 0, 0.25) !important;
          backdrop-filter: blur(12px) saturate(180%) !important;
          -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.36) !important;
          border-radius: 9999px !important;
          padding: 0.5rem 1rem !important;
          transition: all 0.3s ease;
        }
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.2, 0.9, 0.3, 1),
            transform 0.8s cubic-bezier(0.2, 0.9, 0.3, 1);
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }
        .glass-card {
          background: rgba(10, 10, 20, 0.3) !important;
          backdrop-filter: blur(8px) saturate(160%) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          box-shadow: 0 4px 24px -8px rgba(0, 0, 0, 0.4) !important;
        }
        .glass-panel {
          background: rgba(0, 0, 0, 0.2) !important;
          backdrop-filter: blur(16px) saturate(180%) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .glass-footer {
          background: rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        /* Background decorations */
        .bg-arrow-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5 L35 15 L25 15 Z' fill='%23f97316' opacity='0.03'/%3E%3C/svg%3E");
        }
        .bg-grid {
          background-image: linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      <div className="relative overflow-x-hidden">
        {/* Global background decorations */}
        <div className="fixed inset-0 pointer-events-none bg-grid opacity-50"></div>
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl"></div>
        </div>

        {/* --- Navbar --- */}
        <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 max-w-6xl z-50">
          <div className="island-nav flex items-center justify-between px-4 py-2 md:px-6">
            <div className="w-auto logo">
              <Link href="/" className="text-2xl font-bold text-white tracking-tight">
                SHIFT<span className="text-orange-500">.</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden lg:block">
                <ul className="flex items-center gap-6 text-sm md:text-base text-white/80">
                  <li><Link href="#features">Features</Link></li>
                  <li><Link href="#how">How it works</Link></li>
                  <li><Link href="#pricing">Pricing</Link></li>
                </ul>
              </nav>
              <button
                onClick={handleDownload}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-indigo-600 rounded-full hover:scale-105 transition"
              >
                Download App
              </button>
            </div>
          </div>
        </header>

        {/* --- Main content --- */}
        <div>
          {/* Hero section */}
          <section className="relative reveal" style={{ transitionDelay: "0.1s" }}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <svg className="absolute top-32 left-0 w-96 h-96 text-orange-500/5" viewBox="0 0 200 200" fill="none">
                <path d="M100 0 L200 100 L100 200 L0 100 Z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <svg className="absolute bottom-0 right-0 w-96 h-96 text-indigo-500/5 transform rotate-45" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>
            </div>

            <div className="container px-4 mx-auto max-w-8xl relative">
              <div className="flex flex-wrap items-center pt-32 pb-20">
                <div className="w-full lg:w-1/2 px-4">
                  <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                    Show Up for Your{" "}
                    <span className="bg-gradient-to-r from-orange-400 to-indigo-400 bg-clip-text text-transparent">
                      Future
                    </span>{" "}
                    Self.
                  </h1>
                  <p className="mt-6 text-xl text-gray-300 max-w-xl">
                    Shift is the productivity enforcement engine for founders, Students and Hustlers. Complete one daily
                    task, and AI turns your execution into Twitter/X posts, LinkedIn articles, Instagram captions, and
                    short‑form video scripts.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={handleDownload}
                      className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-indigo-600 rounded-xl hover:scale-105 transition"
                    >
                      Get Shift – It&apos;s Free
                    </button>
                    <Link
                      href="/dashboard"
                      className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 transition-all"
                    >
                      Get Started
                    </Link>
                  </div>
                  <p className="mt-4 text-sm text-gray-400">No credit card. PWA installs in seconds.</p>
                </div>
                <div className="w-full lg:w-1/2 px-4 mt-12 lg:mt-0">
                  <div className="glass-panel p-6 rounded-3xl relative">
                    <div className="absolute -top-3 -right-3 w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>
                    <Image
                      src="/images/hero.png"
                      alt="Shift dashboard on mobile"
                      width={400}
                      height={800}
                      className="rounded-xl w-full h-auto"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features section */}
          <section className="relative container px-4 mx-auto max-w-7xl mt-32 reveal delay-2" id="features">
            <div className="absolute inset-0 pointer-events-none bg-arrow-pattern opacity-20"></div>
            <div className="absolute top-20 left-10 w-40 h-40 border border-orange-500/10 rounded-full"></div>

            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                From Execution to<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-indigo-400">
                  Distribution in One Click
                </span>
              </h2>
              <p className="mt-4 text-gray-300 text-lg">
                Stop documenting manually. Let AI turn your daily work into content that builds your brand.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-8 rounded-2xl reveal delay-3 relative">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-500/10 rounded-full blur-md"></div>
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-2xl font-semibold text-white mb-3">Lock‑In System</h3>
                <p className="text-gray-400">
                  Set one non‑negotiable task each day. Build streaks that matter. Your commitment score grows with every
                  execution.
                </p>
              </div>
              <div className="glass-card p-8 rounded-2xl reveal delay-4 relative">
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-indigo-500/10 rounded-full blur-lg"></div>
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-2xl font-semibold text-white mb-3">AI Content Engine</h3>
                <p className="text-gray-400">
                  Complete your task → Gemini instantly writes X posts, LinkedIn articles, Instagram captions, and a
                  30‑second video script.
                </p>
              </div>
              <div className="glass-card p-8 rounded-2xl reveal delay-5 relative">
                <div className="absolute top-1/2 -right-6 w-20 h-20 border border-orange-500/10 rounded-full"></div>
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-2xl font-semibold text-white mb-3">Public Profile</h3>
                <p className="text-gray-400">
                  Share your journey at <span className="text-orange-400">shift.app/you</span>. Display your streak,
                  commitment score, and last 5 posts – proof you execute.
                </p>
              </div>
            </div>
          </section>

          {/* How it works */}
          <section className="relative container px-4 mx-auto max-w-7xl mt-32 reveal delay-2" id="how">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, rgba(249,115,22,0.02) 0px, rgba(249,115,22,0.02) 20px, transparent 20px, transparent 40px)",
              }}
            ></div>

            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white">One Button. Infinite Output.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-400 font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Lock In</h3>
                    <p className="text-gray-400">Define your one daily task – the one thing that moves the needle.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-400 font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Execute & Mark Done</h3>
                    <p className="text-gray-400">
                      Crush it, then hit “I Executed Today”. Your streak updates instantly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-400 font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">AI Generates Everything</h3>
                    <p className="text-gray-400">
                      X post, LinkedIn article, IG caption, and a 30‑second video script – all tailored to your task.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-400 font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Copy, Edit, Publish</h3>
                    <p className="text-gray-400">
                      Tweak if you want, then share everywhere. Your public profile updates automatically.
                    </p>
                  </div>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-3xl relative">
                <div className="absolute -top-5 -left-5 w-24 h-24 bg-gradient-to-br from-orange-600/10 to-indigo-600/10 rounded-full blur-2xl"></div>
                <Image
                  src="/images/ai.jpeg"
                  alt="AI content output example"
                  width={400}
                  height={800}
                  className="rounded-xl w-full h-auto"
                />
                <p className="text-center text-sm text-white/50 mt-2">Demo – actual AI output</p>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="relative container px-4 mx-auto max-w-5xl mt-32 reveal delay-3">
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center">
              <svg className="w-full h-full text-orange-500/5" viewBox="0 0 400 200" preserveAspectRatio="none">
                <path d="M0 150 L100 50 L200 120 L300 30 L400 80" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M0 170 L100 80 L200 140 L300 60 L400 100" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-indigo-400">
                  87%
                </div>
                <div className="text-xl text-white mt-2">Higher Consistency</div>
                <p className="text-gray-400 text-sm mt-1">Users report sticking to goals longer</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-indigo-400">
                  10x
                </div>
                <div className="text-xl text-white mt-2">Content Output</div>
                <p className="text-gray-400 text-sm mt-1">Without extra effort</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-indigo-400">
                  🔥 50+
                </div>
                <div className="text-xl text-white mt-2">Longest Streak</div>
                <p className="text-gray-400 text-sm mt-1">Among early users</p>
              </div>
            </div>
          </section>

          {/* Pricing / CTA */}
          <div className="relative container px-4 mx-auto max-w-5xl mt-32 reveal" id="pricing">
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <span className="text-[15rem] font-black text-white/5 select-none">SHIFT</span>
            </div>
            <div className="glass-card p-12 rounded-3xl text-center relative">
              <h2 className="text-4xl font-bold text-white mb-4">
                Start Building in Public – <span className="text-orange-400">Free</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Shift is free during beta. Install the PWA, lock in your first task, and let AI amplify your work.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  onClick={handleDownload}
                  className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-orange-600 to-indigo-600 rounded-xl hover:scale-105 transition"
                >
                  Download Shift
                </button>
                <button className="px-8 py-4 text-lg font-semibold text-white border border-white/20 rounded-xl hover:bg-white/10 transition">
                  See Example Profile
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-400">No credit card. No subscription. Ever.</p>
            </div>
          </div>

          {/* Testimonial */}
          <section className="container px-4 mx-auto max-w-4xl mt-32 reveal">
            <div className="glass-panel p-8 rounded-3xl relative">
              <svg className="absolute top-4 left-4 w-12 h-12 text-white/5" fill="currentColor" viewBox="0 0 32 32">
                <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
              </svg>
              <div className="relative z-10 pl-8">
                <p className="text-xl text-white/80 italic">
                  “Shift changed how I document my founder journey. I used to spend hours writing threads. Now I just
                  execute, and AI does the rest. My Twitter engagement doubled in two weeks!!”
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <Image
                    src="/images/odia.jpg"
                    alt="Omijeh David Odianonsen (Odia)"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-white">Omijeh David Odianonsen (Odia)</p>
                    <p className="text-sm text-gray-400">Solo Builder</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="relative mt-32 px-4 py-16 glass-footer overflow-hidden">
          <div
            className="absolute bottom-0 left-0 w-full h-16 opacity-5"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23f97316\' d=\'M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,149.3C672,128,768,128,864,149.3C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
              backgroundRepeat: "repeat-x",
              backgroundSize: "auto 100%",
            }}
          ></div>
          <div className="container mx-auto max-w-6xl relative">
            <div className="flex flex-wrap justify-between gap-8">
              <div className="w-full md:w-1/3">
                <div className="text-2xl font-bold text-white">
                  SHIFT<span className="text-orange-500">.</span>
                </div>
                <p className="mt-4 text-gray-400 text-sm">Execute → AI converts it → You publish everywhere.</p>
                <button
                  onClick={handleDownload}
                  className="mt-6 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-600 to-indigo-600 rounded-full"
                >
                  Download App
                </button>
              </div>
              <div className="w-full md:w-auto">
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="#features">Features</Link>
                  </li>
                  <li>
                    <Link href="#how">How it works</Link>
                  </li>
                  <li>
                    <Link href="#pricing">Pricing</Link>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-auto">
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="/about">About</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy</Link>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-auto">
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>
                    <Link href="/terms">Terms</Link>
                  </li>
                  <li>
                    <Link href="/privacy">Privacy</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-6 border-t border-white/10 text-center text-gray-500 text-sm">
              © 2026 Shift. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}