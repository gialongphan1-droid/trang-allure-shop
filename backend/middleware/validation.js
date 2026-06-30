const { body, validationResult } = require('express-validator');

exports.validateProduct = [
  body('name').notEmpty().withMessage('Tên sản phẩm là bắt buộc')
    .isLength({ min: 2, max: 100 }).withMessage('Tên sản phẩm từ 2-100 ký tự'),
  body('description').notEmpty().withMessage('Mô tả là bắt buộc')
    .isLength({ min: 10 }).withMessage('Mô tả ít nhất 10 ký tự'),
  body('price').isNumeric().withMessage('Giá phải là số')
    .isFloat({ min: 0 }).withMessage('Giá phải lớn hơn 0'),
  body('discountPrice').optional({ nullable: true }).isNumeric().withMessage('Giá giảm phải là số')
    .isFloat({ min: 0 }).withMessage('Giá giảm phải >= 0'),
  body('category').isMongoId().withMessage('Danh mục không hợp lệ'),
  body('images').isArray({ min: 1 }).withMessage('Cần ít nhất một hình ảnh'),
];

exports.validateCategory = [
  body('name').notEmpty().withMessage('Tên danh mục là bắt buộc')
    .isLength({ min: 2, max: 50 }).withMessage('Tên danh mục từ 2-50 ký tự'),
];

exports.validateAdminLogin = [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Mật khẩu là bắt buộc'),
];

exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};