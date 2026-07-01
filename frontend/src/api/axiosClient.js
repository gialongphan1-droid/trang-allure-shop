import axios from 'axios';
import { cache } from '../utils/cache';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue = [];
let refreshError = null;

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Nếu đang refresh và request hiện tại KHÔNG phải là refresh-token
      if (originalRequest.url === '/admin/auth/refresh-token') {
        // Không gọi lại refresh token, chuyển hướng đến login
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh, đợi kết quả
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axiosClient(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosClient.post('/admin/auth/refresh-token');
        // Refresh thành công
        processQueue(null, response.data);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại - chuyển hướng đến login
        processQueue(refreshError, null);
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Nếu đã thử refresh mà vẫn 401, chuyển hướng login
    if (error.response?.status === 401 && originalRequest._retry) {
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }

    console.error('❌ API Error:', error);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;