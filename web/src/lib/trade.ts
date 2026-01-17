// Trade calculations - matching Java Trade, LongTrade, ShortTrade classes

import { Trade, Coin } from './types';

// Calculate gain/loss for a long trade - matches Java LongTrade.calcGainLoss()
export function calcLongGainLoss(trade: Trade): number {
  return trade.quantity * (trade.coin.price - trade.entryPrice) * trade.leverage;
}

// Calculate gain/loss for a short trade - matches Java ShortTrade.calcGainLoss()
export function calcShortGainLoss(trade: Trade): number {
  return trade.quantity * (trade.entryPrice - trade.coin.price) * trade.leverage;
}

// Generic gain/loss calculator based on trade type
export function calcGainLoss(trade: Trade): number {
  if (trade.type === 'long') {
    return calcLongGainLoss(trade);
  } else {
    return calcShortGainLoss(trade);
  }
}

// Calculate total position value
export function calcPositionValue(trade: Trade): number {
  return trade.quantity * trade.coin.price;
}

// Calculate margin/collateral required for a trade
export function calcRequiredMargin(quantity: number, price: number, leverage: number): number {
  return (quantity * price) / leverage;
}

// Generate unique trade ID
export function generateTradeId(): string {
  return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validate trade parameters
export function validateTrade(
  balance: number,
  coin: Coin,
  quantity: number,
  leverage: number
): { valid: boolean; message: string } {
  if (quantity <= 0) {
    return { valid: false, message: "Quantity must be greater than 0" };
  }
  
  if (leverage < 1 || leverage > 10) {
    return { valid: false, message: "Leverage must be between 1 and 10" };
  }
  
  const requiredMargin = calcRequiredMargin(quantity, coin.price, leverage);
  
  if (requiredMargin > balance) {
    return { 
      valid: false, 
      message: `Insufficient balance. Required: $${requiredMargin.toFixed(2)}, Available: $${balance.toFixed(2)}` 
    };
  }
  
  return { valid: true, message: "Trade valid" };
}

// Calculate liquidation price for a leveraged position
export function calcLiquidationPrice(trade: Trade): number {
  const margin = calcRequiredMargin(trade.quantity, trade.entryPrice, trade.leverage);
  
  if (trade.type === 'long') {
    // Long position liquidates when price drops enough to wipe out margin
    return trade.entryPrice - (margin / trade.quantity);
  } else {
    // Short position liquidates when price rises enough to wipe out margin
    return trade.entryPrice + (margin / trade.quantity);
  }
}

// Check if position should be liquidated
export function shouldLiquidate(trade: Trade): boolean {
  const liquidationPrice = calcLiquidationPrice(trade);
  
  if (trade.type === 'long') {
    return trade.coin.price <= liquidationPrice;
  } else {
    return trade.coin.price >= liquidationPrice;
  }
}
