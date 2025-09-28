# Quiz App Backend

Backend API cho ứng dụng Quiz được xây dựng với Node.js, Express và MongoDB Atlas.

## 🚀 Tính năng

- **Quiz Management**: Quản lý câu hỏi theo danh mục
- **Score Tracking**: Lưu trữ và theo dõi điểm số người chơi
- **Leaderboard**: Bảng xếp hạng top người chơi
- **RESTful API**: API endpoints chuẩn REST
- **Rate Limiting**: Giới hạn số lượng request
- **CORS Support**: Hỗ trợ CORS cho frontend

## 📋 Yêu cầu hệ thống

- Node.js >= 16.0.0
- MongoDB Atlas account
- npm hoặc yarn

## 🛠️ Cài đặt

### 1. Clone repository và cài đặt dependencies

```bash
cd backend
npm install
```

### 2. Cấu hình MongoDB Atlas

1. Đăng ký tài khoản tại [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Tạo cluster mới
3. Tạo database user với quyền read/write
4. Whitelist IP address (hoặc 0.0.0.0/0 cho development)
5. Lấy connection string

### 3. Tạo file .env

```bash
cp env.example .env
```

Cập nhật file `.env` với thông tin của bạn:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quiz_app?retryWrites=true&w=majority

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Chạy ứng dụng

```bash
# Development mode
npm run dev

# Production mode
npm start
```

### 5. Seed dữ liệu (tùy chọn)

```bash
npm run seed
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Quiz Endpoints

#### GET /api/quiz
Lấy tất cả danh mục có sẵn

**Response:**
```json
{
  "success": true,
  "data": ["Bóng đá", "Europe", "Asia", "Học tiếng Anh chuyên ngành"],
  "count": 4
}
```

#### GET /api/quiz/:category
Lấy câu hỏi theo danh mục

**Parameters:**
- `category` (string): Tên danh mục

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "category": "Bóng đá",
      "question": "Một trận đấu bóng đá chính thức có bao nhiêu phút?",
      "options": ["80 phút", "90 phút", "100 phút", "120 phút"],
      "answer": "90 phút",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1,
  "category": "Bóng đá"
}
```

#### GET /api/quiz/random/:count
Lấy câu hỏi ngẫu nhiên

**Parameters:**
- `count` (number): Số lượng câu hỏi (1-50)

#### POST /api/quiz
Thêm câu hỏi mới (Admin)

**Body:**
```json
{
  "category": "Bóng đá",
  "question": "Câu hỏi mới?",
  "options": ["A", "B", "C", "D"],
  "answer": "A"
}
```

### Score Endpoints

#### POST /api/score
Lưu điểm của người chơi

**Body:**
```json
{
  "name": "Nguyễn Văn A",
  "points": 85
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lưu điểm thành công",
  "data": {
    "id": "...",
    "name": "Nguyễn Văn A",
    "points": 85,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/score/leaderboard
Lấy bảng xếp hạng

**Query Parameters:**
- `limit` (number): Số lượng người chơi (1-100, default: 10)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Nguyễn Văn A",
      "points": 95,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "rank": 1
    }
  ],
  "count": 1,
  "message": "Top 1 người chơi có điểm cao nhất"
}
```

#### GET /api/score/player/:name
Lấy điểm của người chơi cụ thể

#### GET /api/score/stats
Lấy thống kê tổng quan

### Health Check

#### GET /api/health
Kiểm tra trạng thái server

**Response:**
```json
{
  "status": "OK",
  "message": "Quiz App Backend đang hoạt động",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🗂️ Cấu trúc thư mục

```
backend/
├── models/           # MongoDB models
│   ├── Question.js   # Model cho câu hỏi
│   └── Score.js      # Model cho điểm số
├── routes/           # API routes
│   ├── quiz.js       # Quiz endpoints
│   └── score.js       # Score endpoints
├── scripts/          # Utility scripts
│   └── seedData.js   # Script migrate dữ liệu
├── server.js         # Entry point
├── package.json      # Dependencies
└── env.example       # Environment variables template
```

## 🔧 Cấu hình MongoDB Atlas

### 1. Tạo Cluster
1. Đăng nhập vào MongoDB Atlas
2. Click "Create Cluster"
3. Chọn "Free Tier" cho development
4. Chọn region gần nhất
5. Đặt tên cluster (ví dụ: "quiz-cluster")

### 2. Tạo Database User
1. Vào "Database Access"
2. Click "Add New Database User"
3. Chọn "Password" authentication
4. Tạo username/password
5. Chọn "Read and write to any database"

### 3. Whitelist IP
1. Vào "Network Access"
2. Click "Add IP Address"
3. Cho development: thêm "0.0.0.0/0" (Allow access from anywhere)
4. Cho production: chỉ thêm IP cụ thể

### 4. Lấy Connection String
1. Vào "Clusters"
2. Click "Connect"
3. Chọn "Connect your application"
4. Copy connection string
5. Thay `<password>` bằng password đã tạo

## 🚀 Deployment

### Render.com
1. Tạo account tại [Render](https://render.com)
2. Connect GitHub repository
3. Chọn "Web Service"
4. Cấu hình:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: thêm các biến từ .env

### Heroku
1. Tạo account tại [Heroku](https://heroku.com)
2. Install Heroku CLI
3. Login và tạo app
4. Set environment variables
5. Deploy

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra connection string
- Kiểm tra IP whitelist
- Kiểm tra database user permissions

### CORS errors
- Kiểm tra FRONTEND_URL trong .env
- Đảm bảo frontend đang chạy trên đúng port

### Rate limiting
- Kiểm tra RATE_LIMIT settings
- Tăng giới hạn nếu cần thiết

## 📝 License

MIT License
