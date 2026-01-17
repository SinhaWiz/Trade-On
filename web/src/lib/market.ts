// Market simulation logic - directly ported from Java Market.java

import { Coin } from './types';

// Constants matching Java Market class
const BASE_MU = 0.0005;
let SIGMA = 0.65;
const DT = 1.0 / 252;

export function getSigma(): number {
  return SIGMA;
}

export function setSigma(value: number): void {
  SIGMA = value;
}

export function incrementVolatility(): void {
  SIGMA = SIGMA + 0.05;
}

// Gaussian random number generator (Box-Muller transform)
function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Calculate change factor - matches Java's calculateChangeFactor method
export function calculateChangeFactor(coin: Coin): number {
  const epsilon = gaussianRandom();
  let changeFactor = 0;

  if (coin.possiblePositiveTrend) {
    // Try to get a positive change (factor >= 1)
    for (let i = 0; i < 50000; i++) {
      changeFactor = Math.exp((BASE_MU - 0.5 * SIGMA * SIGMA) * DT + SIGMA * epsilon * Math.sqrt(DT));
      if (changeFactor >= 1) break;
    }
  } else if (coin.possibleNegativeTrend) {
    // Try to get a negative change (factor < 1)
    for (let i = 0; i < 50000; i++) {
      changeFactor = Math.exp((BASE_MU - 0.5 * SIGMA * SIGMA) * DT + SIGMA * epsilon * Math.sqrt(DT));
      if (changeFactor < 1) break;
    }
  } else {
    // No trend bias
    changeFactor = Math.exp((BASE_MU - 0.5 * SIGMA * SIGMA) * DT + SIGMA * epsilon * Math.sqrt(DT));
  }

  return changeFactor;
}

// Set trends - matches Java's setTrends method
export function setTrends(coins: Coin[]): Coin[] {
  return coins.map(coin => {
    if (!coin.possibleNegativeTrend && !coin.possiblePositiveTrend) {
      if (Math.random() < 0.7) {
        if (Math.random() < 0.5) {
          return { ...coin, possiblePositiveTrend: true };
        } else {
          return { ...coin, possibleNegativeTrend: true };
        }
      }
    }
    return coin;
  });
}

// Remove trends - matches Java's removeTrends method
export function removeTrends(coins: Coin[]): Coin[] {
  return coins.map(coin => {
    if (Math.random() < 0.4) {
      return { ...coin, possiblePositiveTrend: false, possibleNegativeTrend: false };
    }
    return coin;
  });
}

// Simulate market movement - matches Java's simulateMarketMovement method
export function simulateMarketMovement(coins: Coin[]): Coin[] {
  // First set trends
  let updatedCoins = setTrends(coins);
  
  // Calculate new prices
  updatedCoins = updatedCoins.map(coin => {
    const changeFactor = calculateChangeFactor(coin);
    let newPrice = coin.price * changeFactor;
    newPrice = Math.max(0.0001, newPrice); // Prevent negative prices
    
    // Keep last 50 price points for history
    const newHistory = [...coin.priceHistory, newPrice].slice(-50);
    
    return {
      ...coin,
      previousPrice: coin.price,
      price: newPrice,
      priceHistory: newHistory,
    };
  });
  
  // Remove some trends
  updatedCoins = removeTrends(updatedCoins);
  
  return updatedCoins;
}

// Predict next movements - matches Java's predictNextMovements method
export function predictNextMovements(coins: Coin[]): Map<string, number> {
  const predictions = new Map<string, number>();
  
  for (const coin of coins) {
    let changeFactorFlag: number;
    if (coin.possiblePositiveTrend) {
      changeFactorFlag = 1; // Likely to go up
    } else if (coin.possibleNegativeTrend) {
      changeFactorFlag = 0; // Likely to go down
    } else {
      changeFactorFlag = -1; // Unknown/neutral
    }
    predictions.set(coin.ticker, changeFactorFlag);
  }
  
  return predictions;
}

// Calculate percentage change
export function calculatePercentageChange(currentPrice: number, previousPrice: number): number {
  if (previousPrice === 0) return 0;
  return ((currentPrice - previousPrice) / previousPrice) * 100;
}
