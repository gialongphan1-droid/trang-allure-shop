const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload");
const { protect } = require("../../middleware/auth");
const {
	createProduct,
	updateProduct,
	deleteProduct,
} = require("../../controllers/admin/productController");
const {
	validateProduct,
	handleValidationErrors,
} = require("../../middleware/validation");

// Route upload ảnh - KHÔNG GIỚI HẠN
router.post("/upload", protect, upload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: "Không có file ảnh" });
		}
		res.json({ success: true, url: req.file.path });
	} catch (error) {
		console.error("Upload error:", error);
		res.status(500).json({ success: false, message: error.message });
	}
});

// ... các route CRUD giữ nguyên
router.post(
	"/",
	protect,
	validateProduct,
	handleValidationErrors,
	createProduct,
);
router.put(
	"/:id",
	protect,
	validateProduct,
	handleValidationErrors,
	updateProduct,
);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
