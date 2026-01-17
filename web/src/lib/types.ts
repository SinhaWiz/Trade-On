// Types matching the Java game logic

export interface Coin {
  name: string;
  ticker: string;
  price: number;
  previousPrice: number;
  possiblePositiveTrend: boolean;
  possibleNegativeTrend: boolean;
  priceHistory: number[];
}

export interface Trade {
  id: string;
  type: 'long' | 'short';
  coin: Coin;
  quantity: number;
  entryPrice: number;
  leverage: number;
}

export interface Player {
  balance: number;
  portfolio: Map<string, number>;
}

export interface GameState {
  player: Player;
  coins: Coin[];
  positions: Trade[];
  turnsRemaining: number;
  marketInsiderAttempts: number;
  isGameOver: boolean;
  isGameStarted: boolean;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

export interface TradeResult {
  success: boolean;
  message: string;
  gainLoss?: number;
}

// Default coins matching Java's initializeDefaultCoins()
export const DEFAULT_COINS: Omit<Coin, 'previousPrice' | 'priceHistory'>[] = [
  { name: "Bitcoin", ticker: "BTC", price: 50000, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: "Ethereum", ticker: "ETH", price: 3000, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: "Binance Coin", ticker: "BNB", price: 400, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: "Cardano", ticker: "ADA", price: 1.5, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: "Solana", ticker: "SOL", price: 100, possiblePositiveTrend: false, possibleNegativeTrend: false },
  { name: "Dogecoin", ticker: "DOGE", price: 0.15, possiblePositiveTrend: false, possibleNegativeTrend: false },
];

export const MAX_TURNS = 160;
export const INITIAL_BALANCE = 1000000;
export const MAX_LEVERAGE = 10;
