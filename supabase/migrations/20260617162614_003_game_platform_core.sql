-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  coins INTEGER DEFAULT 0,
  gems INTEGER DEFAULT 0,
  total_play_time INTEGER DEFAULT 0,
  highest_level INTEGER DEFAULT 1,
  achievements JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game scores (Leaderboard)
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  level INTEGER NOT NULL,
  time_played INTEGER NOT NULL,
  world VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_game_scores_score ON game_scores(score DESC);
CREATE INDEX IF NOT EXISTS idx_game_scores_user ON game_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_level ON game_scores(level DESC);

-- Game purchases
CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  package_id VARCHAR(50) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(10) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100) UNIQUE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Top-up packages
CREATE TABLE IF NOT EXISTS topup_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  coins INTEGER NOT NULL,
  bonus_coins INTEGER DEFAULT 0,
  price INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'VND',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game versions
CREATE TABLE IF NOT EXISTS game_versions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  version VARCHAR(20) NOT NULL UNIQUE,
  download_url VARCHAR(500) NOT NULL,
  file_size VARCHAR(20),
  changelog TEXT,
  is_latest BOOLEAN DEFAULT FALSE,
  is_mandatory BOOLEAN DEFAULT FALSE,
  min_system_requirements JSONB,
  release_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User game progress
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  world_id INTEGER NOT NULL,
  level_id INTEGER NOT NULL,
  stars INTEGER DEFAULT 0,
  best_time INTEGER,
  best_score INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, world_id, level_id)
);

-- Achievements
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  reward_coins INTEGER DEFAULT 0,
  reward_gems INTEGER DEFAULT 0,
  requirement_type VARCHAR(50) NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE topup_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "profiles_select_own" ON user_profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON user_profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for game_scores
CREATE POLICY "scores_select_all" ON game_scores FOR SELECT USING (true);
CREATE POLICY "scores_insert_own" ON game_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for purchases
CREATE POLICY "purchases_select_own" ON purchases FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "purchases_insert_own" ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for topup_packages (public read)
CREATE POLICY "packages_select_all" ON topup_packages FOR SELECT USING (true);

-- RLS Policies for game_versions (public read)
CREATE POLICY "versions_select_all" ON game_versions FOR SELECT USING (true);

-- RLS Policies for user_progress
CREATE POLICY "progress_select_own" ON user_progress FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "progress_insert_own" ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress_update_own" ON user_progress FOR UPDATE
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements (public read)
CREATE POLICY "achievements_select_all" ON achievements FOR SELECT USING (true);

-- RLS Policies for user_achievements
CREATE POLICY "user_achievements_select_own" ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "user_achievements_insert_own" ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Insert default top-up packages
INSERT INTO topup_packages (name, description, coins, bonus_coins, price, currency, is_popular, display_order) VALUES
('Gói Người Mới', 'Phù hợp cho người mới bắt đầu', 1000, 0, 10000, 'VND', false, 1),
('Gói Phổ Biến', 'Nhiều người chọn nhất', 5000, 500, 50000, 'VND', true, 2),
('Gói Tiết Kiệm', 'Tiết kiệm 20%', 11000, 0, 100000, 'VND', false, 3),
('Gói VIP', 'Dành cho game thủ chuyên nghiệp', 25000, 3000, 200000, 'VND', false, 4),
('Gói Siêu VIP', 'Quyền lợi tối đa', 70000, 10000, 500000, 'VND', false, 5),
('Gói Hoàng Tộc', 'Dành cho top player', 150000, 30000, 1000000, 'VND', false, 6)
ON CONFLICT DO NOTHING;

-- Insert default achievements
INSERT INTO achievements (name, description, icon, reward_coins, reward_gems, requirement_type, requirement_value) VALUES
('Nhập Môn', 'Hoàn thành màn chơi đầu tiên', 'star', 100, 0, 'levels_completed', 1),
('Tập Sự', 'Hoàn thành 10 màn chơi', 'trophy', 500, 10, 'levels_completed', 10),
('Chuyên Nghiệp', 'Hoàn thành 50 màn chơi', 'medal', 2000, 50, 'levels_completed', 50),
('Huyền Thoại', 'Hoàn thành tất cả màn chơi', 'crown', 10000, 200, 'levels_completed', 100),
('Speedrunner', 'Hoàn thành màn trong dưới 30 giây', 'zap', 500, 20, 'fast_time', 30),
('Nhà Mô Phỏng', 'Thu thập 1000 xu', 'coin', 1000, 0, 'total_coins', 1000)
ON CONFLICT DO NOTHING;

-- Insert default game version
INSERT INTO game_versions (version, download_url, file_size, changelog, is_latest, release_date) VALUES
('1.0.0', '/downloads/game_v1.0.0.zip', '150 MB', 'Phiên bản đầu tiên ra mắt!', true, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Insert sample leaderboard data
INSERT INTO game_scores (user_id, score, level, time_played, world) 
SELECT id, (random() * 10000 + 5000)::int, (random() * 20 + 1)::int, (random() * 300 + 60)::int, 'World ' || (random() * 5 + 1)::int
FROM user_profiles LIMIT 10
ON CONFLICT DO NOTHING;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();