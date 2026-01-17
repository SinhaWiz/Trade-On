'use client';

import { useGameStore } from '@/lib/gameStore';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function Notifications() {
  const { notifications, removeNotification } = useGameStore();

  if (notifications.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-trade-green" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-trade-red" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default: return <Info className="w-5 h-5 text-trade-accent" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-trade-green/10 border-trade-green/30';
      case 'error': return 'bg-trade-red/10 border-trade-red/30';
      case 'warning': return 'bg-yellow-400/10 border-yellow-400/30';
      default: return 'bg-trade-accent/10 border-trade-accent/30';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm
            ${getBgColor(notification.type)} animate-slide-in`}
        >
          {getIcon(notification.type)}
          <p className="text-white text-sm flex-1">{notification.message}</p>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
