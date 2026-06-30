const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getNewProducts,
} = require('../../controllers/public/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/slug/:slug', getProductBySlug);

module.exports = router;