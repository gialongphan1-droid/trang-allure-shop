const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
} = require('../../controllers/public/categoryController');

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);

module.exports = router;