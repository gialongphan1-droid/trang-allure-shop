const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({ success: false, message: `${field} đã tồn tại. Vui lòng sử dụng giá trị khác.` });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: 'Không tìm thấy tài nguyên' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.message || 'Lỗi server nội bộ' });
};

module.exports = errorHandler;