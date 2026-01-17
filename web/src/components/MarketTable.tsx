'use client';

import { useGameStore } from '@/lib/gameStore';
import { formatPrice, formatPercentage, getChangeColor, getBgChangeColor } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Coin } from '@/lib/types';

interface MarketTableProps {
  onSelectCoin: (coin: Coin) => void;
  selectedCoin: Coin | null;
}

export default function MarketTable({ onSelectCoin, selectedCoin }: MarketTableProps) {
  const { coins } = useGameStore();

  const getPercentChange = (coin: Coin) => {
    if (coin.previousPrice === 0) return 0;
    return ((coin.price - coin.previousPrice) / coin.previousPrice) * 100;
  };

  const getTrendIcon = (coin: Coin) => {
    const change = getPercentChange(coin);
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className="bg-trade-card rounded-xl border border-trade-border overflow-hidden">
      <div className="p-4 border-b border-trade-border">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-trade-accent" />
          Market Overview
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-trade-border">
              <th className="px-4 py-3 font-medium">Coin</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right">24h Change</th>
              <th className="px-4 py-3 font-medium text-right">Trend</th>
              <th className="px-4 py-3 font-medium text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const change = getPercentChange(coin);
              const isSelected = selectedCoin?.ticker === coin.ticker;
              
              return (
                <tr 
                  key={coin.ticker}
                  className={`border-b border-trade-border/50 hover:bg-trade-dark/50 transition-colors cursor-pointer
                    ${isSelected ? 'bg-trade-accent/10 border-l-2 border-l-trade-accent' : ''}`}
                  onClick={() => onSelectCoin(coin)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm
                        ${coin.ticker === 'BTC' ? 'bg-orange-500' : 
                          coin.ticker === 'ETH' ? 'bg-purple-500' :
                          coin.ticker === 'BNB' ? 'bg-yellow-500' :
                          coin.ticker === 'ADA' ? 'bg-blue-500' :
                          coin.ticker === 'SOL' ? 'bg-gradient-to-br from-purple-500 to-teal-400' :
                          'bg-yellow-400'}`}
                      >
                        {coin.ticker.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{coin.name}</p>
                        <p className="text-sm text-gray-400">{coin.ticker}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-white font-mono font-semibold">
                      {formatPrice(coin.price)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${getBgChangeColor(change)} ${getChangeColor(change)}`}>
                      {getTrendIcon(coin)}
                      {formatPercentage(change)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {coin.possiblePositiveTrend && (
                        <span className="px-2 py-1 bg-trade-green/20 text-trade-green text-xs rounded-full">
                          Bullish
                        </span>
                      )}
                      {coin.possibleNegativeTrend && (
                        <span className="px-2 py-1 bg-trade-red/20 text-trade-red text-xs rounded-full">
                          Bearish
                        </span>
                      )}
                      {!coin.possiblePositiveTrend && !coin.possibleNegativeTrend && (
                        <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                          Neutral
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCoin(coin);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                        ${isSelected 
                          ? 'bg-trade-accent text-white' 
                          : 'bg-trade-dark text-gray-300 hover:bg-trade-accent/20 hover:text-trade-accent border border-trade-border'
                        }`}
                    >
                      {isSelected ? 'Selected' : 'Trade'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
