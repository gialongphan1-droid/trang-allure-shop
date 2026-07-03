const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// ============ CẤU HÌNH COOKIE ============
const getCookieOptions = (maxAge) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: maxAge,
    path: '/',
  };
  // ✅ Nếu production, set domain
  if (isProduction) {
    options.domain = '.vercel.app'; // hoặc domain thật
  }
  return options;
};

exports.protect = async (req, res, next) => {
  console.log('🔐 protect: Checking authorization...');
  console.log('🔐 Cookies:', req.cookies);

  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('🔐 Token from cookie:', token.substring(0,20) + '...');
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔐 Token from header:', token.substring(0,20) + '...');
  }

  if (!token) {
    console.log('❌ No token found');
    return res.status(401).json({ success: false, message: 'Không có token xác thực, vui lòng đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for admin:', decoded.email);
    
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      console.log('❌ Admin not found');
      return res.status(401).json({ success: false, message: 'Admin không tồn tại' });
    }
    
    console.log('✅ Admin authenticated:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn',
        code: 'TOKEN_EXPIRED'
      });
    }
    return res.status(401).json({ success: false, message: 'Token không hợp lệ' });
  }
};