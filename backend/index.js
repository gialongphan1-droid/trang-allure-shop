require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const { protect } = require("./middleware/auth");
const upload = require("./middleware/upload");

// Import routes
const publicProductRoutes = require("./routes/public/products");
const publicCategoryRoutes = require("./routes/public/categories");
const publicBannerRoutes = require("./routes/public/banners");
const adminAuthRoutes = require("./routes/admin/auth");
const adminProductRoutes = require("./routes/admin/products");
const adminCategoryRoutes = require("./routes/admin/categories");
const adminBannerRoutes = require("./routes/admin/banners");
const adminDashboardRoutes = require("./routes/admin/dashboard");
const sitemapRoutes = require("./routes/public/sitemap");

const app = express();

// Kết nối database
connectDB();

// ============ HEALTH CHECK (KHÔNG RATE LIMIT) ============
app.get("/api/health", (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || "development",
	});
});

// ============ CẤU HÌNH RATE LIMIT ============
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 phút
	max: 1000,
	message: "Quá nhiều request, vui lòng thử lại sau",
	skip: (req) => {
		// 1. Bỏ qua rate limit cho UptimeRobot
		const userAgent = req.headers["user-agent"] || "";
		if (userAgent.includes("UptimeRobot")) {
			return true;
		}

		// 2. Bỏ qua rate limit cho admin đã đăng nhập
		const token =
			req.cookies?.token || req.headers.authorization?.split(" ")[1];
		if (token) {
			try {
				const jwt = require("jsonwebtoken");
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

// ============ CẤU HÌNH HELMET VỚI CSP ============
app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				imgSrc: [
					"'self'",
					"data:",
					"https://res.cloudinary.com",
					"https://*.cloudinary.com",
					"https://images.unsplash.com",
					"https://*.unsplash.com",
				],
				scriptSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'"],
				fontSrc: ["'self'", "data:"],
				connectSrc: [
					"'self'",
					process.env.FRONTEND_URL || "http://localhost:5173",
				],
				frameAncestors: ["'none'"],
				formAction: ["'self'"],
				baseUri: ["'self'"],
				objectSrc: ["'none'"],
			},
		},
		crossOriginEmbedderPolicy: false,
		crossOriginResourcePolicy: { policy: "cross-origin" },
	}),
);

// ============ MIDDLEWARE ============
app.use(compression());

// ============ CẤU HÌNH CORS ============
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://trang-allure-shop.vercel.app',
  'https://trang-allure-shop-r61a.vercel.app',
  'https://trangallure.shop',
  'https://www.trangallure.shop',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Áp dụng rate limit cho tất cả API (TRỪ health check đã đặt ở trên)
app.use("/api", limiter);
app.use(cookieParser()); // Đảm bảo đã có dòng này

// ============ SITEMAP ============
app.use("/", sitemapRoutes);

// ============ UPLOAD ẢNH ============
app.post(
	"/api/admin/upload",
	protect,
	upload.single("image"),
	async (req, res) => {
		try {
			if (!req.file) {
				return res
					.status(400)
					.json({ success: false, message: "Không có file ảnh" });
			}
			res.json({ success: true, url: req.file.path });
		} catch (error) {
			console.error("Upload error:", error);
			res.status(500).json({ success: false, message: error.message });
		}
	},
);

// ============ PUBLIC ROUTES ============
app.use("/api/products", publicProductRoutes);
app.use("/api/categories", publicCategoryRoutes);
app.use("/api/banners", publicBannerRoutes);

// ============ ADMIN ROUTES ============
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/products", protect, adminProductRoutes);
app.use("/api/admin/categories", protect, adminCategoryRoutes);
app.use("/api/admin/banners", protect, adminBannerRoutes);
app.use("/api/admin/dashboard", protect, adminDashboardRoutes);

// ============ ERROR HANDLER ============
app.use(errorHandler);

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
	console.log(`📌 Environment: ${process.env.NODE_ENV || "development"}`);
	console.log(`🔗 API URL: http://localhost:${PORT}/api`);
	console.log(`🗺️  Sitemap: http://localhost:${PORT}/sitemap.xml`);
	console.log(`✅ CORS allowed origins:`, allowedOrigins);
	console.log(
		`✅ Rate limit: ${limiter.max} requests per ${limiter.windowMs / 60000} minutes`,
	);
});
