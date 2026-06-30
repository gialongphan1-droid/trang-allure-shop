const Banner = require('../../models/Banner');

exports.createBanner = async (req, res, next) => {
  try {
    const banner = new Banner(req.body);
    await banner.save();
    res.status(201).json({ success: true, data: banner });
  } catch (error) { next(error); }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner không tồn tại' });
    Object.assign(banner, req.body);
    await banner.save();
    res.json({ success: true, data: banner });
  } catch (error) { next(error); }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner không tồn tại' });
    await banner.deleteOne();
    res.json({ success: true, message: 'Xóa banner thành công' });
  } catch (error) { next(error); }
};