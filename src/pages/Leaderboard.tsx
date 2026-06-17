import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, Timer, Target, TrendingUp, Filter, RefreshCw } from 'lucide-react';
import { supabase } from '../utils/supabase';
import type { AuthUser } from '../App';

interface ScoreEntry {
  id: string;
  user_id: string;
  score: number;
  level: number;
  time_played: number;
  world: string;
  created_at: string;
  user_profiles: {
    username: string;
    avatar_url: string | null;
    display_name: string | null;
  };
}

const tabs = [
  { id: 'score', label: 'Điểm Cao', icon: Trophy },
  { id: 'level', label: 'Level', icon: Target },
  { id: 'speed', label: 'Speedrun', icon: Timer },
];

export default function Leaderboard({ user }: { user: AuthUser }) {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('score');
  const [timeRange, setTimeRange] = useState('all');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchScores();
  }, [activeTab, timeRange]);

  useEffect(() => {
    const channel = supabase
      .channel('game_scores_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'game_scores',
        },
        () => {
          fetchScores();
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('game_scores')
        .select('*, user_profiles!user_id(username, avatar_url, display_name)');

      if (activeTab === 'score') {
        query = query.order('score', { ascending: false });
      } else if (activeTab === 'level') {
        query = query.order('level', { ascending: false });
      } else {
        query = query.order('time_played', { ascending: true });
      }

      if (timeRange !== 'all') {
        const now = new Date();
        let from = new Date();
        if (timeRange === 'today') from.setDate(now.getDate() - 1);
        else if (timeRange === 'week') from.setDate(now.getDate() - 7);
        else if (timeRange === 'month') from.setMonth(now.getMonth() - 1);
        query = query.gte('created_at', from.toISOString());
      }

      query = query.limit(100);

      const { data, error } = await query;
      if (error) throw error;
      setScores(data || []);
    } catch (err) {
      console.error('Error fetching scores:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">{rank}</span>;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pt-24 pb-16">
      <section className="py-8 lg:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                <Trophy className="w-4 h-4" />
                Bảng Xếp Hạng
              </span>
              {isConnected && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Trực tiếp
                </motion.span>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              <span className="gradient-text">Top Players</span>
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Cạnh tranh cùng hàng triệu game thủ và giành vị trí cao nhất!
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-xl p-2 mb-6 flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500"
              >
                <option value="all">Tất cả</option>
                <option value="today">Hôm nay</option>
                <option value="week">Tuần này</option>
                <option value="month">Tháng này</option>
              </select>

              <button
                onClick={fetchScores}
                disabled={loading}
                className="p-2 rounded-lg glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-20">
              <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Chưa có dữ liệu điểm số</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = user?.id === entry.user_id;

                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className={`game-card rounded-xl p-4 flex items-center gap-4 ${
                      isCurrentUser ? 'border border-primary-500/30 bg-primary-500/5' : ''
                    } ${
                      rank <= 3 ? 'bg-gradient-to-r from-dark-900/80' : ''
                    } ${rank === 1 ? 'to-yellow-900/10' : rank === 2 ? 'to-gray-800/10' : rank === 3 ? 'to-amber-900/10' : ''}`}
                  >
                    <div className="w-12 flex justify-center">
                      {getRankIcon(rank)}
                    </div>

                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                      {entry.user_profiles?.avatar_url ? (
                        <img
                          src={entry.user_profiles.avatar_url}
                          alt={entry.user_profiles.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        (entry.user_profiles?.username?.charAt(0) || 'U').toUpperCase()
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${isCurrentUser ? 'text-primary-400' : 'text-white'}`}>
                        {entry.user_profiles?.display_name || entry.user_profiles?.username || 'Anonymous'}
                        {isCurrentUser && <span className="text-xs text-gray-400 ml-2">(Bạn)</span>}
                      </p>
                      <p className="text-sm text-gray-400">
                        {entry.world} - Level {entry.level}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-xl font-bold text-white">
                        {activeTab === 'speed' ? formatTime(entry.time_played) : entry.score.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activeTab === 'score'
                          ? 'điểm'
                          : activeTab === 'level'
                          ? `Level ${entry.level}`
                          : 'thời gian'}
                      </p>
                    </div>

                    {(rank === 1 || rank === 2 || rank === 3) && (
                      <div className="hidden sm:block">
                        <TrendingUp className={`w-5 h-5 ${
                          rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-400' : 'text-amber-500'
                        }`} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 text-center"
            >
              <a
                href="/download"
                className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-xl font-semibold text-white"
              >
                <Trophy className="w-5 h-5" />
                <span>Tải game và tham gia BXH</span>
              </a>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
