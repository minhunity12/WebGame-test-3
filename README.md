# Pixel Adventure - Game Website

Website chính thức cho game **Pixel Adventure** - game 2D platformer miễn phí với đồ họa pixel art độc đáo.

## Tính Năng

### Cho Người Chơi
- **Đăng Ký/Đăng Nhập** - Xác thực qua Supabase Auth
- **Hồ Sơ Người Dùng** - Quản lý thông tin cá nhân, xem thành tựu
- **Bảng Xếp Hạng** - BXH điểm, level, speedrun với thời gian thực
- **Nạp Thẻ** - Mua xu/gem qua Momo, ZaloPay, Banking, Thẻ cào
- **Cốt Truyện** - Khám phá câu chuyện game
- **Tải Game** - Tải về nhiều phiên bản

### Cho Admin
- Backend API đầy đủ
- Quản lý người chơi
- Quản lý gói nạp
- Quản lý phiên bản game

## Công Nghệ

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS (custom color scheme)
- Framer Motion (animations)
- React Router
- Lucide React (icons)
- Supabase Client

### Backend
- Node.js + Express
- TypeScript
- Supabase (PostgreSQL + Auth)
- CORS, Helmet

## Cấu Trúc

```
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Story.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── Download.tsx
│   │   ├── Topup.tsx
│   │   ├── Profile.tsx
│   │   ├── Auth.tsx
│   │   └── AuthCallback.tsx
│   ├── utils/
│   │   └── supabase.ts
│   └── types/
├── backend/
│   └── src/
│       └── index.ts
└── render.yaml
```

## Chạy Local

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Biến Môi Trường

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
FRONTEND_URL=http://localhost:5173
```

## Deploy Render.com

File `render.yaml` đã cấu hình sẵn. Cần đặt các biến môi trường:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## API Endpoints

| Method | Endpoint | Mô Tả |
|--------|----------|-------|
| GET | /api/health | Health check |
| GET | /api/packages | Danh sách gói nạp |
| POST | /api/purchase | Xử lý nạp thẻ |
| GET | /api/leaderboard | BXH |
| POST | /api/score | Gửi điểm số |
| GET | /api/versions | Phiên bản game |
| GET | /api/achievements | Thành tựu |
| POST | /api/contact | Gửi liên hệ |

## Database Tables

| Table | Mô Tả |
|-------|-------|
| user_profiles | Hồ sơ người dùng |
| game_scores | Điểm số |
| purchases | Giao dịch |
| topup_packages | Gói nạp |
| game_versions | Phiên bản game |
| user_progress | Tiến độ chơi |
| achievements | Thành tựu |

## Hướng Dẫn Thêm Game

### 1. Upload file game
Đặt file `.zip` vào thư mục `public/downloads/`:
```
public/downloads/pixel-adventure-1.0.0.zip
```

### 2. Thêm version trong DB
Vào Supabase Dashboard > Table Editor > game_versions > Insert:
- version: "1.0.0"
- download_url: "/downloads/pixel-adventure-1.0.0.zip"
- file_size: "150 MB"
- changelog: "Phiên bản đầu tiên"
- is_latest: true
- release_date: 2024-03-15

### 3. Build & Deploy
Frontend sẽ tự động hiển thị phiên bản mới.

## License

MIT
