import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '../../api/productApi';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isDark, toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminApi.login({ email, password });
      console.log('✅ Login response:', response);
      
      // ✅ KIỂM TRA RESPONSE
      if (response.success && response.data) {
        // ✅ LƯU TOKEN VÀO localStorage (QUAN TRỌNG!)
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
          console.log('✅ Token saved to localStorage:', response.data.token.substring(0, 20) + '...');
        }
        
        // ✅ LƯU REFRESH TOKEN NẾU CÓ
        if (response.data.refreshToken) {
          localStorage.setItem('adminRefreshToken', response.data.refreshToken);
        }
        
        toast({
          title: '🎉 Đăng nhập thành công!',
          description: 'Chào mừng bạn trở lại!',
        });
        
        // ✅ CHUYỂN HƯỚNG SAU 1.5s
        setTimeout(() => {
          console.log('🔄 Redirecting to dashboard...');
          navigate('/admin/dashboard', { replace: true });
        }, 1500);
      } else {
        setError('Đăng nhập thất bại, vui lòng thử lại');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Email hoặc mật khẩu không đúng');
      toast({
        title: '❌ Đăng nhập thất bại',
        description: err.message || 'Vui lòng kiểm tra lại thông tin',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 transition-colors bg-background text-foreground">
      <button
        onClick={toggleTheme}
        className="absolute p-2 transition rounded-full top-4 right-4 hover:bg-gray-100
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-gray-600 />
        )}
      </button>

      <div className="w-full max-w-md p-8 transition-colors bg-white shadow-xl rounded-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-display text-brand-text� TrangAllure</h1>
          <p className="mt-2 text-gray-500 nhập vào trang quản trị</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@trangallure.shop"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus:ring-brand-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-brand-primary"
            />
          </div>

          {error && (
            <div className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-white bg-brand-primary hover:bg-brand-accent"
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>

        <div className="mt-6 text-sm text-center text-gray-500
          <p>Liên hệ quản trị viên nếu quên mật khẩu</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
