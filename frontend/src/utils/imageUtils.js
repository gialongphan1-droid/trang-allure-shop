/**
 * Tối ưu URL ảnh trên Cloudinary
 * @param {string} url - URL ảnh gốc
 * @param {number} width - Chiều rộng mong muốn
 * @param {number} height - Chiều cao mong muốn
 * @param {string} fit - Cách căn chỉnh (fill, contain, scale)
 * @returns {string} URL đã tối ưu
 */
export const optimizeImage = (url, width = 400, height = 400, fit = 'fill') => {
  if (!url) return '';
  
  // Nếu không phải Cloudinary, trả về URL gốc
  if (!url.includes('cloudinary.com')) return url;
  
  // Thêm params vào URL
  return url.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_${fit},q_auto,f_auto/`
  );
};

/**
 * Tối ưu ảnh banner (kích thước lớn)
 */
export const optimizeBanner = (url) => {
  return optimizeImage(url, 1200, 400);
};

/**
 * Tối ưu ảnh sản phẩm (kích thước trung bình)
 */
export const optimizeProduct = (url) => {
  return optimizeImage(url, 400, 400);
};

/**
 * Tối ưu ảnh thumbnail (kích thước nhỏ)
 */
export const optimizeThumbnail = (url) => {
  return optimizeImage(url, 100, 100);
};

/**
 * Tối ưu ảnh admin (kích thước nhỏ)
 */
export const optimizeAdmin = (url) => {
  return optimizeImage(url, 80, 80);
};

/**
 * Tối ưu ảnh chi tiết sản phẩm (kích thước lớn)
 */
export const optimizeDetail = (url) => {
  return optimizeImage(url, 800, 800);
};
