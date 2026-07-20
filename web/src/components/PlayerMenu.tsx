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
  Trash2,
  User,
  LogOut,
  Skull,
  Award,
  Wallet,
  Activity,
  Bell,
  Settings,
  Search,
  ChevronDown,
  ArrowUpRight,
  CalendarDays,
  Rocket,
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

  const stats = profile?.stats;
  const gamesPlayed = stats?.gamesPlayed || 0;
  const gamesWon = stats?.gamesWon || 0;
  const gamesLost = stats?.gamesLost || 0;
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
  const displayName = profile?.name || user.name || 'Trader';

  const navTabs = [
    { label: 'Account Overview', href: '#overview', active: true },
    { label: 'Saved Games', href: '#saved', active: false },
    { label: 'History', href: '#history', active: false },
    { label: 'Leaderboard', href: '#leaderboard', active: false },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0a0b12]">
      {/* ===== Animated background ===== */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[15%] w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[120px] animate-drift" />
        <div className="absolute bottom-[0%] right-[10%] w-[420px] h-[420px] bg-purple-500/10 rounded-full blur-[120px] animate-drift-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* ===== Top navigation bar ===== */}
        <nav className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-3 py-2.5 mb-6">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            {/* Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {navTabs.map((tab) => (
                <a
                  key={tab.label}
                  href={tab.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    tab.active
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="hidden sm:flex w-10 h-10 rounded-full bg-white/5 border border-white/10 items-center justify-center text-gray-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>

            {/* Profile pill */}
            <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 pl-1 pr-3 py-1">
              {user.image ? (
                <img src={user.image} alt="Profile" className="w-8 h-8 rounded-full border border-violet-400/50" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-sm font-medium text-white">{displayName}</p>
                <p className="text-[11px] text-gray-500 max-w-[140px] truncate">{user.email}</p>
              </div>
              <ChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
            </div>

            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-400/40 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-14 h-14 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div id="overview" className="space-y-6">
            {/* ===== Account card + action card ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Big account card */}
              <div className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6">
                <div className="absolute -top-20 -right-16 w-64 h-64 bg-violet-600/20 rounded-full blur-[90px] pointer-events-none" />
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      {user.image ? (
                        <img src={user.image} alt="Profile" className="w-14 h-14 rounded-2xl border border-violet-400/50" />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                          <User className="w-7 h-7 text-white" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-2xl font-bold text-white">{displayName}</h1>
                        <p className="text-sm text-gray-400">Cryptocurrency Trading Simulator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                      <Trophy className="w-4 h-4 text-violet-300" />
                      <span className="text-sm font-medium text-white">Rank #{leaderboard.findIndex(e => e.playerEmail === user.email) + 1 || '—'}</span>
                    </div>
                  </div>

                  {/* Detail chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                    <DetailChip icon={<Wallet className="w-4 h-4" />} label="Initial Balance" value="$1,000,000" />
                    <DetailChip icon={<Clock className="w-4 h-4" />} label="Turns / Game" value="160" />
                    <DetailChip icon={<Activity className="w-4 h-4" />} label="Account Type" value="Simulation" />
                  </div>

                  {/* Divider */}
                  <div className="my-6 h-px bg-white/10" />

                  {/* Account details */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm font-semibold text-white">Account details</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FieldBox label="Email" value={user.email || '—'} />
                    <FieldBox label="Member Since" value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—'} />
                    <FieldBox label="Best Score" value={formatCurrency(stats?.bestScore || 0)} accent />
                    <FieldBox label="Win Rate" value={`${winRate}%`} accent />
                  </div>
                </div>
              </div>

              {/* Action / start card */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-violet-600/20 to-white/[0.02] p-6 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Rocket className="w-4 h-4 text-violet-300" />
                  Ready to Trade?
                </div>

                <div className="flex-1 flex items-center justify-center py-6">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-violet-500/40 animate-glow">
                    <TrendingUp className="w-14 h-14 text-white" />
                  </div>
                </div>

                <p className="text-center text-sm text-gray-400 mb-4">
                  Borrow <span className="text-emerald-400 font-semibold">$1,000,000</span> and turn it into a fortune in{' '}
                  <span className="text-yellow-400 font-semibold">160 turns</span>.
                </p>

                <button
                  onClick={handleStartNewGame}
                  className="group w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-5 h-5" />
                  Start New Game
                </button>
              </div>
            </div>

            {/* ===== Stat cards ===== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Best Score - highlighted */}
              <div className="relative overflow-hidden rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-600/40 to-purple-700/20 p-5">
                <div className="flex items-center gap-2 text-violet-100 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium">Best Score</span>
                </div>
                <p className="text-2xl font-bold text-white">{formatCurrency(stats?.bestScore || 0)}</p>
              </div>

              <StatCard
                icon={<TrendingUp className="w-4 h-4" />}
                label="Total Profit"
                value={formatCurrency(stats?.totalProfit || 0)}
                valueClass={(stats?.totalProfit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}
              />
              <StatCard
                icon={<Trophy className="w-4 h-4" />}
                label="Wins / Losses"
                value={
                  <>
                    <span className="text-emerald-400">{gamesWon}</span>
                    <span className="text-gray-500"> / </span>
                    <span className="text-red-400">{gamesLost}</span>
                  </>
                }
              />
              <StatCard
                icon={<Activity className="w-4 h-4" />}
                label="Games Played"
                value={gamesPlayed}
              />
            </div>

            {/* ===== Detail panels ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Saved Games */}
              <Panel id="saved" icon={<FolderOpen className="w-4 h-4 text-violet-300" />} title="Saved Games">
                {savedGames.length === 0 ? (
                  <EmptyState icon={<FolderOpen className="w-10 h-10" />} title="No saved games yet" subtitle="Start a game and save your progress" />
                ) : (
                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {savedGames.map((save) => (
                      <div
                        key={save.id}
                        onClick={() => handleLoadGame(save)}
                        className="group rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-violet-400/40 hover:bg-white/[0.05] transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium text-white group-hover:text-violet-300 transition-colors">{save.name}</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => handleDeleteSave(save.id, e)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-violet-300 transition-colors" />
                          </div>
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
                        <p className="text-xs text-gray-600 mt-2">{formatDate(save.updatedAt)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              {/* Recent Games */}
              <Panel id="history" icon={<CalendarDays className="w-4 h-4 text-yellow-400" />} title="Recent Games">
                {gameHistory.length === 0 ? (
                  <EmptyState icon={<Clock className="w-10 h-10" />} title="No completed games yet" subtitle="Finish a game to see it here" />
                ) : (
                  <div className="space-y-1 max-h-[340px] overflow-y-auto pr-1">
                    {gameHistory.slice(0, 8).map((record) => (
                      <div key={record.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div className="flex items-center gap-2">
                          {record.won ? (
                            <Trophy className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Skull className="w-4 h-4 text-red-400" />
                          )}
                          <span className={`text-sm font-medium ${record.won ? 'text-emerald-400' : 'text-red-400'}`}>
                            {formatCurrency(record.finalBalance)}
                          </span>
                        </div>
                        <span className="text-xs text-gray-600">{new Date(record.completedAt).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>

              {/* Leaderboard */}
              <Panel id="leaderboard" icon={<Trophy className="w-4 h-4 text-yellow-400" />} title="Leaderboard">
                {leaderboard.length === 0 ? (
                  <EmptyState icon={<Award className="w-10 h-10" />} title="No scores yet" subtitle="Be the first to complete a game!" />
                ) : (
                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={`${entry.playerEmail}-${index}`}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          entry.playerEmail === user.email
                            ? 'bg-violet-500/10 border border-violet-400/30'
                            : 'bg-white/[0.02] border border-white/5'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                          index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                          index === 1 ? 'bg-gray-400/20 text-gray-300' :
                          index === 2 ? 'bg-orange-500/20 text-orange-400' :
                          'bg-white/5 text-gray-500'
                        }`}>
                          {entry.rank}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${entry.playerEmail === user.email ? 'text-violet-300' : 'text-white'}`}>
                            {entry.playerName}
                            {entry.playerEmail === user.email && ' (You)'}
                          </p>
                        </div>
                        <span className="text-emerald-400 font-semibold text-sm">{formatCurrency(entry.score)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Small presentational helpers ===== */

function DetailChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
      <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-violet-300">{icon}</span>
      <div className="leading-tight">
        <p className="text-[11px] text-gray-500">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function FieldBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
      <p className="text-[11px] text-gray-500 mb-0.5">{label}</p>
      <p className={`text-sm font-medium truncate ${accent ? 'text-violet-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueClass = 'text-white',
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-violet-300">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function Panel({
  id,
  icon,
  title,
  children,
}: {
  id?: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{icon}</span>
        <h2 className="text-base font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="text-center py-10">
      <div className="text-gray-700 mx-auto mb-3 flex justify-center">{icon}</div>
      <p className="text-gray-500">{title}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}
