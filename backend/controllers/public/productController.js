const Product = require('../../models/Product');
const Category = require('../../models/Category');

exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search = '', category, minPrice, maxPrice, brand, sort = '-createdAt', isActive = 'true' } = req.query;
    const query = { isActive: isActive === 'true' };

    if (search) query.$text = { $search: search };
    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (brand) query.brand = brand;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions = {};
    switch (sort) {
      case 'price': sortOptions.price = 1; break;
      case '-price': sortOptions.price = -1; break;
      case 'name': sortOptions.name = 1; break;
      default: sortOptions.createdAt = -1;
    }

    const [products, total] = await Promise.all([
      Product.find(query).populate('category').sort(sortOptions).skip(skip).limit(Number(limit)),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
    });
  } catch (error) { next(error); }
};

exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true }).populate('category');
    if (!product) return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    product.views += 1;
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) { next(error); }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isActive: true }).sort({ views: -1 }).limit(limit).populate('category');
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
};

exports.getNewProducts = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(limit).populate('category');
    res.json({ success: true, data: products });
  } catch (error) { next(error); }
};