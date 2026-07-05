const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true // ✅ THÊM index cho tìm kiếm
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true // ✅ THÊM index cho slug
  },
  description: String,
  price: {
    type: Number,
    required: true,
    index: true // ✅ THÊM index cho lọc giá
  },
  originalPrice: Number,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    index: true // ✅ THÊM index cho category
  },
  brand: String,
  images: [String],
  stock: {
    type: Number,
    default: 0,
    index: true // ✅ THÊM index cho stock
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true // ✅ THÊM index cho isActive
  },
  views: {
    type: Number,
    default: 0,
    index: true // ✅ THÊM index cho views
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: String
}, {
  timestamps: true
});

// ✅ THÊM text index cho tìm kiếm
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  brand: 'text' 
}, {
  weights: {
    name: 10,
    brand: 5,
    description: 1
  }
});

// ✅ THÊM compound index cho query phức tạp
productSchema.index({ 
  isActive: 1, 
  category: 1, 
  createdAt: -1 
});

productSchema.index({ 
  isActive: 1, 
  stock: 1, 
  views: -1 
});

module.exports = mongoose.model('Product', productSchema);