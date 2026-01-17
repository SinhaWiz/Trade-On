'use client';

import { useGameStore } from '@/lib/gameStore';
import { SkipForward, FastForward, Eye, PlayCircle, RotateCcw } from 'lucide-react';

export default function ActionPanel() {
  const { 
    skipTurn, 
    skipDay, 
    useMarketInsider, 
    marketInsiderAttempts,
    player,
    isGameOver,
    startNewGame
  } = useGameStore();

  const handleMarketInsider = () => {
    const predictions = useMarketInsider();
    if (predictions) {
      // Predictions will be shown via notifications
      console.log('Market Insider Predictions:', predictions);
    }
  };

  const insiderCost = marketInsiderAttempts === 3 ? 75000 : marketInsiderAttempts === 2 ? 100000 : 150000;

  if (isGameOver) {
    return (
      <div className="bg-trade-card rounded-xl border border-trade-border p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Game Over!</h2>
          <p className="text-gray-400 mb-4">Final Balance: ${player.balance.toLocaleString()}</p>
          <button
            onClick={startNewGame}
            className="flex items-center justify-center gap-2 w-full py-3 bg-trade-accent hover:bg-trade-accent/80 
              text-white rounded-lg font-medium transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trade-card rounded-xl border border-trade-border p-4">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <PlayCircle className="w-5 h-5 text-trade-accent" />
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={skipTurn}
          className="flex items-center justify-center gap-2 w-full py-3 bg-trade-dark border border-trade-border
            hover:border-trade-accent hover:text-trade-accent text-gray-300 rounded-lg font-medium transition-all"
        >
          <SkipForward className="w-5 h-5" />
          Skip Turn
        </button>

        <button
          onClick={skipDay}
          className="flex items-center justify-center gap-2 w-full py-3 bg-trade-dark border border-trade-border
            hover:border-trade-accent hover:text-trade-accent text-gray-300 rounded-lg font-medium transition-all"
        >
          <FastForward className="w-5 h-5" />
          Skip Day (8 Turns)
        </button>

        <button
          onClick={handleMarketInsider}
          disabled={marketInsiderAttempts <= 0 || player.balance < insiderCost}
          className={`flex flex-col items-center justify-center gap-1 w-full py-3 rounded-lg font-medium transition-all
            ${marketInsiderAttempts > 0 && player.balance >= insiderCost
              ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400 hover:bg-purple-500/30'
              : 'bg-gray-700/50 border border-gray-600 text-gray-500 cursor-not-allowed'}`}
        >
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Market Insider
          </div>
          <span className="text-xs opacity-75">
            Cost: ${insiderCost.toLocaleString()} ({marketInsiderAttempts} left)
          </span>
        </button>
      </div>
    </div>
  );
}
