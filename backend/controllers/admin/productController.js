const Product = require('../../models/Product');
const slugify = require('slugify');

// Tạo sản phẩm mới
exports.createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    if (productData.name) {
      productData.slug = slugify(productData.name, { lower: true, strict: true, locale: 'vi' });
    }
    
    const product = new Product(productData);
    await product.save();
    
    const populated = await Product.findById(product._id).populate('category');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('❌ Create product error:', error);
    next(error);
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }
    
    const updateData = req.body;
    
    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = slugify(updateData.name, { lower: true, strict: true, locale: 'vi' });
    }
    
    Object.assign(product, updateData);
    await product.save();
    
    const updated = await Product.findById(id).populate('category');
    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('❌ Update product error:', error);
    next(error);
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
    }
    
    await product.deleteOne();
    res.json({ success: true, message: 'Xóa sản phẩm thành công' });
  } catch (error) {
    console.error('❌ Delete product error:', error);
    next(error);
  }
};