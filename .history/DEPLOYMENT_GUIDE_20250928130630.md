# 🚀 Hướng dẫn Deploy Quiz App lên Render

## 📋 Tổng quan
- **Backend**: Node.js + Express + MongoDB Atlas
- **Frontend**: React + Vite  
- **Database**: MongoDB Atlas (Cloud)
- **Platform**: Render.com

---

## 🔧 Bước 1: Chuẩn bị MongoDB Atlas

### 1.1 Tạo MongoDB Atlas Cluster
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Đăng nhập/Đăng ký tài khoản
3. Tạo cluster mới (chọn tier miễn phí M0)
4. Chọn region gần nhất (Singapore hoặc Tokyo)

### 1.2 Cấu hình Database Access
1. Vào **Database Access** → **Add New Database User**
2. Tạo user với:
   - Username: `quiz-admin`
   - Password: `your-secure-password`
   - Database User Privileges: **Read and write to any database**

### 1.3 Cấu hình Network Access
1. Vào **Network Access** → **Add IP Address**
2. Thêm `0.0.0.0/0` để cho phép truy cập từ mọi nơi (cho production)

### 1.4 Lấy Connection String
1. Vào **Database** → **Connect** → **Connect your application**
2. Copy connection string:
   ```
   mongodb+srv://quiz-admin:<password>@cluster0.xxxxx.mongodb.net/quiz_app?retryWrites=true&w=majority
   ```

---

## 🌐 Bước 2: Deploy Backend lên Render

### 2.1 Tạo Web Service
1. Truy cập [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect GitHub repository của bạn

### 2.2 Cấu hình Backend Service
```
Name: quiz-app-backend
Environment: Node
Build Command: cd backend && npm install
Start Command: cd backend && npm start
```

### 2.3 Environment Variables
Thêm các biến môi trường sau:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://quiz-admin:your-password@cluster0.xxxxx.mongodb.net/quiz_app?retryWrites=true&w=majority
FRONTEND_URL=https://your-frontend-app.onrender.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ADMIN_KEY=your-super-secure-admin-key-here
```

### 2.4 Deploy Backend
1. Click **Create Web Service**
2. Chờ deploy hoàn thành
3. Lưu URL backend: `https://quiz-app-backend.onrender.com`

---

## 🎨 Bước 3: Deploy Frontend lên Render

### 3.1 Tạo Static Site
1. Trong Render Dashboard → **New** → **Static Site**
2. Connect GitHub repository của bạn

### 3.2 Cấu hình Frontend
```
Name: quiz-app-frontend
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
```

### 3.3 Environment Variables
Thêm các biến môi trường:

```
VITE_API_BASE_URL=https://quiz-app-backend.onrender.com/api
VITE_ADMIN_KEY=your-super-secure-admin-key-here
```

### 3.4 Deploy Frontend
1. Click **Create Static Site**
2. Chờ deploy hoàn thành
3. Lưu URL frontend: `https://quiz-app-frontend.onrender.com`

---

## 🔄 Bước 4: Cập nhật CORS

### 4.1 Cập nhật Backend CORS
1. Vào Render Dashboard → Backend Service
2. Vào **Environment** tab
3. Cập nhật `FRONTEND_URL` với URL frontend thực tế:
   ```
   FRONTEND_URL=https://quiz-app-frontend.onrender.com
   ```
4. Click **Save Changes** → **Manual Deploy**

---

## 🗄️ Bước 5: Seed Database

### 5.1 Chạy Script Seed
1. Vào Render Dashboard → Backend Service
2. Vào **Shell** tab
3. Chạy lệnh:
   ```bash
   cd backend && npm run seed
   ```

### 5.2 Kiểm tra Database
1. Truy cập MongoDB Atlas
2. Vào **Database** → **Browse Collections**
3. Kiểm tra collections `questions` và `scores`

---

## ✅ Bước 6: Test và Kiểm tra

### 6.1 Test Backend API
```bash
# Test health check
curl https://quiz-app-backend.onrender.com/api/health

# Test categories
curl https://quiz-app-backend.onrender.com/api/quiz
```

### 6.2 Test Frontend
1. Truy cập URL frontend
2. Test các chức năng:
   - Chọn quiz category
   - Làm quiz
   - Lưu điểm
   - Xem leaderboard
   - Truy cập Admin Dashboard

### 6.3 Test Admin Dashboard
1. Click nút Admin trên frontend
2. Nhập Admin Key đã cấu hình
3. Test các chức năng admin:
   - Xem thống kê
   - Quản lý câu hỏi
   - Quản lý người chơi

---

## 🔧 Troubleshooting

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trong backend environment variables
- Đảm bảo URL frontend chính xác (không có trailing slash)

### Lỗi Database Connection
- Kiểm tra `MONGODB_URI` có đúng format không
- Kiểm tra Network Access trong MongoDB Atlas
- Kiểm tra username/password trong connection string

### Lỗi Build Frontend
- Kiểm tra `VITE_API_BASE_URL` có đúng không
- Kiểm tra build command: `cd frontend && npm install && npm run build`

### Lỗi Admin Authentication
- Kiểm tra `ADMIN_KEY` giống nhau ở cả backend và frontend
- Kiểm tra `VITE_ADMIN_KEY` trong frontend environment variables

---

## 📊 Monitoring và Maintenance

### 7.1 Monitor Logs
- Vào Render Dashboard → Service → **Logs**
- Theo dõi logs để phát hiện lỗi

### 7.2 Database Monitoring
- Vào MongoDB Atlas → **Monitoring**
- Theo dõi performance và usage

### 7.3 Backup Strategy
- MongoDB Atlas tự động backup
- Có thể export data từ Atlas dashboard

---

## 🎯 Kết quả cuối cùng

Sau khi deploy thành công, bạn sẽ có:

✅ **Backend API**: `https://quiz-app-backend.onrender.com`
✅ **Frontend App**: `https://quiz-app-frontend.onrender.com`  
✅ **Database**: MongoDB Atlas (Cloud)
✅ **Admin Dashboard**: Truy cập qua frontend với Admin Key
✅ **Full CRUD**: Quản lý câu hỏi và người chơi
✅ **Leaderboard**: Bảng xếp hạng real-time
✅ **Responsive**: Hoạt động tốt trên mọi thiết bị

---

## 🔐 Security Notes

- **Admin Key**: Sử dụng key mạnh và bảo mật
- **Database**: Chỉ cho phép IP cần thiết
- **CORS**: Chỉ cho phép domain frontend
- **Rate Limiting**: Đã cấu hình để chống spam

---

## 📞 Support

Nếu gặp vấn đề trong quá trình deploy:
1. Kiểm tra logs trong Render Dashboard
2. Kiểm tra MongoDB Atlas connection
3. Test API endpoints trực tiếp
4. Kiểm tra environment variables

**Chúc bạn deploy thành công! 🎉**
