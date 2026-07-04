import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import SEO from '@/components/common/SEO';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';

const CategoryPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const cat = categories.find(c => c.slug === slug);
    if (cat) {
      setCategoryName(cat.name);
    }
    dispatch(fetchProducts({ category: slug, limit: 20 }));
  }, [dispatch, slug, categories]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

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
        <Button onClick={() => window.location.reload()} className="mt-4">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={categoryName ? `${categoryName} - TrangAllure Shop` : 'Danh mục sản phẩm'}
        description={`Mua ${categoryName} chính hãng tại TrangAllure Shop. Giá tốt, chất lượng cao.`}
        url={`https://trangallure.shop/danh-muc/${slug}`}
        keywords={`${categoryName}, mỹ phẩm, trang điểm, chăm sóc da`}
      />
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-brand-text dark:text-white">
            {categoryName || 'Danh mục sản phẩm'}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400 dark:text-gray-500">
            {products.length} sản phẩm
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Chưa có sản phẩm nào trong danh mục này</p>
            <Link to="/san-pham">
              <Button className="mt-4">Xem tất cả sản phẩm</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product._id} to={`/san-pham/${product.slug}`}>
                <div className="overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
                  <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700/50 aspect-square">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
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
                    <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">{product.brand || ''}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-brand-primary">
                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
                          {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
