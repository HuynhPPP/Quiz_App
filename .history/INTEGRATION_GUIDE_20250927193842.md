# Hướng dẫn tích hợp Backend với Frontend Quiz App

## 🎯 Tổng quan

Bạn đã có hệ thống frontend ReactJS và tôi đã tạo backend Node.js + Express + MongoDB Atlas hoàn chỉnh. Dưới đây là hướng dẫn chi tiết để tích hợp và chạy ứng dụng.

## 📁 Cấu trúc dự án sau khi tích hợp

```
Quiz_App/
├── backend/                 # Backend Node.js + Express
│   ├── models/              # MongoDB Models
│   │   ├── Question.js      # Model câu hỏi
│   │   └── Score.js         # Model điểm số
│   ├── routes/              # API Routes
│   │   ├── quiz.js          # Quiz endpoints
│   │   └── score.js         # Score endpoints
│   ├── scripts/             # Utility scripts
│   │   └── seedData.js      # Migrate dữ liệu
│   ├── server.js            # Entry point
│   ├── package.json         # Backend dependencies
│   ├── env.example          # Environment template
│   └── README.md            # Backend documentation
├── src/                     # Frontend ReactJS
│   ├── components/          # React components (đã cập nhật)
│   ├── services/            # API service (mới)
│   │   └── quizAPI.js       # API client
│   ├── styles/              # CSS styles (mới)
│   │   └── api-integration.css
│   └── ...                  # Các file frontend khác
└── ...                      # Các file khác
```

## 🚀 Các bước triển khai

### Bước 1: Cài đặt Backend

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env từ template
cp env.example .env
```

### Bước 2: Cấu hình MongoDB Atlas

1. **Tạo tài khoản MongoDB Atlas:**
   - Truy cập [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Đăng ký tài khoản miễn phí

2. **Tạo Cluster:**
   - Click "Create Cluster"
   - Chọn "Free Tier" (M0)
   - Chọn region gần nhất
   - Đặt tên cluster: `quiz-cluster`

3. **Tạo Database User:**
   - Vào "Database Access" → "Add New Database User"
   - Username: `quiz-user`
   - Password: tạo password mạnh
   - Database User Privileges: "Read and write to any database"

4. **Whitelist IP Address:**
   - Vào "Network Access" → "Add IP Address"
   - Cho development: thêm `0.0.0.0/0` (Allow access from anywhere)
   - Cho production: chỉ thêm IP cụ thể

5. **Lấy Connection String:**
   - Vào "Clusters" → Click "Connect"
   - Chọn "Connect your application"
   - Copy connection string
   - Thay `<password>` bằng password đã tạo

6. **Cập nhật file .env:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://quiz-user:YOUR_PASSWORD@quiz-cluster.xxxxx.mongodb.net/quiz_app?retryWrites=true&w=majority

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Bước 3: Migrate dữ liệu

```bash
# Chạy script migrate dữ liệu từ frontend sang MongoDB
npm run seed
```

### Bước 4: Chạy Backend

```bash
# Development mode (với nodemon)
npm run dev

# Hoặc production mode
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

### Bước 5: Chạy Frontend

```bash
# Quay lại thư mục gốc
cd ..

# Chạy frontend (terminal mới)
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## 🔧 Kiểm tra tích hợp

### 1. Kiểm tra Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Lấy danh mục
curl http://localhost:5000/api/quiz

# Lấy câu hỏi theo danh mục
curl http://localhost:5000/api/quiz/Bóng%20đá
```

### 2. Kiểm tra Frontend
- Mở `http://localhost:5173`
- Chọn chủ đề quiz
- Hoàn thành quiz và lưu điểm
- Xem bảng xếp hạng

## 📊 API Endpoints

### Quiz Endpoints
- `GET /api/quiz` - Lấy tất cả danh mục
- `GET /api/quiz/:category` - Lấy câu hỏi theo danh mục
- `GET /api/quiz/random/:count` - Lấy câu hỏi ngẫu nhiên
- `POST /api/quiz` - Thêm câu hỏi mới (Admin)

### Score Endpoints
- `POST /api/score` - Lưu điểm người chơi
- `GET /api/score/leaderboard` - Lấy bảng xếp hạng
- `GET /api/score/player/:name` - Lấy điểm người chơi cụ thể
- `GET /api/score/stats` - Lấy thống kê tổng quan

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

## 🎨 Tính năng mới đã thêm

### Frontend
1. **API Integration Service** (`src/services/quizAPI.js`)
   - Giao tiếp với backend API
   - Error handling
   - Loading states

2. **Enhanced Quiz Component**
   - Loading states khi tải câu hỏi
   - Error handling
   - Async data loading

3. **Enhanced QuizSelector**
   - Load categories từ API
   - Error handling
   - Loading states

4. **Enhanced Result Component**
   - Form nhập tên để lưu điểm
   - Hiển thị bảng xếp hạng
   - Thống kê điểm số

5. **New Styles**
   - Loading spinners
   - Error states
   - Leaderboard styling
   - Responsive design

### Backend
1. **MongoDB Models**
   - Question model với validation
   - Score model với leaderboard support
   - Indexes để tối ưu performance

2. **RESTful API**
   - Quiz management endpoints
   - Score tracking endpoints
   - Error handling middleware
   - Rate limiting

3. **Security Features**
   - CORS configuration
   - Rate limiting
   - Input validation
   - Error handling

4. **Data Migration**
   - Script migrate dữ liệu từ frontend
   - Seed data cho development

## 🚀 Deployment

### Backend (Render.com)
1. Tạo account tại [Render](https://render.com)
2. Connect GitHub repository
3. Chọn "Web Service"
4. Cấu hình:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: copy từ .env

### Frontend (Vercel/Netlify)
1. Deploy như bình thường
2. Cập nhật API_BASE_URL trong `src/services/quizAPI.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.onrender.com/api';
```

## 🐛 Troubleshooting

### Lỗi kết nối MongoDB
- Kiểm tra connection string trong .env
- Kiểm tra IP whitelist trong MongoDB Atlas
- Kiểm tra database user permissions

### CORS errors
- Kiểm tra FRONTEND_URL trong .env
- Đảm bảo frontend đang chạy trên đúng port

### API không hoạt động
- Kiểm tra backend có đang chạy không
- Kiểm tra console logs
- Test API bằng Postman hoặc curl

## 📝 Lưu ý quan trọng

1. **Environment Variables**: Luôn sử dụng file .env cho sensitive data
2. **CORS**: Cấu hình đúng FRONTEND_URL
3. **Rate Limiting**: Có thể điều chỉnh trong .env
4. **Database**: Sử dụng MongoDB Atlas cho production
5. **Security**: Không commit file .env vào Git

## 🎉 Kết quả

Sau khi hoàn thành các bước trên, bạn sẽ có:
- ✅ Backend API hoàn chỉnh với MongoDB Atlas
- ✅ Frontend tích hợp với backend
- ✅ Hệ thống lưu điểm và leaderboard
- ✅ Error handling và loading states
- ✅ Responsive design
- ✅ Sẵn sàng cho production deployment

Chúc bạn thành công! 🚀
