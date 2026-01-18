// Types for player profiles and saved games

export interface PlayerProfile {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  createdAt: Date;
  lastLoginAt: Date;
  stats: PlayerStats;
}

export interface PlayerStats {
  gamesPlayed: number;
  gamesWon: number; // Ended with balance >= 1,000,000
  gamesLost: number;
  bestScore: number;
  totalProfit: number;
  averageScore: number;
}

export interface SavedGame {
  id: string;
  playerId: string;
  playerEmail: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  gameState: SavedGameState;
}

export interface SavedGameState {
  player: {
    balance: number;
  };
  coins: {
    name: string;
    ticker: string;
    price: number;
    previousPrice: number;
    possiblePositiveTrend: boolean;
    possibleNegativeTrend: boolean;
    priceHistory: number[];
  }[];
  positions: {
    id: string;
    type: 'long' | 'short';
    coin: {
      name: string;
      ticker: string;
      price: number;
      previousPrice: number;
      possiblePositiveTrend: boolean;
      possibleNegativeTrend: boolean;
      priceHistory: number[];
    };
    quantity: number;
    entryPrice: number;
    leverage: number;
  }[];
  turnsRemaining: number;
  marketInsiderAttempts: number;
}

export interface GameRecord {
  id: string;
  playerId: string;
  playerEmail: string;
  completedAt: Date;
  finalBalance: number;
  turnsUsed: number;
  won: boolean;
  profit: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  playerEmail: string;
  score: number;
  date: Date;
}
