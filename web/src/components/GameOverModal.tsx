'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { usePlayerStore } from '@/lib/playerStore';
import { formatCurrency } from '@/lib/utils';
import { calcGainLoss } from '@/lib/trade';
import { Trophy, RotateCcw, Target, Skull, Crown, Home } from 'lucide-react';
import { MAX_TURNS } from '@/lib/types';

export default function GameOverModal() {
  const { isGameOver, player, positions, turnsRemaining, startNewGame, resetGame } = useGameStore();
  const { profile, recordGameEnd } = usePlayerStore();
  const hasRecorded = useRef(false);

  // Close all positions and calculate final balance
  const totalPositionValue = positions.reduce((acc, pos) => {
    const gainLoss = calcGainLoss(pos);
    const margin = (pos.quantity * pos.entryPrice) / pos.leverage;
    return acc + margin + gainLoss;
  }, 0);

  const finalBalance = player.balance + totalPositionValue;
  const initialBalance = 1000000;
  const profit = finalBalance - initialBalance;
  const profitPercent = (profit / initialBalance) * 100;
  const isWinner = finalBalance >= initialBalance;
  const turnsUsed = MAX_TURNS - turnsRemaining;

  // Record game end when modal appears
  useEffect(() => {
    if (isGameOver && profile && !hasRecorded.current) {
      hasRecorded.current = true;
      recordGameEnd(profile.email, profile.id, finalBalance, turnsUsed);
    }
  }, [isGameOver, profile, finalBalance, turnsUsed, recordGameEnd]);

  // Reset the recorded flag when game is not over
  useEffect(() => {
    if (!isGameOver) {
      hasRecorded.current = false;
    }
  }, [isGameOver]);

  if (!isGameOver) return null;

  const handleBackToMenu = () => {
    resetGame();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-trade-card border border-trade-border rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className={`p-8 text-center ${isWinner ? 'bg-gradient-to-br from-trade-green/20 to-transparent' : 'bg-gradient-to-br from-trade-red/20 to-transparent'}`}>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
            ${isWinner ? 'bg-trade-green/20' : 'bg-trade-red/20'}`}
          >
            {isWinner ? (
              <Crown className="w-10 h-10 text-yellow-400" />
            ) : (
              <Skull className="w-10 h-10 text-trade-red" />
            )}
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {isWinner ? 'Victory!' : 'Game Over'}
          </h1>
          <p className="text-gray-400">
            {isWinner 
              ? 'You paid back the loan shark and kept the profits!' 
              : 'The loan shark is not pleased...'}
          </p>
        </div>

        {/* Stats */}
        <div className="p-6 space-y-4">
          <div className="bg-trade-dark rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Starting Balance</span>
              <span className="text-white font-mono">{formatCurrency(initialBalance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Final Balance</span>
              <span className="text-white font-mono font-bold">{formatCurrency(finalBalance)}</span>
            </div>
            <div className="border-t border-trade-border pt-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Net Profit/Loss
                </span>
                <span className={`font-mono font-bold ${profit >= 0 ? 'text-trade-green' : 'text-trade-red'}`}>
                  {profit >= 0 ? '+' : ''}{formatCurrency(profit)}
                  <span className="text-sm ml-1 opacity-75">({profitPercent.toFixed(1)}%)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          <div className="flex justify-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              ${profitPercent >= 100 ? 'bg-yellow-500/20 text-yellow-400' :
                profitPercent >= 50 ? 'bg-trade-green/20 text-trade-green' :
                profitPercent >= 0 ? 'bg-blue-500/20 text-blue-400' :
                profitPercent >= -50 ? 'bg-orange-500/20 text-orange-400' :
                'bg-trade-red/20 text-trade-red'}`}
            >
              <Trophy className="w-4 h-4" />
              {profitPercent >= 100 ? 'Legendary Trader' :
               profitPercent >= 50 ? 'Expert Trader' :
               profitPercent >= 0 ? 'Profitable Trader' :
               profitPercent >= -50 ? 'Learning Trader' :
               'Liquidated'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <button
            onClick={startNewGame}
            className="w-full py-4 bg-trade-accent hover:bg-trade-accent/80 text-white rounded-xl 
              font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
          <button
            onClick={handleBackToMenu}
            className="w-full py-3 bg-trade-dark hover:bg-trade-dark/80 text-gray-300 rounded-xl 
              font-medium transition-all flex items-center justify-center gap-2 border border-trade-border"
          >
            <Home className="w-5 h-5" />
            Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
