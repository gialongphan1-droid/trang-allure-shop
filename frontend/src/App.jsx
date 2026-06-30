import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/layout/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBanners from './pages/admin/AdminBanners';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route 
            index 
            element={
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="san-pham" 
            element={
              <ErrorBoundary>
                <ProductList />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="san-pham/:slug" 
            element={
              <ErrorBoundary>
                <ProductDetail />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="danh-muc/:slug" 
            element={
              <ErrorBoundary>
                <CategoryPage />
              </ErrorBoundary>
            } 
          />
          <Route 
            path="lien-he" 
            element={
              <ErrorBoundary>
                <ContactPage />
              </ErrorBoundary>
            } 
          />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="banners" element={<AdminBanners />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;