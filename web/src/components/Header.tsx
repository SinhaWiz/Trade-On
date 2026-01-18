'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useGameStore } from '@/lib/gameStore';
import { usePlayerStore } from '@/lib/playerStore';
import { formatCurrency } from '@/lib/utils';
import { Wallet, Clock, Eye, TrendingUp, Save, LogOut, Home } from 'lucide-react';

export default function Header() {
  const { player, turnsRemaining, marketInsiderAttempts, positions, quitToTitle, getGameStateForSave, addNotification, isGameStarted } = useGameStore();
  const { profile, saveGame, currentSaveId, updateSave, clearProfile } = usePlayerStore();
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const totalPnL = positions.reduce((acc, pos) => {
    const gainLoss = pos.type === 'long'
      ? pos.quantity * (pos.coin.price - pos.entryPrice) * pos.leverage
      : pos.quantity * (pos.entryPrice - pos.coin.price) * pos.leverage;
    return acc + gainLoss;
  }, 0);

  const handleSave = async () => {
    if (!profile) {
      addNotification('info', '💾 Game state saved locally!');
      return;
    }

    setIsSaving(true);
    try {
      const gameState = getGameStateForSave();
      
      if (currentSaveId) {
        await updateSave(currentSaveId, gameState);
        addNotification('success', '💾 Game saved!');
      } else {
        await saveGame(profile.email, profile.id, gameState);
        addNotification('success', '💾 Game saved to your profile!');
      }
    } catch (error) {
      addNotification('error', 'Failed to save game');
    }
    setIsSaving(false);
  };

  const handleQuit = () => {
    if (confirm('Quit to menu? Make sure to save first!')) {
      quitToTitle();
    }
  };

  const handleSignOut = async () => {
    if (confirm('Sign out? You will be taken to the login screen.')) {
      // Clear demo user if it exists
      localStorage.removeItem('demo-user');
      // Reset stores
      clearProfile();
      quitToTitle();
      // Sign out from NextAuth (will redirect to login)
      await signOut({ callbackUrl: '/login' });
    }
  };

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
          <div className="flex items-center gap-4">
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

            {/* Divider */}
            <div className="w-px h-10 bg-trade-border" />

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving || !isGameStarted}
              className="flex items-center gap-2 bg-trade-green/20 hover:bg-trade-green/30 px-4 py-2 rounded-lg border border-trade-green/50 
                text-trade-green transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save Game"
            >
              <Save className="w-5 h-5" />
              <span className="font-medium">{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            {/* Menu Button - Return to Player Menu */}
            {isGameStarted && (
              <button
                onClick={handleQuit}
                className="flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30 px-4 py-2 rounded-lg border border-purple-500/50 
                  text-purple-400 transition-all"
                title="Return to Menu"
              >
                <Home className="w-5 h-5" />
                <span className="font-medium">Menu</span>
              </button>
            )}

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-trade-red/20 hover:bg-trade-red/30 px-4 py-2 rounded-lg border border-trade-red/50 
                text-trade-red transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
