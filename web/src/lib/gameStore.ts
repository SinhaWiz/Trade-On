// Zustand store for game state management - matches Java GameController

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  GameState, 
  Coin, 
  Trade, 
  Player, 
  Notification,
  DEFAULT_COINS, 
  MAX_TURNS, 
  INITIAL_BALANCE 
} from './types';
import { SavedGameState } from './playerTypes';
import { simulateMarketMovement, predictNextMovements, incrementVolatility } from './market';
import { calcGainLoss, generateTradeId, validateTrade, shouldLiquidate } from './trade';

interface GameStore extends GameState {
  // Actions
  startNewGame: () => void;
  completeTurn: () => void;
  skipTurn: () => void;
  skipDay: () => void;
  openLongPosition: (coin: Coin, quantity: number, leverage: number) => boolean;
  openShortPosition: (coin: Coin, quantity: number, leverage: number) => boolean;
  closePosition: (tradeId: string) => number;
  closeAllPositions: () => number;
  useMarketInsider: () => Map<string, number> | null;
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  resetGame: () => void;
  // Save/Load/Quit
  saveGame: () => void;
  resumeGame: () => void;
  quitToTitle: () => void;
  hasSavedGame: () => boolean;
  // New: Load from MongoDB save
  loadFromSave: (gameState: SavedGameState) => void;
  getGameStateForSave: () => SavedGameState;
}

const initializeCoins = (): Coin[] => {
  return DEFAULT_COINS.map(coin => ({
    ...coin,
    previousPrice: coin.price,
    priceHistory: [coin.price],
  }));
};

const initialState: GameState = {
  player: {
    balance: INITIAL_BALANCE,
    portfolio: new Map(),
  },
  coins: initializeCoins(),
  positions: [],
  turnsRemaining: MAX_TURNS,
  marketInsiderAttempts: 3,
  isGameOver: false,
  isGameStarted: false,
  notifications: [],
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startNewGame: () => {
        set({
          player: {
            balance: INITIAL_BALANCE,
            portfolio: new Map(),
          },
          coins: initializeCoins(),
          positions: [],
          turnsRemaining: MAX_TURNS,
          marketInsiderAttempts: 3,
          isGameOver: false,
          isGameStarted: true,
          notifications: [],
        });
        get().addNotification('info', '🎮 Game started! You have $1,000,000 from the loan shark. Pay it back in 160 turns or else...');
      },

      completeTurn: () => {
        const { turnsRemaining, coins, positions, player } = get();
        
        if (turnsRemaining <= 0) {
          set({ isGameOver: true });
          return;
        }

        // Simulate market movement
        const updatedCoins = simulateMarketMovement(coins);
        
        // Update coin references in positions
        const updatedPositions = positions.map(pos => {
          const updatedCoin = updatedCoins.find(c => c.ticker === pos.coin.ticker);
          return updatedCoin ? { ...pos, coin: updatedCoin } : pos;
        });

        // Check for liquidations
        const liquidatedPositions: Trade[] = [];
        const activePositions: Trade[] = [];
        
        for (const pos of updatedPositions) {
          if (shouldLiquidate(pos)) {
            liquidatedPositions.push(pos);
          } else {
            activePositions.push(pos);
          }
        }

        // Process liquidations
        let newBalance = player.balance;
        for (const pos of liquidatedPositions) {
          const loss = calcGainLoss(pos);
          newBalance = Math.max(0, newBalance + loss);
          get().addNotification('error', `💥 Position liquidated: ${pos.type.toUpperCase()} ${pos.coin.ticker} - Loss: $${Math.abs(loss).toFixed(2)}`);
        }

        // Increase volatility over time
        if (turnsRemaining % 20 === 0) {
          incrementVolatility();
          get().addNotification('warning', '📈 Market volatility increased!');
        }

        const newTurnsRemaining = turnsRemaining - 1;
        const gameOver = newTurnsRemaining <= 0;

        set({
          coins: updatedCoins,
          positions: activePositions,
          player: { ...player, balance: newBalance },
          turnsRemaining: newTurnsRemaining,
          isGameOver: gameOver,
        });

        if (gameOver) {
          get().addNotification('info', '🏁 Game Over! Check your final results.');
        }
      },

      skipTurn: () => {
        get().completeTurn();
      },

      skipDay: () => {
        // Skip 8 turns (one trading day)
        for (let i = 0; i < 8; i++) {
          if (get().turnsRemaining > 0) {
            get().completeTurn();
          }
        }
        get().addNotification('info', '⏭️ Skipped 8 turns (1 trading day)');
      },

      openLongPosition: (coin: Coin, quantity: number, leverage: number) => {
        const { player, positions } = get();
        
        const validation = validateTrade(player.balance, coin, quantity, leverage);
        if (!validation.valid) {
          get().addNotification('error', validation.message);
          return false;
        }

        const margin = (quantity * coin.price) / leverage;
        const newTrade: Trade = {
          id: generateTradeId(),
          type: 'long',
          coin,
          quantity,
          entryPrice: coin.price,
          leverage,
        };

        set({
          positions: [...positions, newTrade],
          player: { ...player, balance: player.balance - margin },
        });

        get().addNotification('success', `📈 Opened LONG: ${quantity.toFixed(4)} ${coin.ticker} @ $${coin.price.toFixed(2)} (${leverage}x leverage)`);
        get().completeTurn();
        return true;
      },

      openShortPosition: (coin: Coin, quantity: number, leverage: number) => {
        const { player, positions } = get();
        
        const validation = validateTrade(player.balance, coin, quantity, leverage);
        if (!validation.valid) {
          get().addNotification('error', validation.message);
          return false;
        }

        const margin = (quantity * coin.price) / leverage;
        const newTrade: Trade = {
          id: generateTradeId(),
          type: 'short',
          coin,
          quantity,
          entryPrice: coin.price,
          leverage,
        };

        set({
          positions: [...positions, newTrade],
          player: { ...player, balance: player.balance - margin },
        });

        get().addNotification('success', `📉 Opened SHORT: ${quantity.toFixed(4)} ${coin.ticker} @ $${coin.price.toFixed(2)} (${leverage}x leverage)`);
        get().completeTurn();
        return true;
      },

      closePosition: (tradeId: string) => {
        const { positions, player } = get();
        const trade = positions.find(p => p.id === tradeId);
        
        if (!trade) {
          get().addNotification('error', 'Position not found');
          return 0;
        }

        const gainLoss = calcGainLoss(trade);
        const margin = (trade.quantity * trade.entryPrice) / trade.leverage;
        const returnAmount = margin + gainLoss;

        set({
          positions: positions.filter(p => p.id !== tradeId),
          player: { ...player, balance: player.balance + returnAmount },
        });

        const emoji = gainLoss >= 0 ? '💰' : '💸';
        const sign = gainLoss >= 0 ? '+' : '';
        get().addNotification(
          gainLoss >= 0 ? 'success' : 'warning',
          `${emoji} Closed ${trade.type.toUpperCase()} ${trade.coin.ticker}: ${sign}$${gainLoss.toFixed(2)}`
        );

        return gainLoss;
      },

      closeAllPositions: () => {
        const { positions, player } = get();
        let totalGainLoss = 0;

        for (const trade of positions) {
          const gainLoss = calcGainLoss(trade);
          const margin = (trade.quantity * trade.entryPrice) / trade.leverage;
          totalGainLoss += margin + gainLoss;
        }

        set({
          positions: [],
          player: { ...player, balance: player.balance + totalGainLoss },
        });

        const emoji = totalGainLoss >= 0 ? '💰' : '💸';
        get().addNotification('info', `${emoji} Closed all positions. Net: $${totalGainLoss.toFixed(2)}`);

        return totalGainLoss;
      },

      useMarketInsider: () => {
        const { marketInsiderAttempts, coins, player } = get();
        
        if (marketInsiderAttempts <= 0) {
          get().addNotification('error', 'No market insider attempts remaining');
          return null;
        }

        // Cost increases with fewer attempts remaining
        let cost = 75000;
        if (marketInsiderAttempts === 2) cost = 100000;
        if (marketInsiderAttempts === 1) cost = 150000;

        if (player.balance < cost) {
          get().addNotification('error', `Insufficient funds. Need $${cost.toLocaleString()}`);
          return null;
        }

        set({
          player: { ...player, balance: player.balance - cost },
          marketInsiderAttempts: marketInsiderAttempts - 1,
        });

        const predictions = predictNextMovements(coins);
        get().addNotification('info', `🕵️ Market insider intel acquired! Cost: $${cost.toLocaleString()}`);
        
        return predictions;
      },

      addNotification: (type, message) => {
        const notification: Notification = {
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type,
          message,
          timestamp: Date.now(),
        };

        set(state => ({
          notifications: [...state.notifications, notification].slice(-10), // Keep last 10
        }));

        // Auto-remove after 5 seconds
        setTimeout(() => {
          get().removeNotification(notification.id);
        }, 5000);
      },

      removeNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      resetGame: () => {
        set(initialState);
      },

      saveGame: () => {
        // The persist middleware automatically saves to localStorage
        // We just need to trigger a notification
        get().addNotification('success', '💾 Game saved successfully!');
      },

      resumeGame: () => {
        // The persist middleware automatically loads from localStorage
        // Just mark the game as started
        set({ isGameStarted: true });
        get().addNotification('info', '🎮 Welcome back! Resuming your saved game...');
      },

      quitToTitle: () => {
        // Don't reset the game state, just go back to title
        set({ isGameStarted: false, notifications: [] });
      },

      hasSavedGame: () => {
        const state = get();
        // Check if there's meaningful progress (not at initial state)
        return state.turnsRemaining < MAX_TURNS || state.positions.length > 0 || state.player.balance !== INITIAL_BALANCE;
      },

      loadFromSave: (gameState: SavedGameState) => {
        set({
          player: {
            balance: gameState.player.balance,
            portfolio: new Map(),
          },
          coins: gameState.coins,
          positions: gameState.positions,
          turnsRemaining: gameState.turnsRemaining,
          marketInsiderAttempts: gameState.marketInsiderAttempts,
          isGameOver: false,
          isGameStarted: true,
          notifications: [],
        });
        get().addNotification('info', '🎮 Game loaded! Welcome back, trader.');
      },

      getGameStateForSave: (): SavedGameState => {
        const { player, coins, positions, turnsRemaining, marketInsiderAttempts } = get();
        return {
          player: { balance: player.balance },
          coins,
          positions,
          turnsRemaining,
          marketInsiderAttempts,
        };
      },
    }),
    {
      name: 'trade-on-game',
      partialize: (state: GameState) => ({
        player: state.player,
        coins: state.coins,
        positions: state.positions,
        turnsRemaining: state.turnsRemaining,
        marketInsiderAttempts: state.marketInsiderAttempts,
        isGameStarted: state.isGameStarted,
        isGameOver: state.isGameOver,
      }),
    }
  )
);
