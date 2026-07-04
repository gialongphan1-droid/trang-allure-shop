import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from './components/layout/MainLayout';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';

// ✅ Lazy load các trang (chỉ tải khi cần)
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout'));

// ✅ Component loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
  </div>
);

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <HomePage />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="san-pham" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <ProductList />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="san-pham/:slug" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <ProductDetail />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="danh-muc/:slug" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <CategoryPage />
              </Suspense>
            </ErrorBoundary>
          } />
          <Route path="lien-he" element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <ContactPage />
              </Suspense>
            </ErrorBoundary>
          } />
        </Route>
        
        {/* Admin Login */}
        <Route path="/admin/login" element={
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        } />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={<PageLoader />}>
              <AdminProducts />
            </Suspense>
          } />
          <Route path="categories" element={
            <Suspense fallback={<PageLoader />}>
              <AdminCategories />
            </Suspense>
          } />
          <Route path="banners" element={
            <Suspense fallback={<PageLoader />}>
              <AdminBanners />
            </Suspense>
          } />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;