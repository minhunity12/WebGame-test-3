import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  Pin,
  Crown,
  Clock,
  User,
  Send,
  Search,
  Plus,
  X,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../utils/supabase';
import type { AuthUser } from '../App';

interface ForumPost {
  id: string;
  user_id: string | null;
  title: string;
  content: string;
  category: string;
  is_pinned: boolean;
  is_announcement: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  user_profiles?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

interface ForumComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  like_count: number;
  created_at: string;
  user_profiles?: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
}

interface UserLike {
  post_id: string;
  user_id: string;
}

const CATEGORIES = [
  { key: 'all', label: 'Tất Cả', color: 'from-blue-500 to-blue-600' },
  { key: 'announcement', label: 'Thông Báo', color: 'from-amber-500 to-amber-600' },
  { key: 'general', label: 'Thảo Luận', color: 'from-blue-500 to-blue-600' },
  { key: 'help', label: 'Hỗ Trợ', color: 'from-green-500 to-green-600' },
  { key: 'showcase', label: 'Showcase', color: 'from-purple-500 to-purple-600' },
  { key: 'bug', label: 'Báo Lỗi', color: 'from-red-500 to-red-600' },
  { key: 'suggestion', label: 'Góp Ý', color: 'from-cyan-500 to-cyan-600' },
];

const getCategoryColor = (category: string) => {
  const cat = CATEGORIES.find(c => c.key === category);
  return cat?.color || 'from-gray-500 to-gray-600';
};

const getCategoryLabel = (category: string) => {
  const cat = CATEGORIES.find(c => c.key === category);
  return cat?.label || category;
};

const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    năm: 31536000,
    tháng: 2592000,
    tuần: 604800,
    ngày: 86400,
    giờ: 3600,
    phút: 60,
  };

  for (const [name, secondsInInterval] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInInterval);
    if (interval >= 1) {
      return `${interval} ${name} trước`;
    }
  }

  return 'Vừa xong';
};

export default function Forum({ user }: { user: AuthUser }) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
  });

  const [commentInput, setCommentInput] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setError(null);
      let query = supabase
        .from('forum_posts')
        .select('*, user_profiles!user_id(username, display_name, avatar_url)')
        .order('is_pinned', { ascending: false })
        .order('is_announcement', { ascending: false })
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error: err } = await query;

      if (err) throw err;

      const filtered = data?.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

      setPosts(filtered);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Lỗi tải bài viết');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch comments for selected post
  const fetchComments = async (postId: string) => {
    try {
      setIsLoadingComments(true);
      const { data, error: err } = await supabase
        .from('forum_comments')
        .select('*, user_profiles!user_id(username, display_name, avatar_url)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (err) throw err;
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Lỗi tải bình luận');
    } finally {
      setIsLoadingComments(false);
    }
  };

  // Fetch user likes
  const fetchUserLikes = async () => {
    if (!user?.id) return;

    try {
      const { data, error: err } = await supabase
        .from('forum_likes')
        .select('post_id')
        .eq('user_id', user.id);

      if (err) throw err;
      setUserLikes(new Set(data?.map(like => like.post_id) || []));
    } catch (err) {
      console.error('Error fetching user likes:', err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchPosts();
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchUserLikes();
  }, [user?.id]);

  // Real-time subscription to new posts
  useEffect(() => {
    const subscription = supabase
      .channel('forum_posts_new')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_posts' },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedCategory, searchQuery]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Vui lòng đăng nhập để tạo bài viết');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Vui lòng điền đầy đủ tiêu đề và nội dung');
      return;
    }

    try {
      setIsSubmittingPost(true);
      setError(null);

      const { error: err } = await supabase.from('forum_posts').insert([
        {
          user_id: user.id,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          is_pinned: false,
          is_announcement: false,
          like_count: 0,
          comment_count: 0,
        },
      ]);

      if (err) throw err;

      setFormData({ title: '', content: '', category: 'general' });
      setShowCreateModal(false);
      await fetchPosts();
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Lỗi tạo bài viết');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPost) {
      setError('Vui lòng đăng nhập để bình luận');
      return;
    }

    if (!commentInput.trim()) {
      setError('Vui lòng nhập nội dung bình luận');
      return;
    }

    try {
      setIsSubmittingComment(true);
      setError(null);

      const { error: err } = await supabase.from('forum_comments').insert([
        {
          post_id: selectedPost.id,
          user_id: user.id,
          content: commentInput,
          like_count: 0,
        },
      ]);

      if (err) throw err;

      // Update comment count
      await supabase
        .from('forum_posts')
        .update({ comment_count: selectedPost.comment_count + 1 })
        .eq('id', selectedPost.id);

      setCommentInput('');
      await fetchComments(selectedPost.id);
      setSelectedPost(prev => prev ? { ...prev, comment_count: prev.comment_count + 1 } : null);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Lỗi thêm bình luận');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) {
      setError('Vui lòng đăng nhập để thích bài viết');
      return;
    }

    try {
      setError(null);
      const isLiked = userLikes.has(postId);

      if (isLiked) {
        // Unlike
        const { error: err } = await supabase
          .from('forum_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);

        if (err) throw err;

        const newLikes = new Set(userLikes);
        newLikes.delete(postId);
        setUserLikes(newLikes);

        setPosts(prev =>
          prev.map(p =>
            p.id === postId ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p
          )
        );

        if (selectedPost?.id === postId) {
          setSelectedPost(prev =>
            prev ? { ...prev, like_count: Math.max(0, prev.like_count - 1) } : null
          );
        }

        await supabase
          .from('forum_posts')
          .update({ like_count: Math.max(0, posts.find(p => p.id === postId)?.like_count || 1 - 1) })
          .eq('id', postId);
      } else {
        // Like
        const { error: err } = await supabase
          .from('forum_likes')
          .insert([{ post_id: postId, user_id: user.id }]);

        if (err) throw err;

        setUserLikes(new Set([...userLikes, postId]));

        setPosts(prev =>
          prev.map(p =>
            p.id === postId ? { ...p, like_count: p.like_count + 1 } : p
          )
        );

        if (selectedPost?.id === postId) {
          setSelectedPost(prev =>
            prev ? { ...prev, like_count: prev.like_count + 1 } : null
          );
        }

        await supabase
          .from('forum_posts')
          .update({ like_count: (posts.find(p => p.id === postId)?.like_count || 0) + 1 })
          .eq('id', postId);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Lỗi cập nhật lượt thích');
    }
  };

  const openPostDetail = async (post: ForumPost) => {
    setSelectedPost(post);
    setShowDetailModal(true);
    await fetchComments(post.id);
  };

  const getAuthorName = (post: ForumPost) => {
    if (!post.user_id || post.user_profiles === null) {
      return 'Pixel Adventure';
    }
    return post.user_profiles?.display_name || post.user_profiles?.username || 'Anonymous';
  };

  const isAdminPost = (post: ForumPost) => {
    return post.user_id === null;
  };

  return (
    <div className="min-h-screen bg-game-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Cộng Đồng Pixel Adventure
          </h1>
          <p className="text-gray-300 text-lg">
            Chia sẻ, thảo luận, và kết nối với cộng đồng game thủ
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Post List */}
          <div className="lg:col-span-2">
            {/* Search and Create Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition"
                />
              </div>
              {user && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span className="hidden sm:inline">Tạo Bài Viết</span>
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-8 overflow-x-auto pb-2">
              <div className="flex gap-2 min-w-max">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat.key
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-${cat.color.split('-')[1]}-500/30`
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800 border border-gray-700/50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Chưa có bài viết nào</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {posts.map(post => (
                  <motion.button
                    key={post.id}
                    onClick={() => openPostDetail(post)}
                    whileHover={{ y: -2 }}
                    className="w-full text-left p-4 bg-gray-900/40 border border-gray-700/30 rounded-lg hover:border-gray-600/50 hover:bg-gray-900/60 transition group backdrop-blur-sm"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {post.is_pinned && (
                            <Pin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                          {isAdminPost(post) && (
                            <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
                          )}
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded bg-gradient-to-r ${getCategoryColor(
                              post.category
                            )} text-white`}
                          >
                            {getCategoryLabel(post.category)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                          {post.title}
                        </h3>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {post.content}
                    </p>

                    {/* Post Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{getAuthorName(post)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(post.created_at)}</span>
                      </div>
                    </div>

                    {/* Post Stats */}
                    <div className="flex gap-4 text-sm text-gray-400 border-t border-gray-700/30 pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikePost(post.id);
                        }}
                        className={`flex items-center gap-2 transition ${
                          userLikes.has(post.id)
                            ? 'text-red-400'
                            : 'hover:text-red-400'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${userLikes.has(post.id) ? 'fill-current' : ''}`}
                        />
                        <span>{post.like_count}</span>
                      </button>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comment_count}</span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="hidden lg:block">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-gradient-to-b from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg backdrop-blur-sm sticky top-32"
            >
              <h2 className="text-xl font-bold text-cyan-300 mb-4">
                💡 Mẹo & Hướng Dẫn
              </h2>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Sử dụng tìm kiếm để tìm câu trả lời nhanh chóng</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Kiểm tra các bài viết được ghim trước tiên</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Hãy lịch sự và thân thiện khi bình luận</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>Chia sẻ tấm ảnh chơi game của bạn!</span>
                </li>
              </ul>

              {!user && (
                <motion.div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-200 mb-3">
                    Đăng nhập để tạo bài viết và tham gia thảo luận
                  </p>
                  <a
                    href="/auth"
                    className="block text-center py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition"
                  >
                    Đăng Nhập
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Tạo Bài Viết Mới</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Danh Mục
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Tiêu Đề
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Nhập tiêu đề bài viết..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Nội Dung
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    placeholder="Nhập nội dung bài viết..."
                    rows={6}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded font-semibold text-white hover:shadow-lg hover:shadow-cyan-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingPost ? 'Đang tạo...' : 'Tạo Bài Viết'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 bg-gray-800 border border-gray-700 rounded font-semibold text-white hover:bg-gray-700 transition"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full my-8"
            >
              {/* Modal Header */}
              <div className="border-b border-gray-700 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      {selectedPost.is_pinned && (
                        <Pin className="w-5 h-5 text-amber-400" />
                      )}
                      {isAdminPost(selectedPost) && (
                        <Crown className="w-5 h-5 text-amber-400" />
                      )}
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded bg-gradient-to-r ${getCategoryColor(
                          selectedPost.category
                        )} text-white`}
                      >
                        {getCategoryLabel(selectedPost.category)}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedPost.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{getAuthorName(selectedPost)}</span>
                      <span>•</span>
                      <span>{formatRelativeTime(selectedPost.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-white transition flex-shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
                {/* Post Content */}
                <p className="text-gray-300 whitespace-pre-wrap break-words">
                  {selectedPost.content}
                </p>

                {/* Post Stats */}
                <div className="flex gap-6 text-sm border-y border-gray-700 py-4">
                  <button
                    onClick={() => handleLikePost(selectedPost.id)}
                    className={`flex items-center gap-2 transition ${
                      userLikes.has(selectedPost.id)
                        ? 'text-red-400'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${userLikes.has(selectedPost.id) ? 'fill-current' : ''}`}
                    />
                    <span>{selectedPost.like_count} Thích</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MessageSquare className="w-5 h-5" />
                    <span>{selectedPost.comment_count} Bình Luận</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">
                    Bình Luận ({comments.length})
                  </h3>

                  {isLoadingComments ? (
                    <div className="flex justify-center py-6">
                      <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                  ) : comments.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">
                      Chưa có bình luận nào. Hãy là người đầu tiên!
                    </p>
                  ) : (
                    <div className="space-y-4 mb-6">
                      {comments.map(comment => (
                        <div
                          key={comment.id}
                          className="p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg"
                        >
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                              {(comment.user_profiles?.display_name ||
                                comment.user_profiles?.username ||
                                'A')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-200 text-sm">
                                {comment.user_profiles?.display_name ||
                                  comment.user_profiles?.username ||
                                  'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatRelativeTime(comment.created_at)}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Form */}
                  {user ? (
                    <form onSubmit={handleAddComment} className="flex gap-3">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Nhập bình luận..."
                        className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 transition"
                      />
                      <button
                        type="submit"
                        disabled={isSubmittingComment}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded text-white hover:shadow-lg hover:shadow-cyan-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-blue-900/30 border border-blue-500/30 rounded text-blue-200 text-sm text-center">
                      <a href="/auth" className="hover:underline font-semibold">
                        Đăng nhập
                      </a>
                      {' '}để bình luận
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
