import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Shield, Zap, Heart, Star } from 'lucide-react';

const characters = [
  {
    name: 'The Knight',
    title: 'Chiến Binh Bóng Tối',
    description: 'Nhân vật chính với khả năng chiến đấu vượt trội. Sử dụng thanh kiếm ánh sáng để đánh bại kẻ thù.',
    stats: { attack: 85, defense: 70, speed: 80, magic: 50 },
    skills: ['Slash Combo', 'Dash Strike', 'Light Shield'],
    sprite: '/assets/game/player/image.png',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Armored Warrior',
    title: 'Hiệp Sĩ Giáp Trụ',
    description: 'Phiên bản cường hóa với giáp trù cứng cáp. Phòng thủ xuất sắc nhưng vẫn giữ được tốc độ.',
    stats: { attack: 80, defense: 90, speed: 60, magic: 40 },
    skills: ['Heavy Impact', 'Iron Wall', 'Ground Slam'],
    sprite: '/assets/game/player/image%20copy.png',
    color: 'from-gray-400 to-gray-600',
  },
  {
    name: 'Shadow Mage',
    title: 'Pháp Sư Bóng Tối',
    description: 'Pháp sư bí ẩn nắm giữ sức mạnh của bóng tối. Phép thuật mạnh mẽ với tầm tấn công xa.',
    stats: { attack: 75, defense: 50, speed: 70, magic: 95 },
    skills: ['Shadow Bolt', 'Mana Shield', 'Dark Nova'],
    sprite: '/assets/game/player/image%20copy%20copy.png',
    color: 'from-violet-600 to-purple-800',
  },
];

const enemies = [
  {
    name: 'Kobold Warrior',
    title: 'Chiến Binh Kobold',
    description: 'Kẻ thù phổ biến trong các hang động. Tấn công nhanh nhưng máu thấp.',
    sprite: '/assets/game/enemies/kobold.png',
    danger: 2,
    drops: ['Xu', 'Sword Shard'],
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Flying Demon',
    title: 'Quỷ Bay',
    description: 'Quái vật bay lượn ở sâu trong dungeon. Bắn projectile và di chuyển khó đoán.',
    sprite: '/assets/game/enemies/demon.png',
    danger: 4,
    drops: ['Gem', 'Demon Wing', 'Dark Essence'],
    color: 'from-purple-500 to-red-500',
  },
];

const skillIcons = [Sword, Shield, Zap, Heart];

export default function Characters() {
  const [activeTab, setActiveTab] = useState<'heroes' | 'enemies'>('heroes');
  const [selectedCharacter, setSelectedCharacter] = useState(0);

  return (
    <div className="pt-24 pb-16">
      <section className="py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm mb-6">
              <Star className="w-4 h-4" />
              <span>Nhân Vật</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              Danh Sách Nhân Vật
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Khám phá các nhân vật playable và kẻ thù trong game
            </p>
          </motion.div>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveTab('heroes')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'heroes'
                  ? 'bg-white text-dark-950'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Nhân Vật Chơi Được
            </button>
            <button
              onClick={() => setActiveTab('enemies')}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'enemies'
                  ? 'bg-white text-dark-950'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              Kẻ Thù
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'heroes' ? (
              <motion.div
                key="heroes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Character List */}
                  <div className="lg:col-span-1 space-y-4">
                    {characters.map((char, index) => (
                      <motion.button
                        key={char.name}
                        onClick={() => setSelectedCharacter(index)}
                        className={`w-full p-4 rounded-xl text-left transition-all group ${
                          selectedCharacter === index
                            ? 'bg-white/10 border border-white/20'
                            : 'bg-white/5 border border-white/5 hover:border-white/10'
                        }`}
                        whileHover={{ x: 5 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${char.color} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                            <img
                              src={char.sprite}
                              alt={char.name}
                              className="w-full h-full object-contain"
                              style={{ imageRendering: 'pixelated' }}
                            />
                          </div>
                          <div className="text-left">
                            <h3 className="font-semibold text-white text-sm">{char.name}</h3>
                            <p className="text-gray-500 text-xs">{char.title}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Character Detail */}
                  <motion.div
                    key={selectedCharacter}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="lg:col-span-2 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col"
                  >
                    {/* Large Image Section — 3/4 of the card */}
                    <div className={`relative w-full h-[360px] lg:h-[420px] bg-gradient-to-br ${characters[selectedCharacter].color} flex items-end justify-center overflow-hidden`}>
                      {/* Background glow */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${characters[selectedCharacter].color} opacity-60`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Large sprite */}
                      <motion.img
                        src={characters[selectedCharacter].sprite}
                        alt={characters[selectedCharacter].name}
                        className="relative z-10 h-[92%] w-auto object-contain drop-shadow-2xl"
                        style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.6))' }}
                        animate={{ y: [-6, 6, -6] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                      />

                      {/* Name overlay at bottom of image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
                            {characters[selectedCharacter].name}
                          </h2>
                          <p className="text-white/70 text-sm">{characters[selectedCharacter].title}</p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Stats and Skills Section */}
                    <div className="space-y-5 p-6">
                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed border-b border-white/5 pb-5">
                        {characters[selectedCharacter].description}
                      </p>
                      {/* Stats */}
                      <div>
                        <h4 className="text-xs text-gray-500 mb-4 uppercase tracking-widest font-semibold">Chỉ Số</h4>
                        <div className="space-y-3">
                          {Object.entries(characters[selectedCharacter].stats).map(([key, value], i) => {
                            const Icon = skillIcons[i];
                            return (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="flex items-center gap-3"
                              >
                                <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-gray-400 capitalize font-medium">{key}</span>
                                    <span className="text-white font-semibold">{value}</span>
                                  </div>
                                  <div className="h-2 rounded-full bg-white/10">
                                    <motion.div
                                      className={`h-full rounded-full bg-gradient-to-r ${characters[selectedCharacter].color}`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${value}%` }}
                                      transition={{ duration: 0.6, delay: i * 0.1 }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-xs text-gray-500 mb-3 uppercase tracking-widest font-semibold">Kỹ Năng</h4>
                        <div className="flex flex-wrap gap-2">
                          {characters[selectedCharacter].skills.map((skill, idx) => (
                            <motion.span
                              key={skill}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + idx * 0.05 }}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm border border-white/10 transition-colors"
                            >
                              {skill}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="enemies"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6"
              >
                {enemies.map((enemy, index) => (
                  <motion.div
                    key={enemy.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex flex-col items-center text-center mb-4">
                      <motion.div
                        className={`w-full h-52 rounded-xl bg-gradient-to-br ${enemy.color} flex items-center justify-center mb-4 p-6`}
                        animate={{ rotate: [-3, 3, -3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <img
                          src={enemy.sprite}
                          alt={enemy.name}
                          className="w-full h-auto"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </motion.div>
                      <h3 className="font-semibold text-white text-lg">{enemy.name}</h3>
                      <p className="text-gray-500 text-sm">{enemy.title}</p>
                    </div>

                    <p className="text-gray-400 text-sm text-center mb-4">
                      {enemy.description}
                    </p>

                    {/* Danger level */}
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <span className="text-xs text-gray-500 mr-2">Nguy hiểm:</span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${i < enemy.danger ? 'bg-red-500' : 'bg-white/10'}`}
                        />
                      ))}
                    </div>

                    {/* Drops */}
                    <div>
                      <span className="text-xs text-gray-500 block mb-2">Rơi ra:</span>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {enemy.drops.map((drop) => (
                          <span
                            key={drop}
                            className="px-2 py-1 rounded bg-white/5 text-gray-400 text-xs"
                          >
                            {drop}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
