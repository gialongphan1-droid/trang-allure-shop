const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, unique: true, index: true }, // Bỏ required
    description: { type: String, default: null },
    icon: { type: String, default: null },
    isActive: { type: Boolean, default: true, index: true },
    seoTitle: { type: String, default: null },
    seoDescription: { type: String, default: null },
  },
  { timestamps: true }
);

// KHÔNG CÓ pre('save') ở đây

module.exports = mongoose.model('Category', categorySchema);