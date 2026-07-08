import { useEffect, useState } from 'react';
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
import SEO from '@/components/common/SEO';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { optimizeProduct } from '@/utils/imageUtils';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

const ProductList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, error, totalPages, currentPage } = useSelector(
    (state) => state.products
  );
  const { items: categories } = useSelector((state) => state.categories);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
  });

  const [searchInput, setSearchInput] = useState(filters.search);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.sort) params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params);
  }, [filters, setSearchParams]);

  useEffect(() => {
    dispatch(
      fetchProducts({
        search: filters.search || undefined,
        category: filters.category || undefined,
        sort: filters.sort,
        page: filters.page,
        limit: filters.limit,
      })
    );
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters((prev) => ({ ...prev, search: '', page: 1 }));
  };

  const handleCategoryChange = (value) => {
    setFilters((prev) => ({ ...prev, category: value === 'all' ? '' : value, page: 1 }));
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({ ...prev, sort: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (loading && products.length === 0) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="p-4 bg-white shadow-sm rounded-xl">
              <div className="w-full bg-gray-200 rounded-lg aspect-square animate-pulse"></div>
              <div className="w-3/4 h-4 mt-3 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-1/2 h-4 mt-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-2/3 h-5 mt-2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">Lỗi tải dữ liệu: {error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  const pageTitle = filters.search
    ? `Kết quả tìm kiếm "${filters.search}" - TrangAllure Shop`
    : filters.category
    ? `Sản phẩm ${categories.find(c => c.slug === filters.category)?.name || ''} - TrangAllure Shop`
    : 'Tất cả sản phẩm - TrangAllure Shop';

  const pageDescription = filters.search
    ? `Tìm thấy ${products.length} sản phẩm cho từ khóa "${filters.search}"`
    : 'Khám phá bộ sưu tập sản phẩm chất lượng cao tại TrangAllure Shop';

  return (
    <>
      <SEO
        pageType="product-list"
        title={pageTitle}
        description={pageDescription}
        url={`https://trangallure.shop/san-pham${window.location.search}`}
        keywords="sản phẩm, mỹ phẩm, trang điểm, làm đẹp, TrangAllure"
      />

      <div className="container px-4 py-8 mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-brand-primary">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Sản phẩm</span>
        </nav>

        <h1 className="mb-6 text-2xl font-bold md:text-3xl text-brand-text">
          {filters.search
            ? `Kết quả tìm kiếm: "${filters.search}"`
            : filters.category
            ? categories.find(c => c.slug === filters.category)?.name || 'Sản phẩm'
            : 'Tất cả sản phẩm'}
        </h1>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={filters.category || 'all'}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat._id} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-createdAt">Mới nhất</SelectItem>
                <SelectItem value="-price">Giá cao đến thấp</SelectItem>
                <SelectItem value="price">Giá thấp đến cao</SelectItem>
                <SelectItem value="-sold">Bán chạy nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-sm text-gray-500">
          Hiển thị {products.length} sản phẩm
        </p>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            <Button onClick={clearSearch} className="mt-4">
              Xóa bộ lọc
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {products.map((product) => (
                <Link key={product._id} to={`/san-pham/${product.slug}`}>
                  <div className="overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md hover:border-brand-primary/30">
                    <div className="flex items-center justify-center bg-gray-100 aspect-square">
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
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm font-semibold text-brand-text line-clamp-1 sm:text-base">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 sm:text-sm">
                        {product.brand || ''}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold sm:text-lg text-brand-primary">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through sm:text-sm">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="min-w-[36px]"
                        >
                          {page}
                        </Button>
                      );
                    }
                    if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ProductList;