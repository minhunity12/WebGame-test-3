-- Forum posts
CREATE TABLE IF NOT EXISTS forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'help', 'showcase', 'bug', 'suggestion', 'announcement')),
  is_pinned BOOLEAN DEFAULT false,
  is_announcement BOOLEAN DEFAULT false,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_posts_select_all" ON forum_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "forum_posts_insert_own" ON forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_posts_update_own" ON forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_posts_delete_own" ON forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Forum comments
CREATE TABLE IF NOT EXISTS forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_comments_select_all" ON forum_comments FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "forum_comments_insert_own" ON forum_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_comments_update_own" ON forum_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_comments_delete_own" ON forum_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Forum post likes
CREATE TABLE IF NOT EXISTS forum_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "forum_likes_select_all" ON forum_likes FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "forum_likes_insert_own" ON forum_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "forum_likes_delete_own" ON forum_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Seed some announcement posts (using NULL user_id for system/admin)
INSERT INTO forum_posts (user_id, title, content, category, is_pinned, is_announcement) VALUES
  (NULL, 'Chào Mừng Đến Với Pixel Adventure!', 'Cộng đồng Pixel Adventure chào đón tất cả game thủ! Đây là nơi để các bạn chia sẻ kinh nghiệm, hỏi đáp và cùng nhau chinh phục các thử thách trong game. Hãy đọc kỹ nội quy trước khi đăng bài nhé!', 'announcement', true, true),
  (NULL, 'Cập Nhật v1.1.0 - Boss Mới & Màn Chơi Bổ Sung', 'Chúng tôi vừa phát hành bản cập nhật v1.1.0 với nhiều nội dung mới: 2 boss mới cực kỳ khó nhằn, 15 màn chơi bổ sung ở World 3, cân bằng lại hệ thống chiến đấu và sửa nhiều lỗi nhỏ. Hãy cập nhật game và trải nghiệm ngay!', 'announcement', false, true);