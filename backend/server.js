import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import path from 'path';

// Import routes
import quizRoutes from './routes/quiz.js';
import scoreRoutes from './routes/score.js';
import adminRoutes from './routes/admin.js';
import categoryRoutes from './routes/category.js';

// Load environment variables
dotenv.config();


const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { error: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau.' }
});

// Middleware
app.use(limiter);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS config - Allow all origins
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
}));
console.log('🌐 CORS configured for: all origins');

// Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/categories', categoryRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Quiz App Backend đang hoạt động',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from frontend/dist
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Catch-all handler: send back React's index.html file for any non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Có lỗi xảy ra trên server',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Lỗi server nội bộ'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint không tồn tại',
    message: `Không tìm thấy ${req.method} ${req.originalUrl}`
  });
});

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    });
    console.log('✅ Kết nối MongoDB Atlas thành công');
  })
  .catch((error) => {
    console.error('❌ Lỗi kết nối MongoDB Atlas:', error.message);
    process.exit(1);
  });
