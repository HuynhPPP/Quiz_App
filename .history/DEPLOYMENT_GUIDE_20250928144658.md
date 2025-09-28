# 🚀 Hướng Dẫn Deploy Quiz App lên Render.com

## 📋 Chuẩn Bị Trước Khi Deploy

### 1. Tạo MongoDB Atlas Database
1. Truy cập [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Tạo cluster mới
3. Tạo database user
4. Lấy connection string
5. Whitelist IP `0.0.0.0/0` (cho phép tất cả IP)

### 2. Chuẩn Bị Environment Variables
- `MONGODB_URI`: Connection string từ MongoDB Atlas
- `ADMIN_KEY`: Key bảo mật cho admin (ví dụ: `phanhuynh@123321`)
- `FRONTEND_URL`: URL của frontend service

## 🔧 Cấu Hình Render.com

### Bước 1: Deploy Backend Service

1. **Tạo Web Service mới**
   - Type: `Web Service`
   - Name: `quiz-app-backend`
   - Environment: `Node`
   - Region: `Oregon (US West)`

2. **Cấu hình Build & Deploy**
   ```
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your-mongodb-connection-string>
   ADMIN_KEY=<your-admin-key>
   FRONTEND_URL=https://quiz-app-frontend.onrender.com
   ```

4. **Deploy và lấy URL**
   - Sau khi deploy thành công, lấy URL backend
   - Ví dụ: `https://quiz-app-backend.onrender.com`

### Bước 2: Deploy Frontend Service

1. **Tạo Static Site mới**
   - Type: `Static Site`
   - Name: `quiz-app-frontend`
   - Region: `Oregon (US West)`

2. **Cấu hình Build**
   ```
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```

3. **Environment Variables**
   ```
   NODE_ENV=production
   VITE_API_BASE_URL=https://quiz-app-backend.onrender.com/api
   ```

4. **Deploy và lấy URL**
   - Sau khi deploy thành công, lấy URL frontend
   - Ví dụ: `https://quiz-app-frontend.onrender.com`

### Bước 3: Cập Nhật URLs

1. **Cập nhật Backend**
   - Vào backend service settings
   - Cập nhật `FRONTEND_URL` với URL frontend thực tế

2. **Cập nhật Frontend**
   - Vào frontend service settings  
   - Cập nhật `VITE_API_BASE_URL` với URL backend thực tế

## 🔄 Sử Dụng render.yaml (Tự Động)

Thay vì tạo manual, bạn có thể sử dụng file `render.yaml`:

1. **Push code lên GitHub**
2. **Connect GitHub với Render**
3. **Render sẽ tự động detect `render.yaml`**
4. **Tạo cả 2 services tự động**

## 🐛 Troubleshooting

### Lỗi "vite: not found"
- ✅ **Đã sửa**: Chuyển `vite` từ `devDependencies` sang `dependencies`

### Lỗi Build Frontend
- Kiểm tra `buildCommand` có đúng path không
- Đảm bảo `staticPublishPath` trỏ đến `./frontend/dist`

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` trong backend
- Đảm bảo URL frontend đúng

### Lỗi Database Connection
- Kiểm tra `MONGODB_URI` có đúng không
- Đảm bảo IP whitelist trong MongoDB Atlas

## 📊 Kiểm Tra Deploy

### Backend Health Check
```
GET https://quiz-app-backend.onrender.com/api/health
```

### Frontend Test
1. Truy cập URL frontend
2. Test chọn chủ đề quiz
3. Test admin login với `ADMIN_KEY`

### Admin Dashboard Test
1. Truy cập frontend
2. Vào admin login
3. Nhập admin key
4. Test các chức năng CRUD

## 🔐 Bảo Mật Production

1. **Thay đổi Admin Key** mặc định
2. **Cập nhật MongoDB user** với quyền hạn phù hợp
3. **Enable HTTPS** (Render tự động cung cấp)
4. **Monitor logs** thường xuyên

## 📈 Performance Tips

1. **Enable Auto-Deploy** từ GitHub
2. **Set up monitoring** với Render metrics
3. **Optimize images** và assets
4. **Enable caching** cho static files

---

## 🎉 Hoàn Thành!

Sau khi deploy thành công, bạn sẽ có:
- ✅ Backend API: `https://quiz-app-backend.onrender.com`
- ✅ Frontend App: `https://quiz-app-frontend.onrender.com`
- ✅ Admin Dashboard: Truy cập qua frontend
- ✅ MongoDB Database: Cloud-hosted và secure

**Chúc bạn deploy thành công!** 🚀
