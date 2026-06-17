-- News Table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT,
  image VARCHAR(500),
  category VARCHAR(50) NOT NULL CHECK (category IN ('news', 'update', 'event', 'community', 'dev')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time VARCHAR(20),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  src VARCHAR(500) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
  category VARCHAR(50) NOT NULL,
  video_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Features Table
CREATE TABLE IF NOT EXISTS features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  color VARCHAR(100),
  image VARCHAR(500),
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Featured Players Table
CREATE TABLE IF NOT EXISTS featured_players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  avatar VARCHAR(500),
  title VARCHAR(100),
  achievement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read for most content)
CREATE POLICY "news_select_policy" ON news FOR SELECT USING (true);
CREATE POLICY "news_insert_policy" ON news FOR INSERT WITH CHECK (true);
CREATE POLICY "news_update_policy" ON news FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "gallery_select_policy" ON gallery FOR SELECT USING (true);
CREATE POLICY "gallery_insert_policy" ON gallery FOR INSERT WITH CHECK (true);

CREATE POLICY "features_select_policy" ON features FOR SELECT USING (true);
CREATE POLICY "features_insert_policy" ON features FOR INSERT WITH CHECK (true);

CREATE POLICY "featured_players_select_policy" ON featured_players FOR SELECT USING (true);
CREATE POLICY "featured_players_insert_policy" ON featured_players FOR INSERT WITH CHECK (true);

CREATE POLICY "newsletter_insert_policy" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "contact_messages_insert_policy" ON contact_messages FOR INSERT WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_date ON news(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_type ON gallery(type);
CREATE INDEX IF NOT EXISTS idx_features_order ON features("order");

-- Insert sample news data
INSERT INTO news (title, excerpt, content, image, category, date, read_time, featured) VALUES
('Eternal Realms 2.0 Update Arrives This Summer', 'The biggest update yet brings new regions, bosses, and a complete combat overhaul.', 'Full content here...', 'https://images.pexels.com/photos/16709311/pexels-photo-16709311.jpeg?auto=compress&cs=tinysrgb&w=800', 'update', '2024-03-15', '5 min', true),
('Community Spotlight: Player-Created Dungeon Challenges', 'Our creative community never ceases to amaze.', 'Full content here...', 'https://images.pexels.com/photos/7915445/pexels-photo-7915445.jpeg?auto=compress&cs=tinysrgb&w=800', 'community', '2024-03-12', '3 min', false),
('New Character Class: The Shadowblade Revealed', 'Sneak peek at our upcoming assassin class.', 'Full content here...', 'https://images.pexels.com/photos/7915396/pexels-photo-7915396.jpeg?auto=compress&cs=tinysrgb&w=800', 'news', '2024-03-10', '4 min', false),
('Seasonal Event: Spring Festival Now Live', 'Celebrate the season with exclusive quests!', 'Full content here...', 'https://images.pexels.com/photos/12948893/pexels-photo-12948893.jpeg?auto=compress&cs=tinysrgb&w=800', 'event', '2024-03-08', '2 min', false),
('Developer Diary: Creating the Ancient Ruins', 'Go behind the scenes with our level design team.', 'Full content here...', 'https://images.pexels.com/photos/992434/pexels-photo-992434.jpeg?auto=compress&cs=tinysrgb&w=800', 'dev', '2024-03-05', '6 min', false)
ON CONFLICT DO NOTHING;

-- Insert sample gallery data
INSERT INTO gallery (title, src, type, category) VALUES
('Battle Arena', 'https://images.pexels.com/photos/7915445/pexels-photo-7915445.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'gameplay'),
('Character Customization', 'https://images.pexels.com/photos/7915396/pexels-photo-7915396.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'character'),
('Dragon Boss Fight', 'https://images.pexels.com/photos/16709311/pexels-photo-16709311.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'boss'),
('Ancient Ruins', 'https://images.pexels.com/photos/12948893/pexels-photo-12948893.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'environment'),
('Forest Path', 'https://images.pexels.com/photos/16713263/pexels-photo-16713263.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'environment'),
('Treasure Chamber', 'https://images.pexels.com/photos/992434/pexels-photo-992434.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'loot'),
('Team Battle', 'https://images.pexels.com/photos/317187/pexels-photo-317187.jpeg?auto=compress&cs=tinysrgb&w=800', 'image', 'multiplayer')
ON CONFLICT DO NOTHING;

-- Insert sample features data
INSERT INTO features (title, description, icon, color, image, "order") VALUES
('Epic Combat System', 'Master a fluid combat system with combo attacks, parries, and special abilities.', 'Swords', 'from-red-500 to-orange-500', 'https://images.pexels.com/photos/7915445/pexels-photo-7915445.jpeg?auto=compress&cs=tinysrgb&w=600', 1),
('Vast Open World', 'Explore diverse landscapes from ancient forests to volcanic mountains.', 'Castle', 'from-emerald-500 to-teal-500', 'https://images.pexels.com/photos/12948893/pexels-photo-12948893.jpeg?auto=compress&cs=tinysrgb&w=600', 2),
('Deep Customization', 'Build your hero your way with hundreds of skills, weapons, and armor sets.', 'Shield', 'from-blue-500 to-cyan-500', 'https://images.pexels.com/photos/7915396/pexels-photo-7915396.jpeg?auto=compress&cs=tinysrgb&w=600', 3),
('Engaging Story', 'Unravel an epic narrative with memorable characters and multiple endings.', 'Quest', 'from-purple-500 to-pink-500', 'https://images.pexels.com/photos/16709311/pexels-photo-16709311.jpeg?auto=compress&cs=tinysrgb&w=600', 4),
('Multiplayer Raids', 'Team up with friends to tackle challenging raids and dungeons.', 'Users', 'from-yellow-500 to-amber-500', 'https://images.pexels.com/photos/317187/pexels-photo-317187.jpeg?auto=compress&cs=tinysrgb&w=600', 5),
('Loot & Crafting', 'Collect rare materials and craft legendary items.', 'Treasure', 'from-pink-500 to-rose-500', 'https://images.pexels.com/photos/992434/pexels-photo-992434.jpeg?auto=compress&cs=tinysrgb&w=600', 6)
ON CONFLICT DO NOTHING;

-- Insert sample featured players
INSERT INTO featured_players (name, avatar, title, achievement) VALUES
('DragonSlayer_99', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100', 'Top Raider', 'First to defeat the Ancient Dragon solo'),
('MageMaster', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100', 'Theory Crafter', 'Created the most popular build guide'),
('ArtOfRealms', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', 'Fan Artist', 'Featured artist of the month')
ON CONFLICT DO NOTHING;