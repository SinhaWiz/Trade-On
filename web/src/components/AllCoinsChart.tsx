'use client';

import { useGameStore } from '@/lib/gameStore';
import { formatPrice, formatPercentage } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

// Distinct colors for each coin
const COIN_COLORS: Record<string, string> = {
  BTC: '#F7931A',   // Bitcoin orange
  ETH: '#627EEA',   // Ethereum blue
  SOL: '#9945FF',   // Solana purple
  DOGE: '#C2A633',  // Dogecoin gold
  XRP: '#23292F',   // XRP dark (will use lighter shade)
  ADA: '#0033AD',   // Cardano blue
  DOT: '#E6007A',   // Polkadot pink
  MATIC: '#8247E5', // Polygon purple
  LINK: '#375BD2',  // Chainlink blue
  AVAX: '#E84142',  // Avalanche red
};

// Fallback colors if coin not in list
const FALLBACK_COLORS = [
  '#00C853', '#FF6D00', '#00B8D4', '#D500F9', '#FFEA00',
  '#00E676', '#FF3D00', '#00E5FF', '#651FFF', '#C6FF00',
];

export default function AllCoinsChart() {
  const { coins } = useGameStore();

  // Find the maximum history length
  const maxHistoryLength = Math.max(...coins.map(c => c.priceHistory.length), 1);

  // Create chart data with normalized prices (percentage change from start)
  const chartData = Array.from({ length: maxHistoryLength }, (_, index) => {
    const dataPoint: Record<string, number | string> = { turn: index + 1 };
    
    coins.forEach(coin => {
      if (index < coin.priceHistory.length) {
        const firstPrice = coin.priceHistory[0];
        // Normalize to percentage change from initial price
        const percentChange = firstPrice > 0 
          ? ((coin.priceHistory[index] - firstPrice) / firstPrice) * 100 
          : 0;
        dataPoint[coin.ticker] = percentChange;
      }
    });
    
    return dataPoint;
  });

  const getColor = (ticker: string, index: number): string => {
    return COIN_COLORS[ticker] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  if (coins.length === 0 || maxHistoryLength < 2) {
    return (
      <div className="bg-trade-card rounded-xl border border-trade-border p-6 h-[300px]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-trade-accent" />
          <h2 className="text-lg font-semibold text-white">Market Overview</h2>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-400">Play some turns to see market trends</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-trade-card rounded-xl border border-trade-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-trade-accent" />
          <h2 className="text-lg font-semibold text-white">All Coins Performance</h2>
        </div>
        <p className="text-sm text-gray-400">% change from start</p>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis 
              dataKey="turn" 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(0)}%`}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '8px',
                padding: '10px',
              }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value: number, name: string) => [
                `${value > 0 ? '+' : ''}${value.toFixed(2)}%`,
                name
              ]}
              labelFormatter={(label) => `Turn ${label}`}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="line"
              iconSize={10}
            />
            {coins.map((coin, index) => (
              <Line
                key={coin.ticker}
                type="monotone"
                dataKey={coin.ticker}
                name={coin.ticker}
                stroke={getColor(coin.ticker, index)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: getColor(coin.ticker, index) }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
