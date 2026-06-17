-- Add type and gems columns to topup_packages
ALTER TABLE topup_packages ADD COLUMN IF NOT EXISTS type VARCHAR(10) DEFAULT 'coins' CHECK (type IN ('coins', 'gems'));
ALTER TABLE topup_packages ADD COLUMN IF NOT EXISTS gems INTEGER DEFAULT 0;
ALTER TABLE topup_packages ADD COLUMN IF NOT EXISTS bonus_gems INTEGER DEFAULT 0;

-- Update existing packages to be coins type
UPDATE topup_packages SET type = 'coins' WHERE type IS NULL OR type = 'coins';

-- Insert gem packages
INSERT INTO topup_packages (name, description, coins, bonus_coins, gems, bonus_gems, price, currency, is_popular, is_active, display_order, type) VALUES
  ('10 Gem', 'Gói gem nhỏ để thử', 0, 0, 10, 0, 20000, 'VND', false, true, 10, 'gems'),
  ('50 Gem', 'Gói gem phổ thông', 0, 0, 50, 5, 90000, 'VND', false, true, 11, 'gems'),
  ('120 Gem', 'Gói gem hấp dẫn', 0, 0, 120, 20, 200000, 'VND', true, true, 12, 'gems'),
  ('250 Gem', 'Gói gem cao cấp', 0, 0, 250, 50, 380000, 'VND', false, true, 13, 'gems'),
  ('500 Gem', 'Gói gem VIP', 0, 0, 500, 150, 700000, 'VND', false, true, 14, 'gems'),
  ('1200 Gem', 'Gói gem đặc biệt', 0, 0, 1200, 400, 1500000, 'VND', false, true, 15, 'gems');