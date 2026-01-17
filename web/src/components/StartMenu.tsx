'use client';

import { useGameStore } from '@/lib/gameStore';
import { TrendingUp, Zap, Target, Skull, Play } from 'lucide-react';

export default function StartMenu() {
  const { isGameStarted, startNewGame } = useGameStore();

  if (isGameStarted) return null;

  return (
    <div className="fixed inset-0 bg-trade-dark z-50 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-trade-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="relative z-10 text-center max-w-2xl px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-trade-accent to-purple-500 rounded-2xl 
            flex items-center justify-center shadow-2xl shadow-trade-accent/30 animate-glow">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
          Trade-<span className="text-trade-accent">On</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Cryptocurrency Trading Simulator
        </p>

        {/* Story */}
        <div className="bg-trade-card/50 backdrop-blur-sm border border-trade-border rounded-2xl p-6 mb-8 text-left">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-trade-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Skull className="w-6 h-6 text-trade-red" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">The Situation</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                You borrowed <span className="text-trade-green font-bold">$1,000,000</span> from a loan shark 
                to trade cryptocurrency. You have <span className="text-yellow-400 font-bold">160 turns</span> to 
                pay back the loan and keep whatever profits you make. Miss the deadline, and... 
                well, let&apos;s just say you don&apos;t want to find out.
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-trade-card/30 border border-trade-border/50 rounded-xl p-4">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Up to 10x Leverage</p>
          </div>
          <div className="bg-trade-card/30 border border-trade-border/50 rounded-xl p-4">
            <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-gray-400">6 Cryptocurrencies</p>
          </div>
          <div className="bg-trade-card/30 border border-trade-border/50 rounded-xl p-4">
            <TrendingUp className="w-6 h-6 text-trade-green mx-auto mb-2" />
            <p className="text-sm text-gray-400">Long & Short Trades</p>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={startNewGame}
          className="group relative inline-flex items-center justify-center gap-3 px-12 py-5 
            bg-gradient-to-r from-trade-accent to-purple-500 text-white font-bold text-xl 
            rounded-2xl shadow-2xl shadow-trade-accent/30 hover:shadow-trade-accent/50 
            transition-all duration-300 hover:scale-105"
        >
          <Play className="w-6 h-6" />
          Start Trading
          <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Press Start to begin your trading journey
        </p>
      </div>
    </div>
  );
}
