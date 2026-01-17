'use client';

import { useState } from 'react';
import { Coin } from '@/lib/types';
import Header from '@/components/Header';
import MarketTable from '@/components/MarketTable';
import TradePanel from '@/components/TradePanel';
import PositionsPanel from '@/components/PositionsPanel';
import PriceChart from '@/components/PriceChart';
import Notifications from '@/components/Notifications';
import ActionPanel from '@/components/ActionPanel';
import GameOverModal from '@/components/GameOverModal';
import TitleScreen from '@/components/TitleScreen';
import GameMenu from '@/components/GameMenu';
import { useGameStore } from '@/lib/gameStore';

interface GameClientProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function GameClient({ user }: GameClientProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const { isGameStarted } = useGameStore();

  return (
    <main className="min-h-screen bg-trade-dark">
      {/* Title Screen Overlay */}
      <TitleScreen user={user} />
      
      {/* Game Over Modal */}
      <GameOverModal />

      {/* Notifications */}
      <Notifications />

      {/* Game Menu - Only show when game is active */}
      {isGameStarted && <GameMenu />}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Market & Chart */}
          <div className="col-span-8 space-y-6">
            {/* Market Table */}
            <MarketTable 
              onSelectCoin={setSelectedCoin} 
              selectedCoin={selectedCoin} 
            />

            {/* Price Chart */}
            <PriceChart coin={selectedCoin} />

            {/* Positions */}
            <PositionsPanel />
          </div>

          {/* Right Column - Trade Panel & Actions */}
          <div className="col-span-4 space-y-6">
            {/* Trade Panel */}
            <TradePanel selectedCoin={selectedCoin} />

            {/* Action Panel */}
            <ActionPanel />
          </div>
        </div>
      </div>
    </main>
  );
}
