const Banner = require('../../models/Banner');

exports.getActiveBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ position: 1 });
    res.json({ success: true, data: banners });
  } catch (error) { next(error); }
};