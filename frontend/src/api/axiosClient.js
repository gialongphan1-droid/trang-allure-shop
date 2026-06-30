import axios from 'axios';
import { cache } from '../utils/cache';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    if (config.method === 'get' && config.cache !== false) {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedData = cache.get(cacheKey);
      if (cachedData) {
        console.log('📦 Cache hit:', config.url);
        config._cacheKey = cacheKey;
        config._cachedData = cachedData;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.config.url);
    if (response.config.method === 'get' && response.config.cache !== false) {
      const cacheKey = response.config._cacheKey || `${response.config.url}${JSON.stringify(response.config.params || {})}`;
      cache.set(cacheKey, response.data, 30000);
    }
    // Trả về response.data để các API function nhận được dữ liệu trực tiếp
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axiosClient.post('/admin/auth/refresh-token');
        return axiosClient(originalRequest);
      } catch (refreshError) {
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401) {
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    console.error('❌ API Error:', error);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;