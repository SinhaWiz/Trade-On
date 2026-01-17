'use client';

import { Coin } from '@/lib/types';
import { formatPrice, formatPercentage } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { BarChart2 } from 'lucide-react';

interface PriceChartProps {
  coin: Coin | null;
}

export default function PriceChart({ coin }: PriceChartProps) {
  if (!coin || coin.priceHistory.length < 2) {
    return (
      <div className="bg-trade-card rounded-xl border border-trade-border p-6 h-[300px]">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="w-5 h-5 text-trade-accent" />
          <h2 className="text-lg font-semibold text-white">Price Chart</h2>
        </div>
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-400">Select a coin to view price history</p>
        </div>
      </div>
    );
  }

  const chartData = coin.priceHistory.map((price, index) => ({
    turn: index + 1,
    price: price,
  }));

  const priceChange = coin.price - coin.previousPrice;
  const isPositive = priceChange >= 0;
  const lineColor = isPositive ? '#00C853' : '#FF1744';
  const firstPrice = coin.priceHistory[0];

  return (
    <div className="bg-trade-card rounded-xl border border-trade-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-trade-accent" />
          <h2 className="text-lg font-semibold text-white">{coin.name} Price Chart</h2>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-white">{formatPrice(coin.price)}</p>
          <p className={`text-sm ${isPositive ? 'text-trade-green' : 'text-trade-red'}`}>
            {formatPercentage(((coin.price - firstPrice) / firstPrice) * 100)} all time
          </p>
        </div>
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
              domain={['dataMin', 'dataMax']}
              tickFormatter={(value) => formatPrice(value)}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#161B22',
                border: '1px solid #30363D',
                borderRadius: '8px',
                padding: '10px',
              }}
              labelStyle={{ color: '#9CA3AF' }}
              formatter={(value: number) => [formatPrice(value), 'Price']}
              labelFormatter={(label) => `Turn ${label}`}
            />
            <ReferenceLine 
              y={firstPrice} 
              stroke="#6B7280" 
              strokeDasharray="3 3" 
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
