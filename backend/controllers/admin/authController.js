const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const crypto = require('crypto');

// ============ TẠO TOKEN ============
const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } // 15 phút
  );
};

const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString('hex'); // Token ngẫu nhiên
};

// ============ ĐĂNG NHẬP ============
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng' });
    }

    // Cập nhật thông tin đăng nhập
    admin.lastLogin = new Date();
    admin.userAgent = req.headers['user-agent'] || null;
    admin.ipAddress = req.ip || req.connection?.remoteAddress || null;

    // Tạo access token và refresh token
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken();

    // Hash refresh token trước khi lưu vào DB
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    admin.refreshToken = hashedRefreshToken;
    admin.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 ngày
    await admin.save();

    // Set cookie
    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 phút
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

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
    next(error);
  }
};

// ============ REFRESH TOKEN (ROTATION) ============
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Không có refresh token' });
    }

    const hashedToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const admin = await Admin.findOne({
      refreshToken: hashedToken,
      refreshTokenExpiresAt: { $gt: new Date() }
    });

    if (!admin) {
      // Phát hiện token bị đánh cắp hoặc hết hạn
      return res.status(401).json({ success: false, message: 'Refresh token không hợp lệ' });
    }

    // ✅ ROTATION: Tạo token mới, vô hiệu hóa token cũ
    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken();
    const newHashedToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

    admin.refreshToken = newHashedToken;
    admin.refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await admin.save();

    // Set cookie mới
    res.cookie('token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ success: true, message: 'Token refreshed' });
  } catch (error) {
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
    // Bỏ qua lỗi
  }

  res.clearCookie('token');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Đăng xuất thành công' });
};

// ============ LẤY THÔNG TIN ADMIN ============
exports.getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password -refreshToken');
    res.json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};