import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminApi } from '@/api/productApi';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ✅ KIỂM TRA TOKEN TRONG localStorage (không phải cookie)
        const token = localStorage.getItem('adminToken');
        console.log('🔍 Token in localStorage:', token ? '✅ Has token' : '❌ No token');
        
        if (!token) {
          console.log('❌ No token, redirect to login');
          setIsAuthenticated(false);
          return;
        }

        console.log('🔍 Calling getMe API...');
        const response = await adminApi.getMe();
        console.log('🔍 getMe response:', response);
        
        if (response?.success && response?.data) {
          console.log('✅ Authenticated!');
          setIsAuthenticated(true);
        } else {
          console.log('❌ getMe failed');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
      </div>
    );
  }

  console.log('🔍 Final isAuthenticated:', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;
