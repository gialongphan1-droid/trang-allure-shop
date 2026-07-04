const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const {
	createBanner,
	updateBanner,
	deleteBanner,
} = require("../../controllers/admin/bannerController");

// ✅ Thêm protect vào tất cả routes
router.post("/", protect, createBanner);
router.put("/:id", protect, updateBanner);
router.delete("/:id", protect, deleteBanner);

module.exports = router;
