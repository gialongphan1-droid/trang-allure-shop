const Category = require('../../models/Category');
const Product = require('../../models/Product');
const slugify = require('slugify');

exports.createCategory = async (req, res, next) => {
  try {
    const categoryData = req.body;
    
    // Tạo slug từ name
    if (categoryData.name) {
      categoryData.slug = slugify(categoryData.name, { lower: true, strict: true, locale: 'vi' });
    }
    
    const category = new Category(categoryData);
    await category.save();
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
    }
    
    const updateData = req.body;
    
    // Nếu name thay đổi, cập nhật slug
    if (updateData.name && updateData.name !== category.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true, locale: 'vi' });
    }
    
    Object.assign(category, updateData);
    await category.save();
    
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
    }
    
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Không thể xóa danh mục vì có ${productsCount} sản phẩm đang thuộc danh mục này.`
      });
    }
    
    await category.deleteOne();
    res.json({ success: true, message: 'Xóa danh mục thành công' });
  } catch (error) {
    next(error);
  }
};