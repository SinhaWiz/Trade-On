'use client';

import { useGameStore } from '@/lib/gameStore';
import { calcGainLoss } from '@/lib/trade';
import { formatPrice, formatCurrency, formatPercentage } from '@/lib/utils';
import { Briefcase, TrendingUp, TrendingDown, X, XCircle } from 'lucide-react';

export default function PositionsPanel() {
  const { positions, closePosition, closeAllPositions } = useGameStore();

  if (positions.length === 0) {
    return (
      <div className="bg-trade-card rounded-xl border border-trade-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-trade-accent" />
          <h2 className="text-lg font-semibold text-white">Open Positions</h2>
        </div>
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No open positions</p>
          <p className="text-sm text-gray-500 mt-1">Open a long or short position to start trading</p>
        </div>
      </div>
    );
  }

  const totalPnL = positions.reduce((acc, pos) => acc + calcGainLoss(pos), 0);

  return (
    <div className="bg-trade-card rounded-xl border border-trade-border overflow-hidden">
      <div className="p-4 border-b border-trade-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-trade-accent" />
          <h2 className="text-lg font-semibold text-white">Open Positions</h2>
          <span className="bg-trade-accent/20 text-trade-accent text-sm px-2 py-0.5 rounded-full">
            {positions.length}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-sm font-medium ${totalPnL >= 0 ? 'text-trade-green' : 'text-trade-red'}`}>
            Total P/L: {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
          </div>
          <button
            onClick={() => closeAllPositions()}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-trade-red transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Close All
          </button>
        </div>
      </div>

      <div className="divide-y divide-trade-border/50">
        {positions.map((position) => {
          const pnl = calcGainLoss(position);
          const pnlPercent = (pnl / (position.quantity * position.entryPrice)) * 100;
          const isProfit = pnl >= 0;

          return (
            <div key={position.id} className="p-4 hover:bg-trade-dark/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Position Type Badge */}
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium
                    ${position.type === 'long' 
                      ? 'bg-trade-green/20 text-trade-green' 
                      : 'bg-trade-red/20 text-trade-red'}`}
                  >
                    {position.type === 'long' 
                      ? <TrendingUp className="w-4 h-4" /> 
                      : <TrendingDown className="w-4 h-4" />}
                    {position.type.toUpperCase()}
                  </div>
                  
                  {/* Coin Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{position.coin.ticker}</span>
                      <span className="text-xs bg-trade-dark px-2 py-0.5 rounded text-yellow-400">
                        {position.leverage}x
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-0.5">
                      {position.quantity.toFixed(6)} @ {formatPrice(position.entryPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Current Price */}
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Current Price</p>
                    <p className="text-white font-mono">{formatPrice(position.coin.price)}</p>
                  </div>

                  {/* P/L */}
                  <div className="text-right min-w-[120px]">
                    <p className="text-xs text-gray-400">P/L</p>
                    <p className={`font-mono font-semibold ${isProfit ? 'text-trade-green' : 'text-trade-red'}`}>
                      {isProfit ? '+' : ''}{formatCurrency(pnl)}
                      <span className="text-xs ml-1">({formatPercentage(pnlPercent)})</span>
                    </p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => closePosition(position.id)}
                    className="p-2 rounded-lg bg-trade-dark border border-trade-border text-gray-400
                      hover:text-trade-red hover:border-trade-red transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
