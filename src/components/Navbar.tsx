import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, BookOpen, Trophy, Download, CreditCard, User, LogOut, Settings, ChevronDown, Star, Sparkles, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../utils/supabase';
import type { AuthUser } from '../App';

interface NavbarProps {
  user: AuthUser;
}

const navItems = [
  { path: '/', label: 'Trang Chủ', icon: Home },
  { path: '/story', label: 'Cốt Truyện', icon: BookOpen },
  { path: '/characters', label: 'Nhân Vật', icon: Users },
  { path: '/leaderboard', label: 'BXH', icon: Trophy },
  { path: '/forum', label: 'Diễn Đàn', icon: MessageSquare },
  { path: '/download', label: 'Tải Game', icon: Download },
  { path: '/topup', label: 'Nạp Thẻ', icon: CreditCard },
];

export default function Navbar({ user }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<{ coins: number; gems: number } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_profiles').select('coins, gems').eq('id', user.id).single();
    if (data) setUserProfile(data as { coins: number; gems: number });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-dark-950/95 backdrop-blur-xl shadow-xl shadow-primary-500/5 border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20">
            {/* Logo - Replace with your own logo image */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* LOGO PLACEHOLDER — swap this div for your <img src="/logo.png" /> */}
                <div className="h-9 px-3 rounded-lg border border-dashed border-white/30 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors">
                  <span className="font-display text-xs font-bold text-white/50 tracking-widest uppercase">Logo</span>
                </div>
              </motion.div>
              <div className="hidden sm:block">
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-display text-xl font-bold bg-gradient-to-r from-white via-primary-300 to-secondary-300 bg-clip-text text-transparent"
                >
                  Pixel Adventure
                </motion.span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center bg-white/5 backdrop-blur-sm rounded-full p-1 border border-white/10">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} to={item.path} className="relative">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-4 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 ${
                          active ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{item.label}</span>
                        <AnimatePresence>
                          {active && (
                            <motion.div
                              layoutId="activeNav"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                              className="absolute inset-0 bg-gradient-to-r from-primary-600/80 to-secondary-600/80 rounded-full -z-10"
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Side - Auth or User Menu */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 pl-3 pr-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/10 hover:border-primary-500/30 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white max-w-28 truncate">
                        {user.user_metadata?.username || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="text-yellow-400 font-semibold">{userProfile?.coins?.toLocaleString() || 0}</span>
                        <span className="text-purple-400 font-semibold">{userProfile?.gems || 0}</span>
                      </p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </motion.button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-dark-900/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary-500/10 overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10">
                          <p className="text-white font-medium">{user.user_metadata?.username || user.email?.split('@')[0]}</p>
                          <p className="text-gray-400 text-sm truncate">{user.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors group"
                          >
                            <User className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
                            <span>Hồ Sơ Cá Nhân</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors group"
                          >
                            <Settings className="w-5 h-5 text-secondary-400 group-hover:text-secondary-300" />
                            <span>Cài Đặt</span>
                          </Link>
                          <div className="h-px bg-white/5 my-2" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Đăng Xuất</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth?mode=login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-5 py-2.5 rounded-full text-gray-300 hover:text-white font-medium transition-colors"
                    >
                      Đăng Nhập
                    </motion.button>
                  </Link>
                  <Link to="/auth?mode=register">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(255,45,157,0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-5 py-2.5 rounded-full font-medium text-white overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500" />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 via-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <span className="relative flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Đăng Ký
                      </span>
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl glass text-white hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-dark-950/98 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-dark-900/95 backdrop-blur-xl border-r border-white/10 p-6 pt-24"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Logo in mobile menu */}
              <div className="mb-8">
                <Link to="/" className="flex items-center gap-3">
                  <div className="h-10 px-4 rounded-lg border border-dashed border-white/30 flex items-center justify-center bg-white/5">
                    <span className="font-display text-xs font-bold text-white/50 tracking-widest uppercase">Logo</span>
                  </div>
                  <span className="font-display text-2xl font-bold gradient-text">Pixel Adventure</span>
                </Link>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                          active
                            ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/10 border border-primary-500/30 text-white'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          active ? 'bg-primary-500/20' : 'bg-white/5'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

              {/* Auth Section */}
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user.user_metadata?.username || user.email?.split('@')[0]}</p>
                      <p className="text-gray-400 text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white">
                    <User className="w-5 h-5" />
                    <span>Hồ Sơ</span>
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10">
                    <LogOut className="w-5 h-5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link to="/auth?mode=register" className="block">
                      <button className="w-full py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold text-center shadow-lg shadow-primary-500/20">
                        <span className="flex items-center justify-center gap-2">
                          <Star className="w-5 h-5" />
                          Đăng Ký Miễn Phí
                        </span>
                        <p className="text-xs opacity-80 mt-1">Nhận ngay 1000 xu + 10 gem</p>
                      </button>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link to="/auth?mode=login" className="block">
                      <button className="w-full py-3 rounded-xl glass border border-white/10 text-white text-center font-medium hover:bg-white/10 transition-colors">
                        Đăng Nhập
                      </button>
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
