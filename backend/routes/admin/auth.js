const express = require('express');
const router = express.Router();
const {
  login,
  logout,
  getMe,
  refreshToken, // THÊM DÒNG NÀY
} = require('../../controllers/admin/authController');
const { protect } = require('../../middleware/auth');
const {
  validateAdminLogin,
  handleValidationErrors,
} = require('../../middleware/validation');

router.post('/login', validateAdminLogin, handleValidationErrors, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.post('/refresh-token', refreshToken); // THÊM DÒNG NÀY

module.exports = router;