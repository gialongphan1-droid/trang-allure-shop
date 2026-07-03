import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminApi } from '@/api/productApi';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 ProtectedRoute: Checking auth...');
        console.log('🔍 Document cookie:', document.cookie);
        
        const hasToken = document.cookie.split(';').some(c => c.trim().startsWith('token='));
        console.log('🔍 Has token cookie?', hasToken);
        
        if (!hasToken) {
          console.log('❌ No token cookie, redirect to login');
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
        console.error('❌ Error status:', error?.response?.status);
        console.error('❌ Error data:', error?.response?.data);
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