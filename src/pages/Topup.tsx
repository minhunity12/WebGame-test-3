import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Gift, Star, CheckCircle, AlertCircle, Loader2,
  Coins, Gem, ChevronRight, ChevronLeft, Copy, Check, Clock,
  RefreshCw, X, Smartphone, Building2, TicketIcon,
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import type { AuthUser } from '../App';
import type { Session } from '@supabase/supabase-js';

interface TopupPackage {
  id: string;
  name: string;
  description: string | null;
  coins: number;
  bonus_coins: number;
  gems: number;
  bonus_gems: number;
  price: number;
  currency: string;
  is_popular: boolean;
  display_order: number;
  type: 'coins' | 'gems';
}

interface UserProfile {
  coins: number;
  gems: number;
}

type PaymentMethod = 'momo' | 'zalopay' | 'banking' | 'card';
type Step = 'packages' | 'method' | 'payment' | 'verifying' | 'success' | 'failed';
type CurrencyTab = 'coins' | 'gems';

const PAYMENT_METHODS = [
  {
    id: 'momo' as PaymentMethod,
    label: 'Ví MoMo',
    color: 'from-pink-500 to-rose-500',
    border: 'border-pink-500/40',
    bg: 'bg-pink-500/10',
    icon: Smartphone,
    accentColor: 'text-pink-400',
    account: '0909 090 909',
    name: 'Pixel Adventure',
  },
  {
    id: 'zalopay' as PaymentMethod,
    label: 'ZaloPay',
    color: 'from-blue-500 to-sky-500',
    border: 'border-blue-500/40',
    bg: 'bg-blue-500/10',
    icon: Smartphone,
    accentColor: 'text-blue-400',
    account: '0908 080 808',
    name: 'Pixel Adventure',
  },
  {
    id: 'banking' as PaymentMethod,
    label: 'Banking',
    color: 'from-emerald-500 to-green-500',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    icon: Building2,
    accentColor: 'text-emerald-400',
    account: '0123 4567 89',
    name: 'CTY PIXEL ADVENTURE',
    bank: 'MB Bank',
    bankId: 'MB',
  },
  {
    id: 'card' as PaymentMethod,
    label: 'Thẻ Cào',
    color: 'from-orange-500 to-amber-500',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
    icon: TicketIcon,
    accentColor: 'text-orange-400',
  },
];

const VERIFY_DURATION = 20; // seconds

export default function Topup({ user }: { user: AuthUser; session: Session | null }) {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<TopupPackage[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('packages');
  const [selectedPackage, setSelectedPackage] = useState<TopupPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo');
  const [currencyTab, setCurrencyTab] = useState<CurrencyTab>('coins');
  const [transactionId, setTransactionId] = useState('');
  const [purchaseId, setPurchaseId] = useState('');
  const [countdown, setCountdown] = useState(VERIFY_DURATION);
  const [copied, setCopied] = useState<string | null>(null);
  const [cardInfo, setCardInfo] = useState({ network: 'viettel', serial: '', pin: '' });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Refs to avoid stale closures in interval
  const purchaseIdRef = useRef('');
  const selectedPackageRef = useRef<TopupPackage | null>(null);
  const profileRef = useRef<UserProfile | null>(null);

  useEffect(() => { purchaseIdRef.current = purchaseId; }, [purchaseId]);
  useEffect(() => { selectedPackageRef.current = selectedPackage; }, [selectedPackage]);
  useEffect(() => { profileRef.current = profile; }, [profile]);

  useEffect(() => {
    if (!user) { navigate('/auth?mode=login'); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    const [pkgRes, profRes] = await Promise.all([
      supabase.from('topup_packages').select('*').eq('is_active', true).order('display_order'),
      supabase.from('user_profiles').select('coins, gems').eq('id', user!.id).single(),
    ]);
    if (pkgRes.data) setPackages(pkgRes.data as TopupPackage[]);
    if (profRes.data) setProfile(profRes.data as UserProfile);
    setLoading(false);
  };

  const completePayment = useCallback(async () => {
    const pid = purchaseIdRef.current;
    const pkg = selectedPackageRef.current;
    const prof = profileRef.current;
    if (!pid || !user || !pkg) return;
    const isGems = pkg.type === 'gems';
    const totalCoins = pkg.coins + pkg.bonus_coins;
    const totalGems = (pkg.gems || 0) + (pkg.bonus_gems || 0);

    const { error: pErr } = await supabase
      .from('purchases')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', pid);

    const updatePayload = isGems
      ? { gems: (prof?.gems || 0) + totalGems }
      : { coins: (prof?.coins || 0) + totalCoins };

    const { error: uErr } = await supabase
      .from('user_profiles')
      .update(updatePayload)
      .eq('id', user.id);

    if (pErr || uErr) {
      setStep('failed');
    } else {
      setStep('success');
      fetchData();
    }
  }, [user]);

  // Start countdown when entering verifying step
  useEffect(() => {
    if (step !== 'verifying') return;
    setCountdown(VERIFY_DURATION);
    intervalRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(intervalRef.current!);
          completePayment();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [step, completePayment]);

  const handleConfirmPayment = async () => {
    if (!selectedPackage || !user || !transactionId) return;
    const txnId = transactionId;

    const { data, error } = await supabase.from('purchases').insert({
      user_id: user.id,
      package_id: selectedPackage.id,
      amount: selectedPackage.price,
      currency: 'VND',
      payment_method: paymentMethod,
      transaction_id: txnId,
      status: 'pending',
    }).select('id').single();

    if (error || !data) { alert('Không thể tạo đơn hàng.'); return; }
    setPurchaseId(data.id);
    setStep('verifying');
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatPrice = (p: number) => new Intl.NumberFormat('vi-VN').format(p) + ' đ';
  const formatCoins = (c: number) => new Intl.NumberFormat('vi-VN').format(c);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod)!;
  const transferNote = `${transactionId}`;
  const isGemsPackage = selectedPackage?.type === 'gems';
  const totalCoins = selectedPackage ? selectedPackage.coins + selectedPackage.bonus_coins : 0;
  const totalGems = selectedPackage ? (selectedPackage.gems || 0) + (selectedPackage.bonus_gems || 0) : 0;
  const totalReward = isGemsPackage ? totalGems : totalCoins;
  const rewardLabel = isGemsPackage ? 'gem' : 'xu';

  // QR code URLs
  const getQrUrl = () => {
    if (!selectedPackage) return '';
    const amount = selectedPackage.price;
    const note = encodeURIComponent(transferNote);
    if (paymentMethod === 'banking') {
      return `https://img.vietqr.io/image/MB-0123456789-compact2.jpg?amount=${amount}&addInfo=${note}&accountName=PIXEL+ADVENTURE`;
    }
    if (paymentMethod === 'momo') {
      const data = encodeURIComponent(`2|99|0909090909|Pixel Adventure|${amount}|0|0|${transferNote}|thanh toan nap xu`);
      return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}&bgcolor=1A1A2E&color=FF2D9D&margin=15`;
    }
    if (paymentMethod === 'zalopay') {
      const data = encodeURIComponent(`zalopay://payment?phone=0908080808&amount=${amount}&note=${transferNote}`);
      return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${data}&bgcolor=1A1A2E&color=0068FF&margin=15`;
    }
    return '';
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm mb-4">
            <CreditCard className="w-4 h-4" />
            Nạp Xu
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
            Nạp <span className="text-yellow-400">Xu</span> & <span className="text-purple-400">Gem</span>
          </h1>

          {/* Balance */}
          {profile && (
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">{formatCoins(profile.coins)}</span>
                <span className="text-gray-500">xu</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10">
                <Gem className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 font-semibold">{profile.gems}</span>
                <span className="text-gray-500">gem</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Step Progress */}
        {!['success', 'failed'].includes(step) && (
          <div className="flex items-center justify-center gap-3 mb-10">
            {[
              { key: 'packages', label: 'Chọn gói' },
              { key: 'method', label: 'Thanh toán' },
              { key: ['payment', 'verifying'], label: 'Xác nhận' },
            ].map((s, i) => {
              const keys = Array.isArray(s.key) ? s.key : [s.key];
              const isActive = keys.includes(step);
              const isDone =
                (step === 'method' && i === 0) ||
                (['payment', 'verifying'].includes(step) && i <= 1);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive ? 'bg-white text-dark-950' :
                    isDone ? 'bg-white/10 text-white' :
                    'bg-white/5 text-gray-500'
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone ? 'bg-emerald-500 text-white' : isActive ? 'bg-dark-950 text-white' : 'bg-white/10'
                    }`}>
                      {isDone ? <Check className="w-3 h-3" /> : i + 1}
                    </span>
                    {s.label}
                  </div>
                  {i < 2 && <ChevronRight className="w-4 h-4 text-gray-600" />}
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Choose package */}
          {step === 'packages' && (
            <motion.div key="packages" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {/* Currency Tab Switcher */}
              <div className="relative flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 mb-8 max-w-xs">
                <motion.div
                  className="absolute h-[calc(100%-8px)] rounded-xl"
                  initial={false}
                  animate={{
                    x: currencyTab === 'coins' ? '4px' : 'calc(100% + 4px)',
                    width: 'calc(50% - 8px)',
                    background: currencyTab === 'coins'
                      ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                      : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
                {[
                  { id: 'coins' as CurrencyTab, label: 'Nạp Xu', icon: Coins },
                  { id: 'gems' as CurrencyTab, label: 'Nạp Gem', icon: Gem },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setCurrencyTab(tab.id); setSelectedPackage(null); }}
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                        currencyTab === tab.id ? 'text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {packages.filter((p) => p.type === currencyTab).map((pkg, index) => (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`relative rounded-2xl p-6 cursor-pointer transition-all border ${
                      selectedPackage?.id === pkg.id
                        ? 'border-white/30 bg-white/10 shadow-lg shadow-white/5'
                        : 'border-white/5 bg-white/5 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {pkg.is_popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold flex items-center gap-1">
                          <Star className="w-3 h-3" /> Phổ biến
                        </span>
                      </div>
                    )}
                    <div className="text-center">
                      <div className={`w-14 h-14 mx-auto rounded-xl mb-4 flex items-center justify-center bg-gradient-to-br ${
                        pkg.type === 'gems'
                          ? index < 2 ? 'from-violet-500 to-purple-500' : index < 4 ? 'from-purple-500 to-pink-500' : 'from-fuchsia-500 to-violet-500'
                          : index < 2 ? 'from-blue-500 to-cyan-500' : index < 4 ? 'from-yellow-500 to-orange-500' : 'from-amber-500 to-yellow-500'
                      }`}>
                        {pkg.type === 'gems' ? <Gem className="w-7 h-7 text-white" /> : <Coins className="w-7 h-7 text-white" />}
                      </div>
                      <h3 className="font-bold text-white mb-1">{pkg.name}</h3>
                      {pkg.description && <p className="text-xs text-gray-500 mb-3">{pkg.description}</p>}
                      {pkg.type === 'gems' ? (
                        <>
                          <p className="text-2xl font-bold text-purple-400 mb-1">{pkg.gems} <span className="text-sm font-normal text-gray-500">gem</span></p>
                          {(pkg.bonus_gems || 0) > 0 && (
                            <p className="text-xs text-emerald-400 mb-3 flex items-center justify-center gap-1">
                              <Gift className="w-3 h-3" /> +{pkg.bonus_gems} bonus
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-yellow-400 mb-1">{formatCoins(pkg.coins)} <span className="text-sm font-normal text-gray-500">xu</span></p>
                          {pkg.bonus_coins > 0 && (
                            <p className="text-xs text-emerald-400 mb-3 flex items-center justify-center gap-1">
                              <Gift className="w-3 h-3" /> +{formatCoins(pkg.bonus_coins)} bonus
                            </p>
                          )}
                        </>
                      )}
                      <p className="text-lg font-bold text-white">{formatPrice(pkg.price)}</p>
                    </div>
                    {selectedPackage?.id === pkg.id && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => selectedPackage && setStep('method')}
                  disabled={!selectedPackage}
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-dark-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Tiếp theo <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose payment method + confirm */}
          {step === 'method' && selectedPackage && (
            <motion.div key="method" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {PAYMENT_METHODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-5 rounded-2xl text-left transition-all border ${
                        paymentMethod === m.id
                          ? `${m.border} ${m.bg}`
                          : 'border-white/5 bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold ${paymentMethod === m.id ? 'text-white' : 'text-gray-300'}`}>{m.label}</p>
                          <p className="text-xs text-gray-500">
                            {m.id === 'card' ? 'Viettel, Mobifone, Vinaphone' : m.id === 'banking' ? 'Chuyển khoản ngân hàng' : 'Quét QR thanh toán'}
                          </p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                          paymentMethod === m.id ? 'border-white bg-white' : 'border-gray-600'
                        }`}>
                          {paymentMethod === m.id && <div className="w-2 h-2 rounded-full bg-dark-950" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Order summary */}
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10 mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Tóm tắt đơn hàng</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gói</span>
                    <span className="text-white font-medium">{selectedPackage.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{isGemsPackage ? 'Gem' : 'Xu'} nhận được</span>
                    <span className={`font-semibold ${isGemsPackage ? 'text-purple-400' : 'text-yellow-400'}`}>{formatCoins(totalReward)} {rewardLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Phương thức</span>
                    <span className="text-white">{selectedMethod.label}</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between text-base">
                    <span className="text-white font-medium">Tổng tiền</span>
                    <span className="text-white font-bold">{formatPrice(selectedPackage.price)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('packages')}
                  className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
                <button
                  onClick={() => {
                    const txnId = `PA${Date.now().toString().slice(-8)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
                    setTransactionId(txnId);
                    setStep('payment');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-dark-950 font-bold hover:bg-gray-100 transition-colors"
                >
                  Xem QR thanh toán <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payment screen */}
          {step === 'payment' && selectedPackage && (
            <motion.div key="payment" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              {paymentMethod !== 'card' ? (
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* QR Code */}
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                    <p className="text-gray-400 text-sm mb-4">Quét mã QR để thanh toán</p>
                    <div className="relative">
                      <div className={`absolute -inset-3 rounded-2xl blur-xl opacity-30 bg-gradient-to-br ${selectedMethod.color}`} />
                      <div className="relative bg-white rounded-xl p-3 inline-block">
                        <img
                          src={getQrUrl()}
                          alt="QR Code"
                          className="w-48 h-48 sm:w-56 sm:h-56"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(selectedPackage.id)}&margin=15`;
                          }}
                        />
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-4 text-center">Mã QR có hiệu lực trong 15 phút</p>
                  </div>

                  {/* Payment details */}
                  <div className="space-y-4">
                    <div className={`p-5 rounded-2xl border ${selectedMethod.border} ${selectedMethod.bg}`}>
                      <p className="text-xs uppercase tracking-wider mb-3" style={{ color: 'inherit' }}>
                        <span className={selectedMethod.accentColor}>Thông tin chuyển khoản</span>
                      </p>

                      {paymentMethod === 'banking' && (
                        <>
                          <InfoRow label="Ngân hàng" value="MB Bank" onCopy={() => handleCopy('MB Bank', 'bank')} copyKey="bank" copied={copied} />
                          <InfoRow label="Số tài khoản" value="0123456789" onCopy={() => handleCopy('0123456789', 'account')} copyKey="account" copied={copied} />
                          <InfoRow label="Chủ tài khoản" value="CTY PIXEL ADVENTURE" />
                        </>
                      )}
                      {(paymentMethod === 'momo' || paymentMethod === 'zalopay') && (
                        <InfoRow
                          label="Số điện thoại"
                          value={selectedMethod.account!}
                          onCopy={() => handleCopy(selectedMethod.account!.replace(/\s/g, ''), 'phone')}
                          copyKey="phone"
                          copied={copied}
                        />
                      )}
                      <InfoRow
                        label="Số tiền"
                        value={formatPrice(selectedPackage.price)}
                        highlight
                        onCopy={() => handleCopy(String(selectedPackage.price), 'amount')}
                        copyKey="amount"
                        copied={copied}
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-xs text-amber-400 font-medium mb-2">Nội dung chuyển khoản (bắt buộc)</p>
                      <div className="flex items-center justify-between gap-3">
                        <code className="text-white font-mono text-base font-bold tracking-wider bg-white/5 px-3 py-2 rounded-lg">
                          {transactionId || 'PA' + Date.now().toString().slice(-8)}
                        </code>
                        <button
                          onClick={() => handleCopy(transactionId || '', 'note')}
                          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap"
                        >
                          {copied === 'note' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copied === 'note' ? 'Đã chép' : 'Chép'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Thiếu nội dung giao dịch sẽ không được xác nhận tự động</p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Số {rewardLabel} nhận được</span>
                        <span className={`font-bold ${isGemsPackage ? 'text-purple-400' : 'text-yellow-400'}`}>{formatCoins(totalReward)} {rewardLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card input */
                <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="font-semibold text-white mb-6">Nhập thông tin thẻ cào</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Nhà mạng</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['viettel', 'mobifone', 'vinaphone'].map((n) => (
                          <button
                            key={n}
                            onClick={() => setCardInfo((c) => ({ ...c, network: n }))}
                            className={`py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                              cardInfo.network === n
                                ? 'bg-white text-dark-950'
                                : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                          >
                            {n.charAt(0).toUpperCase() + n.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Sê-ri thẻ</label>
                      <input
                        value={cardInfo.serial}
                        onChange={(e) => setCardInfo((c) => ({ ...c, serial: e.target.value }))}
                        placeholder="Nhập sê-ri thẻ"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Mã thẻ (PIN)</label>
                      <input
                        value={cardInfo.pin}
                        onChange={(e) => setCardInfo((c) => ({ ...c, pin: e.target.value }))}
                        placeholder="Nhập mã thẻ"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep('method')}
                  className="flex items-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Quay lại
                </button>
                <button
                  onClick={handleConfirmPayment}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold hover:opacity-90 transition-opacity"
                >
                  {paymentMethod === 'card' ? 'Nạp Thẻ' : 'Tôi đã chuyển khoản xong'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Verifying */}
          {step === 'verifying' && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-sm mx-auto text-center py-12"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                  <motion.circle
                    cx="60" cy="60" r="54"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 54 }}
                    transition={{ duration: VERIFY_DURATION, ease: 'linear' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF2D9D" />
                      <stop offset="100%" stopColor="#1CF5B3" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{countdown}</span>
                  <span className="text-xs text-gray-500">giây</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-3">
                <RefreshCw className="w-5 h-5 text-primary-400 animate-spin" />
                <h2 className="text-xl font-bold text-white">Đang xác minh thanh toán</h2>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Hệ thống đang kiểm tra giao dịch của bạn. Vui lòng chờ trong giây lát...
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã giao dịch</span>
                  <span className="text-white font-mono">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số tiền</span>
                  <span className="text-white">{selectedPackage ? formatPrice(selectedPackage.price) : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Đang xử lý
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-sm mx-auto text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
              >
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              </motion.div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">Thành Công!</h2>
              <p className="text-gray-400 mb-6">
                Đã cộng <span className={`font-bold ${isGemsPackage ? 'text-purple-400' : 'text-yellow-400'}`}>{formatCoins(totalReward)} {rewardLabel}</span> vào tài khoản của bạn
              </p>

              {/* Confetti-like floating icons */}
              <div className="relative h-12 mb-6">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute ${isGemsPackage ? 'text-purple-400' : 'text-yellow-400'}`}
                    initial={{ y: 0, x: `${15 + i * 14}%`, opacity: 1 }}
                    animate={{ y: -60, opacity: 0 }}
                    transition={{ delay: i * 0.1, duration: 1 }}
                  >
                    {isGemsPackage ? <Gem className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
                  </motion.div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-left space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mã giao dịch</span>
                  <span className="text-white font-mono text-xs">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{isGemsPackage ? 'Gem' : 'Xu'} đã nhận</span>
                  <span className={`font-bold ${isGemsPackage ? 'text-purple-400' : 'text-yellow-400'}`}>{formatCoins(totalReward)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Trạng thái</span>
                  <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Hoàn thành</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep('packages');
                  setSelectedPackage(null);
                  setTransactionId('');
                  setPurchaseId('');
                }}
                className="w-full py-4 rounded-xl bg-white text-dark-950 font-bold hover:bg-gray-100 transition-colors"
              >
                Nạp tiếp
              </button>
            </motion.div>
          )}

          {/* STEP 5b: Failed */}
          {step === 'failed' && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-sm mx-auto text-center py-12"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-6">
                <X className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Giao Dịch Thất Bại</h2>
              <p className="text-gray-400 mb-6">
                Không tìm thấy giao dịch phù hợp. Vui lòng kiểm tra lại nội dung chuyển khoản.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('payment')}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => { setStep('packages'); setSelectedPackage(null); }}
                  className="flex-1 py-3 rounded-xl bg-white text-dark-950 font-bold"
                >
                  Về đầu
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InfoRow({
  label, value, highlight, onCopy, copyKey, copied,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  onCopy?: () => void;
  copyKey?: string;
  copied?: string | null;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-medium text-sm ${highlight ? 'text-white font-bold text-base' : 'text-gray-300'}`}>{value}</span>
        {onCopy && (
          <button onClick={onCopy} className="text-gray-500 hover:text-white transition-colors">
            {copied === copyKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}
