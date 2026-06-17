import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play,
  Download,
  ChevronDown,
  Star,
  Users,
  Trophy,
  BookOpen,
  ArrowRight,
  Zap,
  Gift,
  Shield,
  Gamepad2,
  Swords,
  Target,
  Compass,
  MessageSquare,
} from 'lucide-react';
import { ParticleField } from '../components/animations';
import type { AuthUser } from '../App';

const gameFeatures = [
  {
    icon: Compass,
    title: '100+ Màn Chơi',
    desc: 'Khám phá 6 thế giới độc đáo với hàng trăm thử thách',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Swords,
    title: 'Combat Đỉnh Cao',
    desc: 'Hệ thống chiến đấu mượt mà với combo đa dạng',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Target,
    title: 'Boss Battles',
    desc: 'Đối mặt với những boss khổng lồ và thông minh',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Gamepad2,
    title: 'Controller Support',
    desc: 'Hỗ trợ đầy đủ tay cầm và keyboard',
    gradient: 'from-emerald-500 to-teal-500',
  },
];

const quickLinks = [
  {
    path: '/story',
    label: 'Cốt Truyện',
    description: 'Khám phá câu chuyện đầy cảm xúc',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
  },
  {
    path: '/forum',
    label: 'Diễn Đàn',
    description: 'Tham gia cộng đồng',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    path: '/leaderboard',
    label: 'BXH',
    description: 'Cạnh tranh cùng game thủ',
    icon: Trophy,
    color: 'from-yellow-500 to-orange-500',
  },
];

const communityStats = [
  { label: '500K+ Người Chơi', icon: '👥' },
  { label: '4.8★ Đánh Giá', icon: '⭐' },
  { label: '100+ Level', icon: '🎮' },
  { label: 'Cộng đồng Tích cực', icon: '🔥' },
];

export default function Home({ user }: { user: AuthUser }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background with game assets */}
        <div className="absolute inset-0 z-0">
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/assets/game/backgrounds/menu-bg.png)',
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px) scale(1.05)`,
            }}
          />
          <div className="absolute inset-0 bg-dark-950/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/40 to-dark-950" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/80 via-transparent to-dark-950/80" />
        </div>

        {/* Enhanced animated glow orbs */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[600px] h-[600px] -top-40 -left-40 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[500px] h-[500px] top-1/3 -right-20 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.20) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[400px] h-[400px] bottom-20 left-1/3 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
            }}
            animate={{
              x: [0, 20, 0],
              y: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Floating player character - Much Larger */}
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden xl:block z-10">
          <motion.img
            src="/assets/game/player/image.png"
            alt="Player Character"
            className="w-72 xl:w-96 h-auto drop-shadow-2xl"
            style={{ imageRendering: 'pixelated' }}
            animate={{
              y: [-10, 10, -10],
              rotate: [-2, 2, -2],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          {/* Logo Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-block px-6 py-3 border-2 border-dashed border-gray-500/50 rounded-lg text-gray-400 text-sm font-mono hover:border-gray-400 transition-colors cursor-pointer">
              [YOUR LOGO]
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-400 text-sm">Game 2D Platformer</span>
            </div>
          </motion.div>

          {/* Hero Title with Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[0.95]"
          >
            <span className="text-white">Pixel </span>
            <span className="relative">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Adventure
              </span>
              <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-2xl -z-10"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Khám phá thế giới 2D đầy màu sắc, vượt qua 100+ màn chơi thử thách và trở thành huyền thoại!
          </motion.p>

          {/* CTA Buttons - Single Download Only */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <Link to="/download">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-4 rounded-xl bg-white text-dark-950 font-bold text-lg inline-flex items-center gap-3 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <Download className="w-5 h-5" />
                <span>Tải Game Miễn Phí</span>
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg inline-flex items-center gap-3 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              <span>Trailer</span>
            </motion.button>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 mb-8"
          >
            {communityStats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-2xl">{stat.icon}</span>
                <span>{stat.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Register CTA for guests */}
          <AnimatePresence>
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.6 }}
                className="mt-8"
              >
                <div className="inline-block p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-gray-300 text-sm mb-4">
                    Đăng ký ngay để nhận <span className="text-white font-semibold">1000 Xu</span> và <span className="text-white font-semibold">10 Gem</span> miễn phí!
                  </p>
                  <Link to="/auth?mode=register">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      Đăng Ký Ngay
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' })}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center gap-2 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors"
            >
              <span className="text-xs uppercase tracking-wider">Khám phá</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.button>
        </div>
      </motion.section>

      {/* Game Features Section - Enhanced Vibrancy */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 to-dark-900" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
              Tính Năng Nổi Bật
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Trải nghiệm game 2D platformer chất lượng cao với những tính năng độc đáo
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 hover:from-white/15 hover:to-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Game Preview Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium mb-6">
                <Zap className="w-3 h-3" />
                Đồ họa Pixel Art
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Trải Nghiệm{' '}
                <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                  Hoài Nghiệm
                </span>{' '}
                Hiện Đại
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Pixel Adventure kết hợp vẻ đẹp của đồ họa pixel art cổ điển với lối chơi hiện đại.
                Mỗi màn chơi là một tác phẩm nghệ thuật được chăm chút tỉ mỉ.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  '6 thế giới với phong cách riêng biệt',
                  'Nhân vật có thể tùy chỉnh',
                  'Boss Fight hoành tráng',
                  'Cộng đồng thân thiện',
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/download"
                className="inline-flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors group"
              >
                <span>Tải game và trải nghiệm ngay</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Game screenshot with player sprite overlay */}
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/assets/game/backgrounds/windrise-background.png"
                  alt="Game Preview"
                  className="w-full h-auto"
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/70 via-transparent to-transparent" />

                {/* Animated player sprite */}
                <motion.img
                  src="/assets/game/player/image.png"
                  alt="Player"
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 w-20 h-auto"
                  style={{ imageRendering: 'pixelated' }}
                  animate={{
                    x: ['-50px', '50px', '-50px'],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -bottom-4 -right-4 w-32 h-32 rounded-xl bg-gradient-to-br from-primary-500/30 to-secondary-500/30 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Links Section - Updated */}
      <section className="relative py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
              Khám Phá Thêm
            </h2>
            <p className="text-gray-400">Tìm hiểu thêm về game và cộng đồng</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="block group p-6 rounded-2xl bg-gradient-to-br from-white/8 to-white/3 border border-white/10 hover:border-white/20 hover:from-white/12 hover:to-white/5 transition-all duration-300 backdrop-blur-sm"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-white mb-1">{link.label}</h3>
                    <p className="text-gray-400 text-sm">{link.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src="/assets/game/backgrounds/nature.png"
                alt=""
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/95 to-dark-900" />
            </div>

            <div className="relative p-8 sm:p-12 lg:p-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
                  Tham Gia Cộng Đồng
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Hãy tham gia diễn đàn của chúng tôi, chia sẻ trải nghiệm và kết nối với hàng vạn game thủ khác!
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/forum">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-bold text-lg inline-flex items-center gap-3 shadow-xl hover:from-primary-500 hover:to-secondary-500 transition-all"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Xem Diễn Đàn
                    </motion.button>
                  </Link>
                  <Link to="/leaderboard">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-colors"
                    >
                      <Trophy className="w-5 h-5 inline-block mr-2" />
                      Bảng Xếp Hạng
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
