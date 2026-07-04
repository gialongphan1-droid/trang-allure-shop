import { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/api/productApi';
import { fetchProducts } from '@/store/slices/productSlice';
import { fetchCategories } from '@/store/slices/categorySlice';
import { Package, ShoppingBag, Tag, TrendingUp, ArrowUp, ArrowDown, Image } from 'lucide-react';
import Skeleton from '@/components/common/Skeleton';

// ✅ Lazy load recharts
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));

const ChartLoader = () => (
  <div className="flex items-center justify-center h-[300px]">
    <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { items: products } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // ✅ Fetch tất cả dữ liệu cùng lúc
        const [statsResponse, productsResult, categoriesResult] = await Promise.all([
          adminApi.getDashboardStats().catch(() => ({ data: null })),
          dispatch(fetchProducts({ limit: 10 })).unwrap().catch(() => ({ data: [] })),
          dispatch(fetchCategories()).unwrap().catch(() => ({ data: [] })),
        ]);

        setStats(statsResponse?.data || null);
        
        // ✅ Tạo dữ liệu chart từ stats nếu có
        if (statsResponse?.data?.chartData) {
          setChartData(statsResponse.data.chartData);
        } else {
          // Dữ liệu mẫu nếu chưa có API
          setChartData([
            { name: 'Tháng 1', revenue: 12000000 },
            { name: 'Tháng 2', revenue: 19000000 },
            { name: 'Tháng 3', revenue: 15000000 },
            { name: 'Tháng 4', revenue: 22000000 },
            { name: 'Tháng 5', revenue: 28000000 },
            { name: 'Tháng 6', revenue: 35000000 },
          ]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Lỗi tải dữ liệu',
          description: 'Không thể tải dữ liệu dashboard',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, toast]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    );
  }

  const statsData = [
    {
      title: 'Tổng sản phẩm',
      value: stats?.totalProducts ?? products.length ?? 0,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Tổng danh mục',
      value: stats?.totalCategories ?? categories.length ?? 0,
      icon: Tag,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Tổng banner',
      value: stats?.totalBanners ?? 0,
      icon: Image,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Doanh thu',
      value: stats?.totalRevenue 
        ? new Intl.NumberFormat('vi-VN').format(stats.totalRevenue) + 'đ' 
        : '0đ',
      icon: TrendingUp,
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  const totalRevenue = stats?.totalRevenue || 0;
  const previousRevenue = stats?.previousRevenue || totalRevenue * 0.8;
  const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index} className="overflow-hidden transition hover:shadow-md dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-brand-text dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-brand-text dark:text-white">Doanh thu theo tháng</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-brand-primary">
                {new Intl.NumberFormat('vi-VN').format(totalRevenue)}đ
              </span>
              <span className={`flex items-center text-sm ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {revenueChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {Math.abs(revenueChange).toFixed(1)}%
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ChartLoader />}>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + 'đ'}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#5BB8A6" 
                    strokeWidth={2}
                    dot={{ fill: '#5BB8A6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Suspense>
        </CardContent>
      </Card>

      {/* Recent Products */}
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-brand-text dark:text-white">Sản phẩm gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <p className="py-4 text-center text-gray-500 dark:text-gray-400">Chưa có sản phẩm nào</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Tên sản phẩm</th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Giá</th>
                    <th className="px-4 py-2 text-left text-gray-500 dark:text-gray-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 5).map((product) => (
                    <tr key={product._id} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="px-4 py-3 font-medium text-brand-text dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-brand-primary">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          product.isActive 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {product.isActive ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
