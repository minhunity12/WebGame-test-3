export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: 'news' | 'update' | 'event' | 'community' | 'dev';
  date: string;
  read_time: string;
  featured?: boolean;
}
