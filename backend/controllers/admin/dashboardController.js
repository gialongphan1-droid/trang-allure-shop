const Product = require('../../models/Product');
const Category = require('../../models/Category');

exports.getStats = async (req, res, next) => {
  try {
    const [totalProducts, totalCategories, totalViews, activeProducts] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Product.countDocuments({ isActive: true }),
    ]);
    res.json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalViews: totalViews[0]?.total || 0,
        activeProducts,
      },
    });
  } catch (error) { next(error); }
};