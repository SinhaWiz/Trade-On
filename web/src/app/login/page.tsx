'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight, ArrowUpRight, Globe, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleGetStarted = () => {
    // Store demo user and jump straight into the game
    localStorage.setItem('demo-user', JSON.stringify({
      name: 'Demo Trader',
      email: 'demo@trade-on.game',
      image: null,
    }));
    router.push('/');
  };

  const navLinks = ['Home', 'About Us', 'Live Analysis', 'Community'];

  // Fixed positions to avoid hydration mismatch
  const particles = [
    { left: '12%', top: '30%', delay: '0s', duration: '9s' },
    { left: '22%', top: '65%', delay: '1.2s', duration: '11s' },
    { left: '38%', top: '20%', delay: '2s', duration: '8s' },
    { left: '58%', top: '72%', delay: '0.6s', duration: '12s' },
    { left: '72%', top: '28%', delay: '3s', duration: '10s' },
    { left: '86%', top: '55%', delay: '1.6s', duration: '9s' },
    { left: '8%', top: '52%', delay: '2.4s', duration: '13s' },
    { left: '92%', top: '38%', delay: '0.9s', duration: '10s' },
  ];

  const streaks = [
    { left: '30%', delay: '0s', duration: '7s' },
    { left: '45%', delay: '2s', duration: '8s' },
    { left: '60%', delay: '4s', duration: '6.5s' },
    { left: '68%', delay: '1s', duration: '9s' },
  ];

  return (
    <div className="min-h-screen bg-[#05070d] text-white relative overflow-hidden flex flex-col">
      {/* ===== Animated background ===== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Ambient drifting blobs */}
        <div className="absolute top-[-10%] left-[10%] w-[420px] h-[420px] bg-trade-accent/10 rounded-full blur-[120px] animate-drift" />
        <div className="absolute bottom-[10%] right-[8%] w-[380px] h-[380px] bg-blue-600/10 rounded-full blur-[120px] animate-drift-slow" />

        {/* Rotating corner swirls (the blue "smoke") */}
        <div
          className="absolute -top-48 -left-48 w-[560px] h-[560px] rounded-full blur-2xl opacity-40 animate-spin-slow"
          style={{
            background:
              'conic-gradient(from 0deg, transparent, rgba(88,166,255,0.35), transparent 55%)',
          }}
        />
        <div
          className="absolute top-1/4 -right-48 w-[560px] h-[560px] rounded-full blur-2xl opacity-40 animate-spin-slow-reverse"
          style={{
            background:
              'conic-gradient(from 200deg, transparent, rgba(96,165,250,0.3), transparent 55%)',
          }}
        />

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(88,166,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(88,166,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

        {/* Glowing orbital horizon arc at the bottom */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-[130%] w-[220%] aspect-square rounded-full border-t-[3px] border-trade-accent/70 shadow-[0_-25px_90px_15px_rgba(88,166,255,0.45)] animate-arc-glow" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-6%] w-[70%] h-[280px] bg-trade-accent/25 blur-[110px] rounded-[50%] animate-arc-glow" />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div
            key={`p-${i}`}
            className="absolute w-1 h-1 bg-trade-accent/40 rounded-full animate-float"
            style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.duration }}
          />
        ))}

        {/* Rising light streaks near the horizon */}
        {streaks.map((s, i) => (
          <div
            key={`s-${i}`}
            className="absolute bottom-[18%] w-px h-24 bg-gradient-to-t from-trade-accent/60 to-transparent animate-rise"
            style={{ left: s.left, animationDelay: s.delay, animationDuration: s.duration }}
          />
        ))}
      </div>

      {/* ===== Navigation ===== */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-trade-accent to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-trade-accent/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Trade<span className="text-trade-accent">-On</span>
          </span>
        </div>

        {/* Center pill nav */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-1.5">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                link === 'Home'
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Language pill */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
          <Globe className="w-4 h-4 text-trade-accent" />
          <span className="text-sm font-medium">EN</span>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pb-24">
        {/* Pill badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md pl-2 pr-1.5 py-1.5">
          <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-gray-200 animate-badge-shine [background-image:linear-gradient(110deg,transparent,rgba(255,255,255,0.08),transparent)]">
            <span className="w-2 h-2 rounded-full bg-trade-green animate-pulse" />
            Trade smarter, from your first move
          </span>
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10">
            <ArrowRight className="w-4 h-4 text-white" />
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
          <span className="bg-gradient-to-r from-trade-accent via-sky-300 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
            Trading isn&apos;t luck
          </span>{' '}
          – it&apos;s a system that works.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base sm:text-lg text-gray-400 leading-relaxed">
          Start with <span className="text-trade-green font-semibold">$1,000,000</span>, master
          realistic crypto markets, and climb the leaderboard. Trade-On gives you the tools to trade
          with confidence and consistency.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={handleGetStarted}
            className="group flex items-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-trade-accent to-purple-500 text-white font-semibold shadow-xl shadow-trade-accent/30 hover:shadow-trade-accent/50 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            Get Started
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            onClick={handleGoogleSignIn}
            className="group flex items-center gap-2 px-7 py-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/15 text-white font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            {/* Google icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
            <LogIn className="w-4 h-4 text-gray-400 transition-colors group-hover:text-white" />
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-600">
          A simulation game • No real money involved
        </p>
      </main>
    </div>
  );
}
