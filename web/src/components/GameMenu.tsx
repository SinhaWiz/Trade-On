'use client';

import { useState } from 'react';
import { useGameStore } from '@/lib/gameStore';
import { usePlayerStore } from '@/lib/playerStore';
import { Menu, X, Save, LogOut, RotateCcw, HelpCircle } from 'lucide-react';

export default function GameMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { saveGame: localSave, quitToTitle, startNewGame, turnsRemaining, player, getGameStateForSave, addNotification } = useGameStore();
  const { profile, saveGame, currentSaveId, updateSave } = usePlayerStore();

  const handleSave = async () => {
    if (!profile) {
      // Fall back to local save for demo users
      localSave();
      setIsOpen(false);
      return;
    }

    setIsSaving(true);
    try {
      const gameState = getGameStateForSave();
      
      if (currentSaveId) {
        // Update existing save
        await updateSave(currentSaveId, gameState);
        addNotification('success', '💾 Game saved successfully!');
      } else {
        // Create new save
        await saveGame(profile.email, profile.id, gameState);
        addNotification('success', '💾 Game saved to your profile!');
      }
    } catch (error) {
      addNotification('error', 'Failed to save game');
    }
    setIsSaving(false);
    setIsOpen(false);
  };

  const handleQuit = () => {
    quitToTitle();
    setIsOpen(false);
  };

  const handleNewGame = () => {
    if (confirm('Are you sure? Your current progress will be lost unless you save first.')) {
      startNewGame();
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-3 bg-trade-card border border-trade-border rounded-xl
          hover:border-trade-accent hover:bg-trade-card/80 transition-all group"
        title="Game Menu"
      >
        <Menu className="w-5 h-5 text-gray-400 group-hover:text-trade-accent transition-colors" />
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="relative w-80 bg-trade-card border-r border-trade-border h-full shadow-2xl animate-slide-in-left">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-trade-border">
              <h2 className="text-xl font-bold text-white">Game Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-trade-dark text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Game Stats */}
            <div className="p-6 border-b border-trade-border">
              <div className="bg-trade-dark rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-white font-mono">${player.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Turns Left</span>
                  <span className="text-white font-mono">{turnsRemaining}</span>
                </div>
              </div>
            </div>

            {/* Menu Options */}
            <div className="p-4 space-y-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-trade-dark border border-trade-border
                  hover:border-trade-green hover:bg-trade-green/10 text-gray-300 hover:text-trade-green transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span className="font-medium">{isSaving ? 'Saving...' : 'Save Game'}</span>
              </button>

              <button
                onClick={handleNewGame}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-trade-dark border border-trade-border
                  hover:border-trade-accent hover:bg-trade-accent/10 text-gray-300 hover:text-trade-accent transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span className="font-medium">New Game</span>
              </button>

              <button
                onClick={() => {}}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-trade-dark border border-trade-border
                  hover:border-purple-400 hover:bg-purple-400/10 text-gray-300 hover:text-purple-400 transition-all"
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">How to Play</span>
              </button>

              <div className="pt-4 border-t border-trade-border mt-4">
                <button
                  onClick={handleQuit}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-trade-dark border border-trade-border
                    hover:border-trade-red hover:bg-trade-red/10 text-gray-300 hover:text-trade-red transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Quit to Title</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-trade-border">
              <p className="text-xs text-gray-500 text-center">
                Trade-On v1.0 • Crypto Trading Simulator
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
