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

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
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

    // ✅ Nếu chính refresh-token bị 401 → KHÔNG RETRY, chuyển login
    if (error.response?.status === 401 && originalRequest.url === '/admin/auth/refresh-token') {
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
      return Promise.reject(error);
    }

    // ✅ Xử lý các request khác bị 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
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
        await axiosClient.post('/admin/auth/refresh-token');
        processQueue(null);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    console.error('❌ API Error:', error);
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;