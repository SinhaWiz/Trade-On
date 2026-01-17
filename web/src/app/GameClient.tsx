'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  } | null;
}

export default function GameClient({ user: serverUser }: GameClientProps) {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [user, setUser] = useState(serverUser);
  const { isGameStarted } = useGameStore();
  const router = useRouter();

  // Check for demo user on mount
  useEffect(() => {
    if (!serverUser) {
      const demoUser = localStorage.getItem('demo-user');
      if (demoUser) {
        setUser(JSON.parse(demoUser));
      } else {
        router.push('/login');
      }
    }
  }, [serverUser, router]);

  // Show loading state while checking authentication
  if (!user) {
    return (
      <div className="min-h-screen bg-trade-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-trade-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

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
