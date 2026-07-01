const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: null },
    lastLogin: { type: Date, default: null },
    refreshToken: { type: String, select: false, default: null },
    refreshTokenExpiresAt: { type: Date, default: null },
    userAgent: { type: String, default: null },
    ipAddress: { type: String, default: null },
  },
  { timestamps: true }
);

// ✅ SỬA LỖI: pre('save') HOOK
adminSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);