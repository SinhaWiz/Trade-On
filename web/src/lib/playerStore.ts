// Player profile store - manages player data from MongoDB

import { create } from 'zustand';
import { PlayerProfile, SavedGame, GameRecord, LeaderboardEntry, SavedGameState } from './playerTypes';

interface PlayerStore {
  // State
  profile: PlayerProfile | null;
  savedGames: SavedGame[];
  gameHistory: GameRecord[];
  leaderboard: LeaderboardEntry[];
  currentSaveId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProfile: (email: string, name?: string, image?: string | null) => Promise<PlayerProfile | null>;
  loadSavedGames: (email: string) => Promise<void>;
  loadGameHistory: (email: string) => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  
  saveGame: (email: string, playerId: string, gameState: SavedGameState, name?: string) => Promise<SavedGame | null>;
  updateSave: (saveId: string, gameState: SavedGameState) => Promise<void>;
  deleteSave: (saveId: string) => Promise<void>;
  
  recordGameEnd: (email: string, playerId: string, finalBalance: number, turnsUsed: number) => Promise<void>;
  
  setCurrentSaveId: (saveId: string | null) => void;
  clearProfile: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  profile: null,
  savedGames: [],
  gameHistory: [],
  leaderboard: [],
  currentSaveId: null,
  isLoading: false,
  error: null,

  loadProfile: async (email: string, name?: string, image?: string | null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, image }),
      });

      if (!response.ok) {
        throw new Error('Failed to load profile');
      }

      const data = await response.json();
      set({ profile: data.player, isLoading: false });
      
      // Also load saved games and history
      get().loadSavedGames(email);
      get().loadGameHistory(email);
      get().loadLeaderboard();

      return data.player;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      return null;
    }
  },

  loadSavedGames: async (email: string) => {
    try {
      const response = await fetch(`/api/saves?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        set({ savedGames: data.saves });
      }
    } catch (error) {
      console.error('Failed to load saved games:', error);
    }
  },

  loadGameHistory: async (email: string) => {
    try {
      const response = await fetch(`/api/records?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        set({ gameHistory: data.records });
      }
    } catch (error) {
      console.error('Failed to load game history:', error);
    }
  },

  loadLeaderboard: async () => {
    try {
      const response = await fetch('/api/leaderboard?limit=10');
      if (response.ok) {
        const data = await response.json();
        set({ leaderboard: data.leaderboard });
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  },

  saveGame: async (email: string, playerId: string, gameState: SavedGameState, name?: string) => {
    try {
      const response = await fetch('/api/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, playerId, name, gameState }),
      });

      if (response.ok) {
        const data = await response.json();
        set({ currentSaveId: data.save.id });
        // Reload saved games
        get().loadSavedGames(email);
        return data.save;
      }
      return null;
    } catch (error) {
      console.error('Failed to save game:', error);
      return null;
    }
  },

  updateSave: async (saveId: string, gameState: SavedGameState) => {
    try {
      await fetch('/api/saves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveId, gameState }),
      });
    } catch (error) {
      console.error('Failed to update save:', error);
    }
  },

  deleteSave: async (saveId: string) => {
    try {
      await fetch(`/api/saves?saveId=${encodeURIComponent(saveId)}`, {
        method: 'DELETE',
      });
      
      const { profile } = get();
      if (profile) {
        get().loadSavedGames(profile.email);
      }
    } catch (error) {
      console.error('Failed to delete save:', error);
    }
  },

  recordGameEnd: async (email: string, playerId: string, finalBalance: number, turnsUsed: number) => {
    try {
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, playerId, finalBalance, turnsUsed }),
      });

      // Reload profile to get updated stats
      get().loadProfile(email);
      get().loadLeaderboard();
    } catch (error) {
      console.error('Failed to record game end:', error);
    }
  },

  setCurrentSaveId: (saveId: string | null) => {
    set({ currentSaveId: saveId });
  },

  clearProfile: () => {
    set({
      profile: null,
      savedGames: [],
      gameHistory: [],
      currentSaveId: null,
      error: null,
    });
  },
}));
