const express = require('express');
const router = express.Router();
const { getActiveBanners } = require('../../controllers/public/bannerController');

router.get('/', getActiveBanners);

module.exports = router;