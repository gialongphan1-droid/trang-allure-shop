import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { adminApi } from '@/api/productApi';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasToken = document.cookie.split(';').some(c => c.trim().startsWith('token='));
        if (!hasToken) {
          setIsAuthenticated(false);
          return;
        }

        await adminApi.getMe();
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;