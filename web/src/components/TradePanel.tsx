'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { Coin } from '@/lib/types';
import { formatPrice, formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Zap, DollarSign, BarChart2 } from 'lucide-react';

interface TradePanelProps {
  selectedCoin: Coin | null;
}

export default function TradePanel({ selectedCoin }: TradePanelProps) {
  const { player, openLongPosition, openShortPosition } = useGameStore();
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const [amount, setAmount] = useState<string>('');
  const [leverage, setLeverage] = useState<number>(1);

  if (!selectedCoin) {
    return (
      <div className="bg-trade-card rounded-xl border border-trade-border p-6">
        <div className="text-center py-12">
          <BarChart2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Select a coin to start trading</p>
        </div>
      </div>
    );
  }

  const amountValue = parseFloat(amount) || 0;
  const quantity = amountValue / selectedCoin.price;
  const margin = amountValue / leverage;
  const canTrade = margin > 0 && margin <= player.balance;

  const handleTrade = () => {
    if (!canTrade) return;
    
    if (tradeType === 'long') {
      openLongPosition(selectedCoin, quantity, leverage);
    } else {
      openShortPosition(selectedCoin, quantity, leverage);
    }
    
    setAmount('');
    setLeverage(1);
  };

  const setPercentage = (percent: number) => {
    const maxAmount = player.balance * leverage * (percent / 100);
    setAmount(maxAmount.toFixed(2));
  };

  return (
    <div className="bg-trade-card rounded-xl border border-trade-border overflow-hidden">
      <div className="p-4 border-b border-trade-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Trade {selectedCoin.ticker}</h2>
          <span className="text-sm text-gray-400 font-mono">{formatPrice(selectedCoin.price)}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Trade Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-trade-dark rounded-lg">
          <button
            onClick={() => setTradeType('long')}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
              ${tradeType === 'long' 
                ? 'bg-trade-green text-white shadow-lg shadow-trade-green/25' 
                : 'text-gray-400 hover:text-white'}`}
          >
            <TrendingUp className="w-4 h-4" />
            Long
          </button>
          <button
            onClick={() => setTradeType('short')}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all
              ${tradeType === 'short' 
                ? 'bg-trade-red text-white shadow-lg shadow-trade-red/25' 
                : 'text-gray-400 hover:text-white'}`}
          >
            <TrendingDown className="w-4 h-4" />
            Short
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Position Size (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-trade-dark border border-trade-border rounded-lg py-3 px-10 text-white 
                font-mono text-lg focus:outline-none focus:border-trade-accent transition-colors"
            />
          </div>
          
          {/* Quick Percentage Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {[25, 50, 75, 100].map((percent) => (
              <button
                key={percent}
                onClick={() => setPercentage(percent)}
                className="py-2 bg-trade-dark border border-trade-border rounded-lg text-sm text-gray-400
                  hover:text-white hover:border-trade-accent transition-all"
              >
                {percent}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              Leverage
            </label>
            <span className="text-white font-bold">{leverage}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
            className="w-full h-2 bg-trade-dark rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-trade-accent
              [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1x</span>
            <span>5x</span>
            <span>10x</span>
          </div>
        </div>

        {/* Trade Summary */}
        <div className="bg-trade-dark rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Quantity</span>
            <span className="text-white font-mono">{quantity.toFixed(6)} {selectedCoin.ticker}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Margin Required</span>
            <span className="text-white font-mono">{formatCurrency(margin)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Available Balance</span>
            <span className="text-white font-mono">{formatCurrency(player.balance)}</span>
          </div>
          <div className="border-t border-trade-border pt-2 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Liquidation at</span>
              <span className="text-trade-red font-mono">
                {quantity > 0 
                  ? formatPrice(tradeType === 'long' 
                      ? selectedCoin.price - (margin / quantity)
                      : selectedCoin.price + (margin / quantity))
                  : '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Trade Button */}
        <button
          onClick={handleTrade}
          disabled={!canTrade}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2
            ${canTrade
              ? tradeType === 'long'
                ? 'bg-trade-green hover:bg-trade-green/80 text-white shadow-lg shadow-trade-green/25'
                : 'bg-trade-red hover:bg-trade-red/80 text-white shadow-lg shadow-trade-red/25'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
        >
          {tradeType === 'long' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          {canTrade 
            ? `Open ${tradeType.toUpperCase()} Position`
            : margin > player.balance 
              ? 'Insufficient Balance'
              : 'Enter Amount'}
        </button>
      </div>
    </div>
  );
}
