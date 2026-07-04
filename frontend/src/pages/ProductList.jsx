import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import SEO from '@/components/common/SEO';
import Skeleton from '@/components/common/Skeleton';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { optimizeProduct } from '@/utils/imageUtils';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, error, pagination } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const timerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [filters.search]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      ...filters,
      limit: 12,
    };
    if (debouncedSearch && debouncedSearch.trim() !== '') {
      params.search = debouncedSearch.trim();
    } else {
      delete params.search;
    }
    if (params.category) {
      params.category = params.category;
    }
    dispatch(fetchProducts(params));
    
    const urlParams = {};
    Object.keys(filters).forEach(key => {
      const val = filters[key];
      if (val && key !== 'page' && key !== 'search') {
        urlParams[key] = val;
      }
      if (key === 'search' && val && val.trim() !== '') {
        urlParams[key] = val;
      }
    });
    if (filters.page > 1) urlParams.page = filters.page;
    setSearchParams(urlParams);
  }, [dispatch, filters.category, filters.sort, filters.page, debouncedSearch]);

  // Kiểm tra còn dữ liệu để tải thêm không
  useEffect(() => {
    if (pagination.totalPages > 0) {
      setHasMore(filters.page < pagination.totalPages);
    }
  }, [pagination.totalPages, filters.page]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const loadMore = () => {
    if (filters.page < pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    } else {
      setHasMore(false);
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="w-64 h-10" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
              <Skeleton className="w-full aspect-square" />
              <Skeleton className="w-3/4 h-4 mt-3" />
              <Skeleton className="w-1/2 h-4 mt-2" />
              <Skeleton className="w-2/3 h-5 mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500 dark:text-red-400">Lỗi tải dữ liệu: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  const pageTitle = filters.search ? `Kết quả tìm kiếm "${filters.search}"` : 'Tất cả sản phẩm';
  const pageDescription = filters.search 
    ? `Tìm thấy ${pagination.total} sản phẩm cho từ khóa "${filters.search}" tại TrangAllure Shop. Mỹ phẩm chính hãng, giá tốt.`
    : 'Khám phá bộ sưu tập mỹ phẩm đa dạng tại TrangAllure Shop. Son môi, kem nền, phấn mắt, mascara, skincare chính hãng.';

  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        url={`https://trangallure.shop/san-pham${window.location.search}`}
        keywords="mỹ phẩm, son môi, kem nền, skincare, trang điểm"
      />
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-brand-text dark:text-white">{pageTitle}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Khám phá bộ sưu tập mỹ phẩm đa dạng của chúng tôi</p>
        </div>

        <div className="p-6 bg-white shadow-sm dark:bg-gray-800 rounded-xl">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-4 top-1/2" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full py-3 pl-12 text-base bg-white border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                />
              </div>
            </div>

            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange('category', value)}
            >
              <SelectTrigger className="py-3 text-base bg-white border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.sort}
              onValueChange={(value) => handleFilterChange('sort', value)}
            >
              <SelectTrigger className="py-3 text-base bg-white border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Mới nhất</SelectItem>
                <SelectItem value="price">Giá thấp đến cao</SelectItem>
                <SelectItem value="-price">Giá cao đến thấp</SelectItem>
                <SelectItem value="name">Tên A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  search: '',
                  category: '',
                  minPrice: '',
                  maxPrice: '',
                  sort: '-createdAt',
                  page: 1,
                });
                setDebouncedSearch('');
                setHasMore(true);
              }}
              className="py-3 text-base transition border-2 border-brand-primary text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white dark:border-brand-primary dark:text-brand-primary dark:hover:bg-brand-primary dark:hover:text-white"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Không tìm thấy sản phẩm nào</p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={loadMore}
            hasMore={hasMore}
            loader={
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
              </div>
            }
            endMessage={
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                Đã tải hết {pagination.total} sản phẩm
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <Link key={product._id} to={`/san-pham/${product.slug}`}>
                  <div className="overflow-hidden transition bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md">
                    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 aspect-square">
                      {product.images?.[0] ? (
                        <img
                          src={optimizeProduct(product.images[0])}
                          alt={product.name}
                          loading="lazy"
                          className="object-cover w-full h-full"
                          width="400"
                          height="400"
                          decoding="async"
                        />
                      ) : (
                        <span className="text-6xl">💄</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-brand-text dark:text-white line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.brand || ''}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-brand-primary">
                          {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through dark:text-gray-500">
                            {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </>
  );
};

export default ProductList;