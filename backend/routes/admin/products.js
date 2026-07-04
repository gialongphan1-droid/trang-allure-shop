const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const {
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../../controllers/admin/productController");

// ✅ Thêm protect vào tất cả routes
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
