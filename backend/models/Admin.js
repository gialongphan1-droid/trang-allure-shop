const mongoose = require('mongoose');

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

// KHÔNG CÓ pre-save ở đây

module.exports = mongoose.model('Admin', adminSchema);