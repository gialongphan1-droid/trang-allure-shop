const express = require('express');
const router = express.Router();
const Product = require('../../models/Product');
const Category = require('../../models/Category');

router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://trangallure.shop';
    const today = new Date().toISOString().split('T')[0];

    // Lấy dữ liệu từ database
    const products = await Product.find({ isActive: true }).select('slug updatedAt');
    const categories = await Category.find({ isActive: true }).select('slug updatedAt');

    // Bắt đầu tạo XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/san-pham</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/lien-he</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

    // Thêm danh mục
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

    // Thêm sản phẩm
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
