'use client';

import { useEffect } from 'react';
import { usePlayerStore } from '@/lib/playerStore';
import { useGameStore } from '@/lib/gameStore';
import { SavedGame } from '@/lib/playerTypes';
import { 
  Play, 
  FolderOpen, 
  Trophy, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Target,
  Trash2,
  User,
  LogOut,
  Sparkles,
  Skull,
  Award,
  BarChart2
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PlayerMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function PlayerMenu({ user }: PlayerMenuProps) {
  const router = useRouter();
  const { 
    profile, 
    savedGames, 
    gameHistory,
    leaderboard,
    isLoading, 
    loadProfile,
    deleteSave,
  } = usePlayerStore();
  
  const { 
    startNewGame, 
    loadFromSave,
    isGameStarted,
  } = useGameStore();

  useEffect(() => {
    if (user.email) {
      loadProfile(user.email, user.name || undefined, user.image);
    }
  }, [user.email, user.name, user.image, loadProfile]);

  const handleSignOut = () => {
    // Clear all stored data
    localStorage.removeItem('demo-user');
    localStorage.removeItem('trade-on-game');
    signOut({ callbackUrl: '/login' });
    router.push('/login');
  };

  const handleStartNewGame = () => {
    startNewGame();
  };

  const handleLoadGame = (save: SavedGame) => {
    loadFromSave(save.gameState);
  };

  const handleDeleteSave = async (saveId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this save?')) {
      await deleteSave(saveId);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isGameStarted) return null;

  return (
    <div className="fixed inset-0 bg-trade-dark z-50 overflow-y-auto">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-trade-accent/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-trade-green/10 rounded-full blur-[80px] animate-pulse" />
      </div>

      {/* Header with user info */}
      <div className="relative z-10 border-b border-trade-border bg-trade-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-trade-accent via-purple-500 to-trade-green rounded-2xl 
              flex items-center justify-center shadow-lg shadow-trade-accent/30">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Trade-<span className="bg-gradient-to-r from-trade-accent to-purple-500 bg-clip-text text-transparent">On</span>
              </h1>
              <p className="text-sm text-gray-400">Cryptocurrency Trading Simulator</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right mr-2">
              <p className="font-medium text-white">{profile?.name || user.name || 'Trader'}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
            </div>
            {user.image ? (
              <img src={user.image} alt="Profile" className="w-12 h-12 rounded-full border-2 border-trade-accent" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-trade-accent flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="p-3 rounded-xl hover:bg-trade-red/20 text-gray-400 hover:text-trade-red transition-all"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-trade-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Left Column - Stats & Actions */}
            <div className="col-span-4 space-y-6">
              {/* Player Stats Card */}
              <div className="bg-trade-card/60 backdrop-blur-sm border border-trade-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-trade-accent" />
                  Your Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Games Played</span>
                    <span className="text-white font-medium">{profile?.stats.gamesPlayed || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Wins / Losses</span>
                    <span className="text-white font-medium">
                      <span className="text-trade-green">{profile?.stats.gamesWon || 0}</span>
                      {' / '}
                      <span className="text-trade-red">{profile?.stats.gamesLost || 0}</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Best Score</span>
                    <span className="text-trade-green font-medium">
                      {formatCurrency(profile?.stats.bestScore || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Profit</span>
                    <span className={`font-medium ${(profile?.stats.totalProfit || 0) >= 0 ? 'text-trade-green' : 'text-trade-red'}`}>
                      {formatCurrency(profile?.stats.totalProfit || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Story Card */}
              <div className="bg-trade-card/60 backdrop-blur-sm border border-trade-border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-trade-red/20 to-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-trade-red/30">
                    <Skull className="w-6 h-6 text-trade-red" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">The Stakes</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Borrow <span className="text-trade-green font-bold">$1,000,000</span> from a loan shark. 
                      Pay it back in <span className="text-yellow-400 font-bold">160 turns</span> or face the consequences...
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleStartNewGame}
                  className="w-full flex items-center justify-center gap-3 py-4 
                    bg-gradient-to-r from-trade-accent to-purple-500 text-white font-bold text-lg 
                    rounded-xl shadow-lg shadow-trade-accent/30 hover:shadow-trade-accent/50 
                    transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-6 h-6" />
                  Start New Game
                </button>
              </div>
            </div>

            {/* Middle Column - Saved Games */}
            <div className="col-span-4 space-y-6">
              <div className="bg-trade-card/60 backdrop-blur-sm border border-trade-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-purple-400" />
                  Saved Games
                </h2>
                
                {savedGames.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No saved games yet</p>
                    <p className="text-sm text-gray-600">Start a new game and save your progress</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {savedGames.map((save) => (
                      <div
                        key={save.id}
                        onClick={() => handleLoadGame(save)}
                        className="w-full bg-trade-dark/50 border border-trade-border/50 rounded-xl p-4 
                          hover:border-purple-500/50 hover:bg-trade-dark/70 transition-all group text-left cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-white group-hover:text-purple-400 transition-colors">
                            {save.name}
                          </span>
                          <button
                            onClick={(e) => handleDeleteSave(save.id, e)}
                            className="p-1.5 rounded-lg hover:bg-trade-red/20 text-gray-500 hover:text-trade-red transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-400 flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            {formatCurrency(save.gameState.player.balance)}
                          </span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {save.gameState.turnsRemaining} turns left
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(save.updatedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Game History */}
              <div className="bg-trade-card/60 backdrop-blur-sm border border-trade-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  Recent Games
                </h2>
                
                {gameHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <Target className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No completed games yet</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {gameHistory.slice(0, 5).map((record) => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between py-2 border-b border-trade-border/30 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          {record.won ? (
                            <Trophy className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Skull className="w-4 h-4 text-trade-red" />
                          )}
                          <span className={`text-sm font-medium ${record.won ? 'text-trade-green' : 'text-trade-red'}`}>
                            {formatCurrency(record.finalBalance)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(record.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Leaderboard */}
            <div className="col-span-4">
              <div className="bg-trade-card/60 backdrop-blur-sm border border-trade-border rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Leaderboard
                </h2>
                
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No scores yet</p>
                    <p className="text-sm text-gray-600">Be the first to complete a game!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={`${entry.playerEmail}-${index}`}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          entry.playerEmail === user.email 
                            ? 'bg-trade-accent/10 border border-trade-accent/30' 
                            : 'bg-trade-dark/30'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-300' :
                          index === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-trade-dark/50 text-gray-500'
                        }`}>
                          {entry.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            entry.playerEmail === user.email ? 'text-trade-accent' : 'text-white'
                          }`}>
                            {entry.playerName}
                            {entry.playerEmail === user.email && ' (You)'}
                          </p>
                        </div>
                        <span className="text-trade-green font-semibold text-sm">
                          {formatCurrency(entry.score)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
