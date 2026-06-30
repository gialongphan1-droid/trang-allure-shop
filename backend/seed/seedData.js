require('dotenv').config();
const connectDB = require('../config/database');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Banner = require('../models/Banner');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Xóa dữ liệu cũ
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    console.log('🗑️ Đã xóa dữ liệu cũ');

    // Tạo Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@trangallure.shop';
    const adminPassword = process.env.ADMIN_PASSWORD || 'TrangAllure@2026';
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const admin = await Admin.create({
      name: 'Admin TrangAllure',
      email: adminEmail,
      password: hashedPassword,
    });
    console.log('✅ Admin created:', admin.email);

    // Tạo danh mục với slug
    const categoryData = [
      { name: 'Son môi', description: 'Các dòng son môi các thương hiệu', icon: '💄' },
      { name: 'Kem nền', description: 'Kem nền, BB cream, CC cream', icon: '🧴' },
      { name: 'Phấn mắt', description: 'Bảng phấn mắt các màu', icon: '👁️' },
      { name: 'Mascara', description: 'Mascara chống nước, dày mi', icon: '👀' },
      { name: 'Chăm sóc da', description: 'Sữa rửa mặt, toner, kem dưỡng', icon: '🧖' },
      { name: 'Nước hoa', description: 'Nước hoa nam, nữ các dòng', icon: '🌸' },
    ];
    
    // Thêm slug cho từng danh mục
    const categoriesWithSlug = categoryData.map(cat => ({
      ...cat,
      slug: slugify(cat.name, { lower: true, strict: true, locale: 'vi' }),
      isActive: true
    }));
    
    const categories = await Category.insertMany(categoriesWithSlug);
    console.log(`✅ Categories created: ${categories.length}`);

    // Tạo sản phẩm mẫu với slug
    const sampleProducts = [
      {
        name: 'Son môi lì siêu bền 3CE Velvet Lip Tint',
        slug: slugify('Son môi lì siêu bền 3CE Velvet Lip Tint', { lower: true, strict: true, locale: 'vi' }),
        description: 'Son môi lì với công thức mịn màng, lên màu chuẩn, giữ màu lâu trôi. Chứa dầu dưỡng giúp môi mềm mại không bị khô.',
        price: 350000,
        discountPrice: 280000,
        category: categories[0]._id,
        brand: '3CE',
        images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'],
        stock: 50,
        isActive: true,
      },
      {
        name: 'Kem nền lâu trôi Maybelline Fit Me',
        slug: slugify('Kem nền lâu trôi Maybelline Fit Me', { lower: true, strict: true, locale: 'vi' }),
        description: 'Kem nền dạng lỏng, che phủ tốt, kiềm dầu, cho làn da mịn màng tự nhiên.',
        price: 220000,
        discountPrice: null,
        category: categories[1]._id,
        brand: 'Maybelline',
        images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=800'],
        stock: 30,
        isActive: true,
      },
      {
        name: 'Bảng phấn mắt 12 màu Urban Decay Naked',
        slug: slugify('Bảng phấn mắt 12 màu Urban Decay Naked', { lower: true, strict: true, locale: 'vi' }),
        description: 'Bảng phấn mắt với 12 gam màu từ trung tính đến ánh kim, lên màu chuẩn, bền màu suốt cả ngày.',
        price: 890000,
        discountPrice: 750000,
        category: categories[2]._id,
        brand: 'Urban Decay',
        images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'],
        stock: 20,
        isActive: true,
      },
    ];
    
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Products created: ${products.length}`);

    // Tạo banner
    const banners = await Banner.insertMany([
      { 
        title: 'Chào hè rực rỡ - Giảm đến 20%', 
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200', 
        link: '/san-pham', 
        position: 1, 
        isActive: true 
      },
      { 
        title: 'Son môi chính hãng - Giá tốt', 
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200', 
        link: '/danh-muc/son-moi', 
        position: 2, 
        isActive: true 
      },
    ]);
    console.log(`✅ Banners created: ${banners.length}`);

    console.log('🎉 Seed dữ liệu thành công!');
    console.log('📝 Thông tin đăng nhập Admin:');
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log('🔗 Admin URL: http://localhost:5000/api/admin/auth/login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed thất bại:', error.message);
    console.error('📋 Chi tiết lỗi:', error.stack);
    process.exit(1);
  }
};

seedDatabase();