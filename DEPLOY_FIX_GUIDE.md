# 🔧 Hướng Dẫn Sửa Lỗi Deploy Frontend

## ❌ **Lỗi hiện tại:**
- Frontend deploy thành công nhưng hiển thị lỗi "Không thể tải danh mục"
- API không thể kết nối với backend

## 🔍 **Nguyên nhân:**
1. **Database trống**: Chưa có dữ liệu câu hỏi
2. **API URL sai**: Frontend không kết nối đúng backend
3. **CORS issues**: Backend chưa cấu hình CORS cho frontend URL

## ✅ **Giải pháp:**

### **Bước 1: Seed Database**

1. **Vào Backend Service trên Render**
2. **Vào tab "Shell"**
3. **Chạy lệnh seed data:**
   ```bash
   cd backend
   npm run seed
   ```

### **Bước 2: Cập nhật Environment Variables**

**Backend Service:**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=<your-mongodb-uri>
ADMIN_KEY=<your-admin-key>
FRONTEND_URL=https://quiz-app-frontend-n7kd.onrender.com
```

**Frontend Service:**
```
NODE_ENV=production
VITE_API_BASE_URL=https://quiz-app-on61.onrender.com/api
```

### **Bước 3: Redeploy Services**

1. **Redeploy Backend** để cập nhật CORS
2. **Redeploy Frontend** để cập nhật API URL

### **Bước 4: Kiểm tra**

1. **Test Backend API:**
   ```bash
   curl https://quiz-app-on61.onrender.com/api/health
   curl https://quiz-app-on61.onrender.com/api/quiz
   ```

2. **Test Frontend:**
   - Truy cập: `https://quiz-app-frontend-n7kd.onrender.com`
   - Kiểm tra console để xem lỗi API

## 🚀 **Commands để chạy:**

### **Seed Database:**
```bash
# Trong backend shell trên Render
npm run seed
```

### **Migrate Categories:**
```bash
# Nếu cần migrate categories
npm run migrate
```

## 🔧 **Debug Steps:**

### **1. Kiểm tra Backend:**
```bash
# Health check
curl https://quiz-app-on61.onrender.com/api/health

# Test categories
curl https://quiz-app-on61.onrender.com/api/quiz
```

### **2. Kiểm tra Frontend Console:**
- Mở Developer Tools (F12)
- Xem tab Console để check API errors
- Xem tab Network để check API calls

### **3. Kiểm tra Environment Variables:**
- Backend: `FRONTEND_URL` phải trỏ đến frontend URL
- Frontend: `VITE_API_BASE_URL` phải trỏ đến backend API

## 📊 **Expected Results:**

Sau khi sửa xong:
- ✅ Backend API trả về categories
- ✅ Frontend load được danh mục
- ✅ Quiz app hoạt động bình thường
- ✅ Admin dashboard có thể login

## 🎯 **URLs sau khi sửa:**

- **Frontend**: `https://quiz-app-frontend-n7kd.onrender.com`
- **Backend API**: `https://quiz-app-on61.onrender.com/api`
- **Admin Dashboard**: `https://quiz-app-frontend-n7kd.onrender.com` (với admin login)

---

**Lưu ý**: Sau khi seed database và cập nhật environment variables, cần redeploy cả 2 services để thay đổi có hiệu lực.
