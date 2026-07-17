import axiosClient from './axiosClient';

export const productApi = {
  // ==================== PUBLIC ====================
  getProducts: (params) => axiosClient.get('/products', { params }),
  getProductBySlug: (slug) => axiosClient.get(`/products/slug/${slug}`),
  getFeatured: (limit = 8) => axiosClient.get(`/products/featured?limit=${limit}`),
  getNew: (limit = 8) => axiosClient.get(`/products/new?limit=${limit}`),
  
  // ==================== ADMIN ====================
  createProduct: (data) => axiosClient.post('/admin/products', data),
  updateProduct: (id, data) => axiosClient.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => axiosClient.delete(`/admin/products/${id}`),
  
  // ✅ Upload ảnh sản phẩm
  uploadProductImages: async (formData) => {
    try {
      const response = await axiosClient.post('/admin/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('❌ Upload images error:', error);
      throw error;
    }
  },
  
  // Upload ảnh đơn (nếu cần)
  uploadProductImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await axiosClient.post('/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('❌ Upload image error:', error);
      throw error;
    }
  },
};

export const categoryApi = {
  getCategories: () => axiosClient.get('/categories'),
  getCategoryBySlug: (slug) => axiosClient.get(`/categories/slug/${slug}`),
  createCategory: (data) => axiosClient.post('/admin/categories', data),
  updateCategory: (id, data) => axiosClient.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => axiosClient.delete(`/admin/categories/${id}`),
};

export const bannerApi = {
  getBanners: () => axiosClient.get('/banners'),
  createBanner: (data) => axiosClient.post('/admin/banners', data),
  updateBanner: (id, data) => axiosClient.put(`/admin/banners/${id}`, data),
  deleteBanner: (id) => axiosClient.delete(`/admin/banners/${id}`),
};

export const adminApi = {
  login: (data) => {
    console.log('📤 Sending login request:', data.email);
    return axiosClient.post('/admin/auth/login', data);
  },
  logout: () => {
    return axiosClient.post('/admin/auth/logout');
  },
  getMe: () => {
    return axiosClient.get('/admin/auth/me');
  },
  getDashboardStats: () => {
    return axiosClient.get('/admin/dashboard/stats');
  },
};