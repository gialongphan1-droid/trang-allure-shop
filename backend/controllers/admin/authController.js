const jwt = require("jsonwebtoken");
const Admin = require("../../models/Admin");
const crypto = require("crypto");

// ============ TẠO TOKEN ============
const generateAccessToken = (admin) => {
	return jwt.sign(
		{ id: admin._id, email: admin.email },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
	);
};

const generateRefreshToken = () => {
	return crypto.randomBytes(64).toString("hex");
};

// ============ CẤU HÌNH COOKIE ============
const getCookieOptions = (maxAge) => {
	const isProduction = process.env.NODE_ENV === "production";
	const options = {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax", // ✅ Cùng domain nên dùng 'lax'
		maxAge: maxAge,
		path: "/",
	};
	// ✅ Nếu production, set domain
	if (isProduction) {
		options.domain = ".trangallure.shop";
	}
	return options;
};

// ============ ĐĂNG NHẬP ============
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		console.log("🔐 Login attempt:", email);

		const admin = await Admin.findOne({ email }).select("+password");
		if (!admin) {
			console.log("❌ Admin not found");
			return res
				.status(401)
				.json({ success: false, message: "Email hoặc mật khẩu không đúng" });
		}

		const isMatch = await admin.comparePassword(password);
		console.log("🔑 Password match:", isMatch);

		if (!isMatch) {
			return res
				.status(401)
				.json({ success: false, message: "Email hoặc mật khẩu không đúng" });
		}

		admin.lastLogin = new Date();
		await admin.save();

		const accessToken = generateAccessToken(admin);
		const refreshToken = generateRefreshToken();

		// Hash refresh token trước khi lưu vào DB
		const hashedRefreshToken = crypto
			.createHash("sha256")
			.update(refreshToken)
			.digest("hex");
		admin.refreshToken = hashedRefreshToken;
		admin.refreshTokenExpiresAt = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		);
		await admin.save();

		console.log("📝 Token generated:", accessToken.substring(0, 20) + "...");

		// ✅ Set cookie
		res.cookie("token", accessToken, getCookieOptions(15 * 60 * 1000));
		res.cookie("refreshToken", refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

		res.json({
			success: true,
			data: {
				id: admin._id,
				name: admin.name,
				email: admin.email,
				avatar: admin.avatar,
			},
		});
	} catch (error) {
		console.error("❌ Login error:", error);
		next(error);
	}
};

// ============ REFRESH TOKEN ============
exports.refreshToken = async (req, res, next) => {
	try {
		const refreshToken = req.cookies?.refreshToken;
		if (!refreshToken) {
			return res
				.status(401)
				.json({ success: false, message: "Không có refresh token" });
		}

		const hashedToken = crypto
			.createHash("sha256")
			.update(refreshToken)
			.digest("hex");

		const admin = await Admin.findOne({
			refreshToken: hashedToken,
			refreshTokenExpiresAt: { $gt: new Date() },
		});

		if (!admin) {
			return res
				.status(401)
				.json({ success: false, message: "Refresh token không hợp lệ" });
		}

		const newAccessToken = generateAccessToken(admin);
		const newRefreshToken = generateRefreshToken();
		const newHashedToken = crypto
			.createHash("sha256")
			.update(newRefreshToken)
			.digest("hex");

		admin.refreshToken = newHashedToken;
		admin.refreshTokenExpiresAt = new Date(
			Date.now() + 7 * 24 * 60 * 60 * 1000
		);
		await admin.save();

		// ✅ Set cookie mới
		res.cookie("token", newAccessToken, getCookieOptions(15 * 60 * 1000));
		res.cookie("refreshToken", newRefreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

		res.json({ success: true, message: "Token refreshed" });
	} catch (error) {
		console.error("❌ Refresh token error:", error);
		next(error);
	}
};

// ============ ĐĂNG XUẤT ============
exports.logout = async (req, res) => {
	try {
		if (req.admin?.id) {
			const admin = await Admin.findById(req.admin.id);
			if (admin) {
				admin.refreshToken = null;
				admin.refreshTokenExpiresAt = null;
				await admin.save();
			}
		}
	} catch (error) {
		console.error("❌ Logout error:", error);
	}

	// ✅ Clear cookie với đúng options
	const isProduction = process.env.NODE_ENV === "production";
	const clearOptions = {
		httpOnly: true,
		secure: isProduction,
		sameSite: "lax",
		path: "/",
	};
	if (isProduction) {
		clearOptions.domain = ".trangallure.shop";
	}

	res.clearCookie("token", clearOptions);
	res.clearCookie("refreshToken", clearOptions);
	res.json({ success: true, message: "Đăng xuất thành công" });
};

// ============ LẤY THÔNG TIN ADMIN ============
exports.getMe = async (req, res, next) => {
	try {
		if (!req.admin || !req.admin.id) {
			return res.status(401).json({ success: false, message: "Unauthorized" });
		}
		const admin = await Admin.findById(req.admin.id).select(
			"-password -refreshToken"
		);
		if (!admin) {
			return res
				.status(404)
				.json({ success: false, message: "Admin not found" });
		}
		res.json({ success: true, data: admin });
	} catch (error) {
		console.error("❌ GetMe error:", error);
		next(error);
	}
};