const Product = require('../../models/Product');
const Category = require('../../models/Category');

// ✅ Tối ưu getProducts
exports.getProducts = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      sort = '-createdAt', 
      limit = 10, 
      page = 1 
    } = req.query;

    const query = { isActive: true };

    // Lọc theo danh mục
    if (category) {
      query.category = category;
    }

    // Lọc theo giá
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Tìm kiếm
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    // Sắp xếp
    const sortOptions = {};
    if (sort === '-createdAt') sortOptions.createdAt = -1;
    else if (sort === 'price') sortOptions.price = 1;
    else if (sort === '-price') sortOptions.price = -1;
    else if (sort === 'name') sortOptions.name = 1;

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .lean(), // ✅ Thêm .lean() để tăng tốc
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Get products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Tối ưu getProductBySlug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ 
      slug: req.params.slug, 
      isActive: true 
    })
    .populate('category', 'name slug')
    .lean(); // ✅ Thêm .lean()

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Sản phẩm không tồn tại' 
      });
    }

    // Tăng views
    await Product.findByIdAndUpdate(product._id, { 
      $inc: { views: 1 } 
    });

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Get product by slug error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Tối ưu getFeaturedProducts
exports.getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isActive: true, 
      stock: { $gt: 0 } // ✅ Chỉ lấy còn hàng
    })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .lean(); // ✅ Thêm .lean()

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('❌ Get featured products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Tối ưu getNewProducts
exports.getNewProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 8;
    
    const products = await Product.find({ 
      isActive: true, 
      stock: { $gt: 0 } // ✅ Chỉ lấy còn hàng
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean(); // ✅ Thêm .lean()

    res.json({ success: true, data: products });
  } catch (error) {
    console.error('❌ Get new products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};