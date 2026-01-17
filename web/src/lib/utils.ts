// Utility functions for formatting

export function formatCurrency(amount: number): string {
  if (Math.abs(amount) >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(2)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (Math.abs(num) >= 1000000) {
    return `${(num / 1000000).toFixed(decimals)}M`;
  }
  if (Math.abs(num) >= 1000) {
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  return num.toFixed(decimals);
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatPrice(price: number): string {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (price >= 1) {
    return `$${price.toFixed(2)}`;
  }
  return `$${price.toFixed(4)}`;
}

export function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getChangeColor(change: number): string {
  if (change > 0) return 'text-trade-green';
  if (change < 0) return 'text-trade-red';
  return 'text-gray-400';
}

export function getBgChangeColor(change: number): string {
  if (change > 0) return 'bg-trade-green/20 border-trade-green/50';
  if (change < 0) return 'bg-trade-red/20 border-trade-red/50';
  return 'bg-gray-700/20 border-gray-600/50';
}
