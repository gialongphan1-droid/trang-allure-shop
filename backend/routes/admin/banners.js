const express = require('express');
const router = express.Router();
const {
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../../controllers/admin/bannerController');

router.post('/', createBanner);
router.put('/:id', updateBanner);
router.delete('/:id', deleteBanner);

module.exports = router;