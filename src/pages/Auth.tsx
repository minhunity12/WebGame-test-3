import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, CheckCircle, Gamepad2, Sparkles, Star, Gift, Shield, Zap } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'login';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    setError('');
    setSuccess('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setUsername('');
  }, [mode]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }
    if (username.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự');
      return;
    }
    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username: username.trim() } },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        await supabase.from('user_profiles').insert({
          id: data.user.id,
          username: username.trim(),
          display_name: username.trim(),
          coins: 1000,
          gems: 10,
        });

        setSuccess('Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.');
        setTimeout(() => navigate('/auth?mode=login'), 3000);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng ký thất bại';
      if (errorMessage.includes('already registered')) {
        setError('Email đã được sử dụng');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateEmail(email)) {
      setError('Email không hợp lệ');
      return;
    }
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Đăng nhập thất bại';
      if (errorMessage.includes('Invalid login credentials')) {
        setError('Email hoặc mật khẩu không đúng');
      } else if (errorMessage.includes('Email not confirmed')) {
        setError('Vui lòng xác nhận email trước khi đăng nhập');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });
      if (resetError) throw resetError;
      setSuccess('Email đặt lại mật khẩu đã được gửi! Kiểm tra hộp thư của bạn.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gửi email thất bại');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Star, text: '1000 Xu miễn phí', color: 'text-yellow-400' },
    { icon: Gift, text: '10 Gem thưởng', color: 'text-purple-400' },
    { icon: Shield, text: 'Lưu tiến độ tự động', color: 'text-blue-400' },
    { icon: Zap, text: 'Tham gia BXH toàn cầu', color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary-500/5 to-transparent rounded-full" />
      </div>

      <div className="w-full max-w-5xl relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Quay về trang chủ</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Branding & Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500 flex items-center justify-center shadow-2xl shadow-primary-500/30">
                  <Gamepad2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="font-display text-3xl font-bold text-white">Pixel Adventure</h1>
                  <p className="text-gray-400">Game 2D Platformer Hàng Đầu</p>
                </div>
              </motion.div>

              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {mode === 'login' ? (
                  <>Chào Mừng <span className="gradient-text">Trở Lại!</span></>
                ) : mode === 'register' ? (
                  <>Bắt Đầu <span className="gradient-text">Hành Trình</span> Của Bạn</>
                ) : (
                  <>Khôi Phục <span className="gradient-text">Mật Khẩu</span></>
                )}
              </h2>
              <p className="text-gray-400 text-lg">
                {mode === 'login'
                  ? 'Đăng nhập để tiếp tục phiêu lưu và giữ tiến độ của bạn.'
                  : mode === 'register'
                  ? 'Tham gia cộng đồng game thủ và nhận quà tặng đặc biệt!'
                  : 'Nhận email đặt lại mật khẩu cho tài khoản của bạn.'}
              </p>
            </div>

            {mode === 'register' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <p className="text-gray-400 text-sm font-medium mb-3">Đăng ký ngay và nhận:</p>
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${benefit.color}`} />
                      </div>
                      <span className="text-white font-medium">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="relative">
              {/* Form Card */}
              <div className="relative bg-dark-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-primary-500/10 overflow-hidden">
                {/* Gradient border decoration */}
                <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-primary-500/20 via-transparent to-secondary-500/20 pointer-events-none" />

                <div className="relative p-8 lg:p-10">
                  {/* Mobile Header */}
                  <div className="lg:hidden text-center mb-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-xl mb-4">
                      <Gamepad2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-white">Pixel Adventure</h1>
                  </div>

                  {/* Tabs */}
                  <div className="relative flex items-center gap-1 p-1 rounded-xl bg-white/5 mb-8">
                    {/* Animated background slider */}
                    <motion.div
                      className="absolute h-[calc(100%-8px)] rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500"
                      initial={false}
                      animate={{
                        x: mode === 'login' ? '4px' : 'calc(100% + 4px)',
                        width: 'calc(50% - 8px)',
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                    {[
                      { id: 'login', label: 'Đăng Nhập' },
                      { id: 'register', label: 'Đăng Ký' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => navigate(`/auth?mode=${tab.id}`)}
                        className={`relative flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-colors z-10 ${
                          mode === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Notifications */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <p className="text-red-300 text-sm">{error}</p>
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <p className="text-green-300 text-sm">{success}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form */}
                  <form
                    onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : (e) => { e.preventDefault(); handleForgotPassword(); }}
                    className="space-y-5"
                  >
                    {mode === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-300">
                          Tên đăng nhập
                        </label>
                        <div className="relative">
                          <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'username' ? 'text-primary-400' : 'text-gray-500'}`} />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Tên hiển thị của bạn"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border transition-all text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-primary-500"
                            style={{ border: focusedField === 'username' ? '2px solid' : '1px solid' }}
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'email' ? 'text-primary-400' : 'text-gray-500'}`} />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField(null)}
                          placeholder="example@email.com"
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border transition-all text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-primary-500"
                          style={{ border: focusedField === 'email' ? '2px solid' : '1px solid' }}
                        />
                      </div>
                    </div>

                    {mode !== 'forgot' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-300">
                            Mật khẩu
                          </label>
                          {mode === 'login' && (
                            <button
                              type="button"
                              onClick={() => navigate('/auth?mode=forgot')}
                              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                            >
                              Quên mật khẩu?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'password' ? 'text-primary-400' : 'text-gray-500'}`} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            placeholder={mode === 'register' ? 'Ít nhất 6 ký tự' : 'Nhập mật khẩu'}
                            className="w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/5 border transition-all text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-primary-500"
                            style={{ border: focusedField === 'password' ? '2px solid' : '1px solid' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {mode === 'register' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <label className="block text-sm font-medium text-gray-300">
                          Xác nhận mật khẩu
                        </label>
                        <div className="relative">
                          <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focusedField === 'confirmPassword' ? 'text-primary-400' : 'text-gray-500'}`} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Nhập lại mật khẩu"
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/5 border transition-all text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-primary-500"
                            style={{ border: focusedField === 'confirmPassword' ? '2px solid' : '1px solid' }}
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.01 }}
                      whileTap={{ scale: loading ? 1 : 0.99 }}
                      className="w-full py-4 rounded-xl font-bold text-white relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-[length:200%_100%] animate-gradient" />
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 via-primary-500 to-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Đang xử lý...</span>
                          </>
                        ) : mode === 'login' ? (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Đăng Nhập</span>
                          </>
                        ) : mode === 'register' ? (
                          <>
                            <Star className="w-5 h-5" />
                            <span>Đăng Ký Ngay</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5" />
                            <span>Gửi Email</span>
                          </>
                        )}
                      </span>
                    </motion.button>
                  </form>

                  {/* Bottom Links */}
                  <div className="mt-8 text-center text-sm text-gray-400">
                    {mode === 'login' && (
                      <p>
                        Chưa có tài khoản?{' '}
                        <Link to="/auth?mode=register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                          Đăng ký ngay
                        </Link>
                      </p>
                    )}
                    {mode === 'register' && (
                      <p>
                        Đã có tài khoản?{' '}
                        <Link to="/auth?mode=login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                          Đăng nhập
                        </Link>
                      </p>
                    )}
                    {mode === 'forgot' && (
                      <p>
                        Nhớ mật khẩu?{' '}
                        <Link to="/auth?mode=login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                          Đăng nhập
                        </Link>
                      </p>
                    )}
                  </div>

                  {mode === 'register' && (
                    <p className="mt-4 text-xs text-gray-500 text-center">
                      Đăng ký tức là bạn đồng ý với{' '}
                      <Link to="#" className="text-gray-400 hover:text-white">Điều khoản dịch vụ</Link>
                      {' '}và{' '}
                      <Link to="#" className="text-gray-400 hover:text-white">Chính sách bảo mật</Link>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
