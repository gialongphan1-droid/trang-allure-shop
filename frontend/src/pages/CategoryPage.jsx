import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import SEO from '@/components/common/SEO';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import { optimizeProduct } from '@/utils/imageUtils';

// ✅ Mô tả danh mục
const categoryDescriptions = {
  'tui-xach': 'Túi xách nữ chính hãng cao cấp, đa dạng mẫu mã, chất liệu da thật, thiết kế thời trang. Phù hợp đi làm, đi chơi, dự tiệc. Săn ngay ưu đãi sốc tại TrangAllure Shop!',
  'dong-ho': 'Đồng hồ nữ chính hãng, thiết kế sang trọng, nhiều thương hiệu nổi tiếng. Sản phẩm chất lượng cao, giá tốt nhất thị trường. Giao hàng nhanh toàn quốc.',
  'my-pham': 'Mỹ phẩm chính hãng, son môi, kem nền, skincare chất lượng cao. Hàng Authentic 100%, an toàn cho da. Mua sắm uy tín tại TrangAllure Shop.',
  'phu-kien': 'Phụ kiện thời trang nữ, trang sức, kẹp tóc, vòng tay cao cấp. Đa dạng mẫu mã, phong cách, giúp bạn tỏa sáng mỗi ngày.'
};

const categoryKeywords = {
  'tui-xach': 'túi xách, túi xách nữ, túi xách cao cấp, túi xách da thật, phụ kiện thời trang',
  'dong-ho': 'đồng hồ nữ, đồng hồ chính hãng, đồng hồ thời trang, phụ kiện cao cấp, đồng hồ đeo tay',
  'my-pham': 'mỹ phẩm, son môi, kem nền, skincare, mỹ phẩm chính hãng, trang điểm, chăm sóc da',
  'phu-kien': 'phụ kiện thời trang, trang sức nữ, vòng tay, kẹp tóc, phụ kiện cao cấp'
};

const categoryTitles = {
  'tui-xach': 'Túi Xách - Phụ kiện thời trang',
  'dong-ho': 'Đồng Hồ - Phụ kiện thời trang',
  'my-pham': 'Mỹ Phẩm - Mỹ phẩm chính hãng',
  'phu-kien': 'Phụ Kiện - Phụ kiện thời trang nữ'
};

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

  const getCategoryMeta = (slug) => {
    const description = categoryDescriptions[slug] || `${categoryName || 'Danh mục'} chính hãng tại TrangAllure Shop. Giá tốt, chất lượng cao.`;
    const keywords = categoryKeywords[slug] || `${slug}, mỹ phẩm, trang điểm, làm đẹp`;
    const title = categoryTitles[slug] || `${categoryName || 'Danh mục'} - TrangAllure Shop`;
    return { description, keywords, title };
  };

  const meta = getCategoryMeta(slug);

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
      <p className="text-red-500">
        Lỗi tải dữ liệu: {error}
      </p>
      <Button onClick={() => window.location.reload()} className="mt-4">
        Thử lại
      </Button>
    </div>
  );
}

  return (
    <>
      <SEO
        pageType="category"
        title={meta.title}
        description={meta.description}
        url={`https://trangallure.shop/danh-muc/${slug}`}
        keywords={meta.keywords}
        category={{ 
          name: categoryName, 
          description: meta.description,
          slug: slug
        }}
      />

      <div className="space-y-8">
        {/* Category Header - Có mô tả */}
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display text-brand-text
            {categoryName || 'Danh mục sản phẩm'}
          </h1>
          {meta.description && (
            <p className="max-w-3xl mx-auto mt-3 text-base text-gray-600">
              {meta.description}
            </p>
          )}
          <p className="mt-2 text-sm text-gray-500
            {products.length} sản phẩm
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 có sản phẩm nào trong danh mục này</p>
            <Link to="/san-pham">
              <Button className="mt-4">Xem tất cả sản phẩm</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <Link key={product._id} to={`/san-pham/${product.slug}`}>
                <div className="overflow-hidden transition bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md
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
                        {new Intl.NumberFormat('vi-VN').format(product.price)}đ
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through sm:text-sm">
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
