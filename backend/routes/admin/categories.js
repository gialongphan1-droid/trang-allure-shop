const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const {
	createCategory,
	updateCategory,
	deleteCategory,
} = require("../../controllers/admin/categoryController");

// ✅ Thêm protect vào tất cả routes
router.post("/", protect, createCategory);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

module.exports = router;
