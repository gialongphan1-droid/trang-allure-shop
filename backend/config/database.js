const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // ✅ Tạo index sau khi kết nối
    const Product = mongoose.model('Product');
    
    // Tạo các index
    await Product.collection.createIndex({ slug: 1 }, { unique: true });
    await Product.collection.createIndex({ category: 1 });
    await Product.collection.createIndex({ createdAt: -1 });
    await Product.collection.createIndex({ isActive: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ stock: 1 });
    await Product.collection.createIndex({ views: -1 });
    
    // Index kết hợp
    await Product.collection.createIndex({ 
      isActive: 1, 
      category: 1, 
      createdAt: -1 
    });
    
    console.log('✅ Product indexes created');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;