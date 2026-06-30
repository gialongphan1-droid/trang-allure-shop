const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Category = require('../../models/Category');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://trangallure.shop';
    const today = new Date().toISOString().split('T')[0];

    // Lấy tất cả sản phẩm đang hoạt động
    const products = await Product.find({ isActive: true }).select('slug updatedAt');
    // Lấy tất cả danh mục đang hoạt động
    const categories = await Category.find({ isActive: true }).select('slug updatedAt');

    // Tạo XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Trang chủ -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Trang sản phẩm -->
  <url>
    <loc>${baseUrl}/san-pham</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Trang liên hệ -->
  <url>
    <loc>${baseUrl}/lien-he</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Thêm các danh mục
    categories.forEach(cat => {
      const lastmod = cat.updatedAt ? cat.updatedAt.toISOString().split('T')[0] : today;
      xml += `
  <url>
    <loc>${baseUrl}/danh-muc/${cat.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    // Thêm các sản phẩm
    products.forEach(product => {
      const lastmod = product.updatedAt ? product.updatedAt.toISOString().split('T')[0] : today;
      xml += `
  <url>
    <loc>${baseUrl}/san-pham/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('❌ Sitemap error:', error);
    res.status(500).send('Error generating sitemap');
  }
});

module.exports = router;