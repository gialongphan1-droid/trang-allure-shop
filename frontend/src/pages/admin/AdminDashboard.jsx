import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Layers, Eye, ShoppingBag } from 'lucide-react';
import { adminApi, productApi } from '../../api/productApi';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalViews: 0,
    activeProducts: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const statsResponse = await adminApi.getDashboardStats();
        setStats(statsResponse.data);
        
        let products = [];
        try {
          const productsResponse = await productApi.getProducts({ limit: 100 });
          products = productsResponse.data || [];
        } catch (productError) {
          console.error('❌ Lỗi lấy sản phẩm:', productError);
          products = [];
        }
        
        const monthNames = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          monthNames.push(date.toLocaleString('vi', { month: 'short' }));
        }
        
        const monthMap = {};
        monthNames.forEach(name => {
          monthMap[name] = { name, views: 0, products: 0 };
        });
        
        products.forEach(product => {
          if (product.createdAt) {
            const date = new Date(product.createdAt);
            const monthKey = date.toLocaleString('vi', { month: 'short' });
            if (monthMap[monthKey]) {
              monthMap[monthKey].views += product.views || 0;
              monthMap[monthKey].products += 1;
            }
          }
        });
        
        setChartData(Object.values(monthMap));
        
        const categoryMap = {};
        products.forEach(product => {
          if (product.category?.name) {
            const catName = product.category.name;
            categoryMap[catName] = (categoryMap[catName] || 0) + 1;
          }
        });
        
        const pieData = Object.keys(categoryMap).map(name => ({
          name,
          value: categoryMap[name],
        }));
        
        setPieData(pieData.length > 0 ? pieData : [{ name: 'Chưa có dữ liệu', value: 1 }]);
        
      } catch (error) {
        console.error('❌ Lỗi fetch dashboard:', error);
        setError(error.message || 'Có lỗi xảy ra');
        toast({
          title: '❌ Lỗi',
          description: error.message || 'Không thể tải dữ liệu dashboard',
          variant: 'destructive',
        });
        if (error.status === 401) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  const COLORS = ['#98D8C8', '#FFB7C5', '#7BC6B4', '#E6C9E3', '#F9A8D4'];

  const statCards = [
    { icon: Package, label: 'Tổng sản phẩm', value: stats.totalProducts, color: 'bg-blue-500' },
    { icon: Layers, label: 'Danh mục', value: stats.totalCategories, color: 'bg-green-500' },
    { icon: Eye, label: 'Tổng lượt xem', value: stats.totalViews, color: 'bg-purple-500' },
    { icon: ShoppingBag, label: 'Đang bán', value: stats.activeProducts, color: 'bg-pink-500' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 dark:text-red-400">Lỗi tải dữ liệu: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 mt-4 text-white rounded-lg bg-brand-primary hover:bg-brand-accent"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-brand-text dark:text-white">📊 Dashboard</h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">Tổng quan về cửa hàng của bạn</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </CardTitle>
              <div className={`${stat.color} p-2 rounded-full text-white`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">📈 Lượt xem theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                  <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                  <Bar dataKey="views" fill="#98D8C8" name="Lượt xem" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">📊 Phân bố sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">📦 Sản phẩm mới theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#F9FAFB' }} />
                  <Legend wrapperStyle={{ color: '#9CA3AF' }} />
                  <Line type="monotone" dataKey="products" stroke="#FFB7C5" name="Sản phẩm mới" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;