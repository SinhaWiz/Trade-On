'use client';

import { useGameStore } from '@/lib/gameStore';
import { formatCurrency } from '@/lib/utils';
import { Wallet, Clock, Eye, TrendingUp } from 'lucide-react';

export default function Header() {
  const { player, turnsRemaining, marketInsiderAttempts, positions } = useGameStore();

  const totalPnL = positions.reduce((acc, pos) => {
    const gainLoss = pos.type === 'long'
      ? pos.quantity * (pos.coin.price - pos.entryPrice) * pos.leverage
      : pos.quantity * (pos.entryPrice - pos.coin.price) * pos.leverage;
    return acc + gainLoss;
  }, 0);

  return (
    <header className="bg-trade-card border-b border-trade-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-trade-accent to-purple-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Trade-On</h1>
              <p className="text-xs text-gray-400">Crypto Trading Simulator</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            {/* Balance */}
            <div className="flex items-center gap-2 bg-trade-dark px-4 py-2 rounded-lg border border-trade-border">
              <Wallet className="w-5 h-5 text-trade-accent" />
              <div>
                <p className="text-xs text-gray-400">Balance</p>
                <p className="text-lg font-bold text-white">{formatCurrency(player.balance)}</p>
              </div>
            </div>

            {/* Unrealized P/L */}
            <div className="flex items-center gap-2 bg-trade-dark px-4 py-2 rounded-lg border border-trade-border">
              <TrendingUp className={`w-5 h-5 ${totalPnL >= 0 ? 'text-trade-green' : 'text-trade-red'}`} />
              <div>
                <p className="text-xs text-gray-400">Unrealized P/L</p>
                <p className={`text-lg font-bold ${totalPnL >= 0 ? 'text-trade-green' : 'text-trade-red'}`}>
                  {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
                </p>
              </div>
            </div>

            {/* Turns */}
            <div className="flex items-center gap-2 bg-trade-dark px-4 py-2 rounded-lg border border-trade-border">
              <Clock className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-xs text-gray-400">Turns Left</p>
                <p className="text-lg font-bold text-white">{turnsRemaining}</p>
              </div>
            </div>

            {/* Insider Attempts */}
            <div className="flex items-center gap-2 bg-trade-dark px-4 py-2 rounded-lg border border-trade-border">
              <Eye className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-xs text-gray-400">Insider Intel</p>
                <p className="text-lg font-bold text-white">{marketInsiderAttempts}/3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
