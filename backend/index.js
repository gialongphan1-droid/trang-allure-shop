require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const compression = require('compression'); // THÊM DÒNG NÀY
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { protect } = require('./middleware/auth');
const upload = require('./middleware/upload');

// Import routes
const publicProductRoutes = require('./routes/public/products');
const publicCategoryRoutes = require('./routes/public/categories');
const publicBannerRoutes = require('./routes/public/banners');
const adminAuthRoutes = require('./routes/admin/auth');
const adminProductRoutes = require('./routes/admin/products');
const adminCategoryRoutes = require('./routes/admin/categories');
const adminBannerRoutes = require('./routes/admin/banners');
const adminDashboardRoutes = require('./routes/admin/dashboard');

const app = express();

// Kết nối database
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Quá nhiều request, vui lòng thử lại sau',
  skip: (req) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.id) {
          return true;
        }
      } catch (error) {
        return false;
      }
    }
    return false;
  },
});

// Middleware - Compression phải được đặt TRƯỚC các route
app.use(compression()); // THÊM DÒNG NÀY
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use('/api', limiter);

// ============ ROUTE UPLOAD ẢNH ============
app.post('/api/admin/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Không có file ảnh' });
    }
    res.json({ success: true, url: req.file.path });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public routes
app.use('/api/products', publicProductRoutes);
app.use('/api/categories', publicCategoryRoutes);
app.use('/api/banners', publicBannerRoutes);

// Admin routes
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/products', protect, adminProductRoutes);
app.use('/api/admin/categories', protect, adminCategoryRoutes);
app.use('/api/admin/banners', protect, adminBannerRoutes);
app.use('/api/admin/dashboard', protect, adminDashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
  console.log(`📌 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}/api`);
});