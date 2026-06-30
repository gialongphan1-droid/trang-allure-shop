const express = require('express');
const router = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/admin/categoryController');
const {
  validateCategory,
  handleValidationErrors,
} = require('../../middleware/validation');

router.post('/', validateCategory, handleValidationErrors, createCategory);
router.put('/:id', validateCategory, handleValidationErrors, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;