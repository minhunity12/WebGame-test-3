import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Settings,
  Award,
  Clock,
  Coins,
  Gem,
  Trophy,
  Target,
  Edit3,
  Save,
  LogOut,
  Shield,
  Gamepad2,
  Calendar,
  Mail,
  Lock,
  Loader2,
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import type { AuthUser } from '../App';
import type { Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  coins: number;
  gems: number;
  total_play_time: number;
  highest_level: number;
  created_at: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward_coins: number;
  reward_gems: number;
  unlocked_at?: string;
}

interface UserStats {
  totalSessions: number;
  totalDeaths: number;
  starsCollected: number;
  achievementsUnlocked: number;
}

export default function Profile({ user, session }: { user: AuthUser; session: Session | null }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'settings'>('overview');
  const [stats, setStats] = useState<UserStats>({
    totalSessions: 0,
    totalDeaths: 0,
    starsCollected: 0,
    achievementsUnlocked: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth?mode=login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    try {
      const [profileRes, achievementsRes, progressRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('id', user.id).single(),
        supabase.from('achievements').select('*'),
        supabase.from('user_progress').select('*').eq('user_id', user.id),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data as UserProfile);
        setDisplayName(profileRes.data.display_name || profileRes.data.username);
      }
      if (achievementsRes.data) {
        const baseAchievements = achievementsRes.data as Achievement[];
        const { data: userAchievements } = await supabase
          .from('user_achievements')
          .select('achievement_id, unlocked_at')
          .eq('user_id', user.id);
        const unlockedMap = new Map(userAchievements?.map((a) => [a.achievement_id, a.unlocked_at]));
        const achievementsWithStatus = baseAchievements.map((a) => ({
          ...a,
          unlocked_at: unlockedMap.get(a.id),
        }));
        setAchievements(achievementsWithStatus);
      }
      if (progressRes.data) {
        const progress = progressRes.data as { stars: number; completed: boolean }[];
        setStats({
          totalSessions: progress.length,
          starsCollected: progress.reduce((sum, p) => sum + (p.stars || 0), 0),
          totalDeaths: 0,
          achievementsUnlocked: achievements.filter((a) => a.unlocked_at).length,
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ display_name: displayName.trim() })
        .eq('id', user.id);
      if (error) throw error;
      if (profile) {
        setProfile({ ...profile, display_name: displayName.trim() });
      }
      setEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const formatPlayTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 lg:p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-4xl font-bold text-white overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (profile?.username?.charAt(0) || 'U').toUpperCase()
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-dark-950 flex items-center justify-center border-2 border-secondary-500">
                  <Shield className="w-4 h-4 text-secondary-400" />
                </div>
              </div>

              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                  <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">
                    {profile?.display_name || profile?.username}
                  </h1>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="p-2 rounded-lg glass hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-400 mb-4">@{profile?.username}</p>

                {editing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-dark-900 border border-white/10 text-white focus:outline-none focus:border-primary-500"
                      placeholder="Tên hiển thị"
                    />
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary px-4 py-2 rounded-lg text-white font-medium"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                  </motion.div>
                )}

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10">
                    <Coins className="w-5 h-5 text-yellow-400" />
                    <span className="text-yellow-400 font-bold">{profile?.coins?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10">
                    <Gem className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-400 font-bold">{profile?.gems?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-3">
                <p className="text-sm text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tham gia: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                </p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Đăng Xuất</span>
                </button>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { id: 'overview', label: 'Tổng Quan', icon: User },
              { id: 'achievements', label: 'Thành Tựu', icon: Award },
              { id: 'settings', label: 'Cài Đặt', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Level Cao Nhất', value: profile?.highest_level || 1, icon: Target, color: 'text-primary-400' },
                  { label: 'Thời Gian Chơi', value: formatPlayTime(profile?.total_play_time || 0), icon: Clock, color: 'text-secondary-400' },
                  { label: 'Sao Thu Thập', value: stats.starsCollected, icon: Trophy, color: 'text-yellow-400' },
                  { label: 'Phiên Chơi', value: stats.totalSessions, icon: Gamepad2, color: 'text-purple-400' },
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="game-card rounded-xl p-4 text-center">
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-gray-400">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-4"
            >
              {achievements.map((achievement) => {
                const isUnlocked = !!achievement.unlocked_at;
                return (
                  <div
                    key={achievement.id}
                    className={`game-card rounded-xl p-4 flex items-center gap-4 ${
                      isUnlocked ? 'border border-secondary-500/30' : 'opacity-50'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                        isUnlocked
                          ? 'bg-gradient-to-br from-secondary-500/20 to-primary-500/20'
                          : 'bg-dark-900!'
                      }`}
                    >
                      {isUnlocked ? (achievement.icon || '🏅') : '🔒'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{achievement.name}</h3>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                      {isUnlocked && (
                        <p className="text-xs text-secondary-400 mt-1">
                          Mở khóa: {new Date(achievement.unlocked_at!).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {achievement.reward_coins > 0 && (
                        <p className="text-yellow-400 text-sm">{achievement.reward_coins} xu</p>
                      )}
                      {achievement.reward_gems > 0 && (
                        <p className="text-purple-400 text-sm">{achievement.reward_gems} gem</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="game-card rounded-xl p-6">
                <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Thông Tin Tài Khoản
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-white/10">
                    <span className="text-gray-400">Email:</span>
                    <span className="text-white">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">ID:</span>
                    <span className="text-gray-500 text-sm font-mono">{user.id}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Email được quản lý bởi hệ thống xác thực Supabase.
                  </p>
                </div>
              </div>

              <div className="game-card rounded-xl p-6">
                <h2 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Bảo Mật
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Để thay đổi mật khẩu, vui lòng sử dụng tính năng quên mật khẩu ở trang đăng nhập.
                </p>
                <a
                  href="/auth?mode=login"
                  className="text-primary-400 text-sm hover:text-primary-300 transition-colors inline-flex items-center gap-1"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
