'use client';

import { useGameStore } from '@/lib/gameStore';
import { TrendingUp, Zap, Target, Skull, Play, RotateCcw, User, LogOut, Sparkles, Trophy } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface TitleScreenProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function TitleScreen({ user }: TitleScreenProps) {
  const { isGameStarted, startNewGame, hasSavedGame, resumeGame } = useGameStore();
  const router = useRouter();

  if (isGameStarted) return null;

  const handleStartNewGame = () => {
    startNewGame();
  };

  const handleResumeGame = () => {
    resumeGame();
  };

  const handleSignOut = () => {
    // Clear demo user if exists
    localStorage.removeItem('demo-user');
    // Sign out from NextAuth (will handle both demo and real users)
    signOut({ callbackUrl: '/login' });
    // Also redirect directly for demo users
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 bg-trade-dark z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-trade-accent/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-trade-green/10 rounded-full blur-[80px] animate-pulse" />
      </div>

      {/* Floating particles - using fixed positions to avoid hydration mismatch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: '10%', top: '20%', delay: '0s', duration: '8s' },
          { left: '25%', top: '60%', delay: '1s', duration: '10s' },
          { left: '40%', top: '30%', delay: '2s', duration: '7s' },
          { left: '55%', top: '70%', delay: '0.5s', duration: '12s' },
          { left: '70%', top: '15%', delay: '3s', duration: '9s' },
          { left: '85%', top: '45%', delay: '1.5s', duration: '11s' },
          { left: '15%', top: '80%', delay: '2.5s', duration: '8s' },
          { left: '60%', top: '85%', delay: '4s', duration: '10s' },
          { left: '35%', top: '10%', delay: '0.8s', duration: '13s' },
          { left: '80%', top: '75%', delay: '3.5s', duration: '9s' },
          { left: '5%', top: '50%', delay: '1.2s', duration: '11s' },
          { left: '95%', top: '25%', delay: '2.8s', duration: '8s' },
        ].map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-trade-accent/30 rounded-full animate-float"
            style={{
              left: particle.left,
              top: particle.top,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      {/* User Profile Card - Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <div className="flex items-center gap-3 bg-trade-card/80 backdrop-blur-sm border border-trade-border rounded-full pl-4 pr-2 py-2">
          <div className="text-right">
            <p className="text-sm font-medium text-white">{user.name || 'Trader'}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
          {user.image ? (
            <img src={user.image} alt="Profile" className="w-10 h-10 rounded-full border-2 border-trade-accent" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-trade-accent flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="p-2 rounded-full hover:bg-trade-red/20 text-gray-400 hover:text-trade-red transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-3xl px-4">
        {/* Logo */}
        <div className="mb-10">
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-trade-accent via-purple-500 to-trade-green rounded-3xl 
            flex items-center justify-center shadow-2xl shadow-trade-accent/40 animate-glow relative">
            <TrendingUp className="w-14 h-14 text-white" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-bold text-white mb-4 tracking-tight">
          Trade-<span className="bg-gradient-to-r from-trade-accent via-purple-400 to-trade-green bg-clip-text text-transparent">On</span>
        </h1>
        <p className="text-2xl text-gray-400 mb-12 font-light">
          Master the Art of Cryptocurrency Trading
        </p>

        {/* Story Card */}
        <div className="bg-trade-card/60 backdrop-blur-sm border border-trade-border rounded-2xl p-6 mb-10 text-left max-w-xl mx-auto">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-trade-red/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-trade-red/30">
              <Skull className="w-7 h-7 text-trade-red" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">The Stakes Are High</h3>
              <p className="text-gray-400 leading-relaxed">
                You borrowed <span className="text-trade-green font-bold">$1,000,000</span> from a loan shark 
                to trade cryptocurrency. You have <span className="text-yellow-400 font-bold">160 turns</span> to 
                pay back the loan and keep whatever profits you make. Don&apos;t disappoint the shark...
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg mx-auto">
          <div className="bg-trade-card/40 border border-trade-border/50 rounded-xl p-4 hover:border-yellow-400/50 transition-all">
            <Zap className="w-7 h-7 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 font-medium">10x Leverage</p>
          </div>
          <div className="bg-trade-card/40 border border-trade-border/50 rounded-xl p-4 hover:border-purple-400/50 transition-all">
            <Target className="w-7 h-7 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-300 font-medium">6 Cryptos</p>
          </div>
          <div className="bg-trade-card/40 border border-trade-border/50 rounded-xl p-4 hover:border-trade-green/50 transition-all">
            <Trophy className="w-7 h-7 text-trade-green mx-auto mb-2" />
            <p className="text-sm text-gray-300 font-medium">Leaderboard</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4 max-w-md mx-auto">
          {/* Start New Game Button */}
          <button
            onClick={handleStartNewGame}
            className="group relative flex items-center justify-center gap-3 w-full py-5 
              bg-gradient-to-r from-trade-accent to-purple-500 text-white font-bold text-xl 
              rounded-2xl shadow-2xl shadow-trade-accent/30 hover:shadow-trade-accent/50 
              transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-6 h-6" />
            Start New Game
            <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Resume Game Button - Only show if there's a saved game */}
          {hasSavedGame() && (
            <button
              onClick={handleResumeGame}
              className="group flex items-center justify-center gap-3 w-full py-4 
                bg-trade-card border-2 border-trade-green/50 text-trade-green font-semibold text-lg 
                rounded-2xl hover:bg-trade-green/10 hover:border-trade-green
                transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5" />
              Resume Saved Game
            </button>
          )}
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Use your skills to trade Bitcoin, Ethereum, and more. Good luck, trader!
        </p>
      </div>
    </div>
  );
}
