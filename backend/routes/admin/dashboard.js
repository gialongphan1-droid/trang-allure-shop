const express = require('express');
const router = express.Router();
const { getStats } = require('../../controllers/admin/dashboardController');

router.get('/stats', getStats);

module.exports = router;