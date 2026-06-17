import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Youtube,
  MessageCircle,
  Mail,
  ExternalLink,
  Facebook,
  Heart,
  Send,
  MapPin,
  Phone,
} from 'lucide-react';

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'Youtube' },
  { icon: MessageCircle, href: '#', label: 'Discord' },
];

const footerLinks: Record<string, Array<{ label: string; path?: string; href?: string }>> = {
  'Game': [
    { label: 'Trang Chủ', path: '/' },
    { label: 'Cốt Truyện', path: '/story' },
    { label: 'Nhân Vật', path: '/characters' },
    { label: 'BXH', path: '/leaderboard' },
    { label: 'Tải Game', path: '/download' },
  ],
  'Tài Khoản': [
    { label: 'Đăng Ký', path: '/auth?mode=register' },
    { label: 'Đăng Nhập', path: '/auth?mode=login' },
    { label: 'Nạp Thẻ', path: '/topup' },
    { label: 'Hồ Sơ', path: '/profile' },
  ],
  'Hỗ Trợ': [
    { label: 'Liên Hệ', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Báo Lỗi', href: '#' },
  ],
  'Pháp Lý': [
    { label: 'Điều Khoản', href: '#' },
    { label: 'Bảo Mật', href: '#' },
    { label: 'Cookie', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-dark-950">
      {/* Top gradient border */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            {/* Brand section - 4 columns */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary-500/50 transition-colors">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="font-display text-xl font-bold text-white block">Pixel Adventure</span>
                  <span className="text-xs text-gray-500">2D Platformer Game</span>
                </div>
              </Link>

              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                Trò chơi 2D Platformer miễn phí với đồ họa pixel art độc đáo. Khám phá hơn 100 màn chơi và trở thành huyền thoại!
              </p>

              {/* Social links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Links section - 8 columns */}
            <div className="col-span-12 lg:col-span-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                      {category}
                    </h3>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link.label}>
                          {'path' in link ? (
                            <Link
                              to={link.path}
                              className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1"
                            >
                              {link.label}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-1 group"
                            >
                              {link.label}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact info bar */}
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <a href="mailto:support@pixeladventure.game" className="flex items-center gap-2 hover:text-gray-300 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>support@pixeladventure.game</span>
                </a>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Việt Nam</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Link to="/download">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 rounded-lg bg-white text-dark-950 text-sm font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Tải Game
                  </motion.button>
                </Link>
                <Link to="/auth?mode=register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Đăng Ký
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p className="flex items-center gap-1">
              © {new Date().getFullYear()} Pixel Adventure. Created with <Heart className="w-3 h-3 text-red-400" /> in Vietnam.
            </p>
            <p className="text-xs">
              All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
