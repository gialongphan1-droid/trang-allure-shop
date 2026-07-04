const express = require("express");
const router = express.Router();
const { protect } = require("../../middleware/auth");
const { getStats } = require("../../controllers/admin/dashboardController");

// ✅ Thêm protect
router.get("/stats", protect, getStats);

module.exports = router;
