const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, unique: true, sparse: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0, index: true },
    originalPrice: { type: Number, default: null, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    brand: { type: String, trim: true, index: true },
    images: [{ type: String, required: true }],
    stock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
    views: { type: Number, default: 0 },
    seoTitle: { type: String, default: null },
    seoDescription: { type: String, default: null },
    seoKeywords: { type: String, default: null },
  },
  { timestamps: true }
);

// ✅ TẠO TEXT INDEX CHO name (cho phép tìm kiếm $text)
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);