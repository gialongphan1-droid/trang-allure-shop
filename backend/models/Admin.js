const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: null },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

// ĐÃ XÓA HOÀN TOÀN HOOK pre('save') GÂY LỖI

// Phương thức so sánh mật khẩu vẫn được giữ nguyên
adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);