import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '../../api/productApi';
import { Mail, Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await adminApi.login({ email, password });
      console.log('✅ Login response:', response);
      
      if (response.success && response.data) {
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
          console.log('✅ Token saved to localStorage:', response.data.token.substring(0, 20) + '...');
        }
        
        if (response.data.refreshToken) {
          localStorage.setItem('adminRefreshToken', response.data.refreshToken);
        }
        
        toast({
          title: '🎉 Đăng nhập thành công!',
          description: 'Chào mừng bạn trở lại!',
        });
        
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
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-brand-background to-brand-primary/10">
      <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl border border-border/50">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl animate-bounce">🌸</div>
          <h1 className="text-3xl font-bold font-display text-brand-text">
            TrangAllure
          </h1>
          <p className="mt-2 text-muted-foreground">
            Đăng nhập vào trang quản trị
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-brand-text">Email</Label>
            <div className="relative">
              <Mail className="absolute w-4 h-4 text-muted-foreground -translate-y-1/2 left-3 top-1/2" />
              <Input
                id="email"
                type="email"
                placeholder="admin@trangallure.shop"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-brand-text">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute w-4 h-4 text-muted-foreground -translate-y-1/2 left-3 top-1/2" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-brand-primary"
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 text-sm text-destructive border border-destructive/20 rounded-lg bg-destructive/5 animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full text-white bg-brand-primary hover:bg-brand-accent transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang đăng nhập...
              </span>
            ) : (
              'Đăng nhập'
            )}
          </Button>
        </form>

        <div className="mt-6 text-sm text-center text-muted-foreground">
          <p>Liên hệ quản trị viên nếu quên mật khẩu</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;