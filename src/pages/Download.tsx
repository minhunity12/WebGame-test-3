import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Download, FileDown, ExternalLink, Clock } from 'lucide-react';
import { supabase } from '../utils/supabase';

interface GameVersion {
  id: string;
  version: string;
  release_date: string;
  description: string;
  platform: string;
}

export default function Download() {
  const [versions, setVersions] = useState<GameVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('game_versions')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 text-white pt-24">
      {/* Hero Download Section */}
      <section className="relative pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-10 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Game Preview */}
            <motion.div variants={itemVariants} className="flex flex-col items-center">
              <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20">
                <img
                  src="https://images.pexels.com/photos/7915445/pexels-photo-7915445.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Game Preview"
                  className="w-full h-full object-cover"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                    <svg
                      className="w-6 h-6 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <span className="absolute mt-20 text-sm font-semibold text-purple-300">
                    GAME PREVIEW
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Download Text */}
            <motion.div variants={itemVariants} className="flex flex-col justify-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Download<br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Pixel Adventure
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Experience the ultimate pixel-perfect adventure across all your devices. Choose your platform and start playing today.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30">
                    Download Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Platform Download Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Choose Your Platform
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Windows Card - Primary */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, shadow: '0 20px 40px rgba(168, 85, 247, 0.4)' }}
              className="md:col-span-1 lg:row-span-2 group"
            >
              <div className="relative h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  {/* Badge */}
                  <div className="flex gap-3 mb-6">
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white">
                      .EXE
                    </span>
                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xs font-bold text-white">
                      PRIMARY
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Monitor className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold mb-2">Windows</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Full version for PC. Optimal gaming experience.
                  </p>

                  {/* Stats */}
                  <div className="space-y-3 mb-8 py-6 border-t border-b border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">File Size</span>
                      <span className="font-semibold">256 MB</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Version</span>
                      <span className="font-semibold">1.2.5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Updated</span>
                      <span className="font-semibold">June 2024</span>
                    </div>
                  </div>

                  {/* Button */}
                  <motion.a
                    href="/downloads/pixel-adventure.exe"
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30"
                  >
                    <Download className="w-5 h-5" />
                    Download .EXE
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* Android Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative h-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className="inline-block px-2 py-1 bg-green-500/40 rounded-full text-xs font-bold text-green-200">
                      APK
                    </span>
                    <span className="inline-block px-2 py-1 bg-yellow-500/40 rounded-full text-xs font-bold text-yellow-200">
                      DEMO
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">Android</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Demo version. Test the adventure on your mobile device.
                  </p>

                  {/* Info */}
                  <div className="space-y-2 mb-6 py-4 border-t border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Requires Android</span>
                      <span className="font-semibold">7.0+</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">File Size</span>
                      <span className="font-semibold">142 MB</span>
                    </div>
                  </div>

                  {/* Button */}
                  <motion.a
                    href="/downloads/pixel-adventure.apk"
                    download
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg font-semibold hover:from-green-400 hover:to-emerald-400 transition-all text-white"
                  >
                    <FileDown className="w-4 h-4" />
                    Download APK
                  </motion.a>
                </div>
              </div>
            </motion.div>

            {/* iOS Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative h-full bg-gradient-to-br from-slate-500/20 to-gray-500/20 backdrop-blur-md border border-slate-500/30 rounded-2xl p-6 hover:border-slate-500/50 transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative">
                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className="inline-block px-2 py-1 bg-slate-500/40 rounded-full text-xs font-bold text-slate-200">
                      TestFlight
                    </span>
                    <span className="inline-block px-2 py-1 bg-yellow-500/40 rounded-full text-xs font-bold text-yellow-200">
                      DEMO
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-300 to-slate-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Smartphone className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">iOS</h3>
                  <p className="text-gray-300 text-sm mb-6">
                    Beta via TestFlight. Be the first to try new features.
                  </p>

                  {/* Info */}
                  <div className="space-y-2 mb-6 py-4 border-t border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Requires iOS</span>
                      <span className="font-semibold">13.0+</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Status</span>
                      <span className="font-semibold text-yellow-300">Beta</span>
                    </div>
                  </div>

                  {/* Button */}
                  <motion.a
                    href="https://testflight.apple.com/join/demo"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-slate-500 to-gray-600 rounded-lg font-semibold hover:from-slate-400 hover:to-gray-500 transition-all text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Join TestFlight
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Why Choose Pixel Adventure?
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: '🎮', title: '100+ Levels', desc: 'Endless challenges await' },
              { icon: '👥', title: 'Multiplayer', desc: 'Play with friends worldwide' },
              { icon: '🛡️', title: 'Safe & Secure', desc: 'Your data is protected' },
              { icon: '💰', title: 'Completely Free', desc: 'No hidden costs or ads' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* System Requirements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            System Requirements
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Minimum',
                specs: [
                  'OS: Windows 10 64-bit',
                  'Processor: Intel Core i5',
                  'Memory: 8 GB RAM',
                  'Graphics: NVIDIA GTX 960',
                  'Storage: 512 MB available',
                ],
              },
              {
                title: 'Recommended',
                specs: [
                  'OS: Windows 11 64-bit',
                  'Processor: Intel Core i7',
                  'Memory: 16 GB RAM',
                  'Graphics: NVIDIA RTX 3070',
                  'Storage: 512 MB SSD',
                ],
              },
            ].map((req, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6"
              >
                <h3 className="text-xl font-bold mb-4">{req.title}</h3>
                <ul className="space-y-2">
                  {req.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <span className="w-2 h-2 bg-purple-500 rounded-full" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Version History Sidebar */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            className="text-3xl font-bold mb-8 flex items-center gap-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Clock className="w-8 h-8" />
            Version History
          </motion.h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading version history...</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {versions.length > 0 ? (
                versions.map((version) => (
                  <motion.div
                    key={version.id}
                    variants={itemVariants}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-bold">v{version.version}</h3>
                      <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
                        {version.platform}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{version.description}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(version.release_date).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400">No version history available yet.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
