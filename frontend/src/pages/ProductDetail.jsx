import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import SEO from '@/components/common/SEO';
import Skeleton from '@/components/common/Skeleton';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productApi.getProductBySlug(slug);
        if (response.success && response.data) {
          setProduct(response.data);
          if (response.data.images?.length > 0) {
            setSelectedImage(0);
          }
          // Fetch related products
          if (response.data.category) {
            const related = await productApi.getProducts({
              category: response.data.category._id,
              limit: 4,
              exclude: response.data._id
            });
            setRelatedProducts(related.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin sản phẩm',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, toast]);

  const nextImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  }, [product]);

  const prevImage = useCallback(() => {
    if (product?.images?.length > 1) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  }, [product]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage]);

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Skeleton className="w-full h-96 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="w-3/4 h-10" />
            <Skeleton className="w-1/2 h-8" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-full h-12" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-600">Không tìm thấy sản phẩm</h2>
        <Link to="/san-pham" className="mt-4 text-brand-primary hover:underline">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <SEO
        title={`${product.name} - TrangAllure Shop`}
        description={product.description?.slice(0, 160) || `Mua ${product.name} chính hãng tại TrangAllure Shop`}
        url={`https://trangallure.shop/san-pham/${product.slug}`}
        image={product.images?.[0]}
        keywords={`${product.name}, ${product.category?.name}, mỹ phẩm, trang điểm`}
      />

      <div className="container px-4 py-8 mx-auto">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-brand-primary">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link to="/san-pham" className="hover:text-brand-primary">Sản phẩm</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                to={`/danh-muc/${product.category.slug}`}
                className="hover:text-brand-primary"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-700 dark:text-gray-300">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden bg-gray-100 rounded-2xl aspect-square dark:bg-gray-800">
              {product.images?.length > 0 ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  width="800"
                  height="800"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-6xl">💄</div>
              )}

              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`overflow-hidden rounded-lg border-2 transition ${
                      selectedImage === index
                        ? 'border-brand-primary'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="object-cover w-full aspect-square"
                      width="100"
                      height="100"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.brand && (
                <span className="text-sm text-brand-primary">{product.brand}</span>
              )}
              <h1 className="text-2xl font-bold md:text-3xl text-brand-text dark:text-white">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div>
                <span className="text-3xl font-bold text-brand-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="ml-3 text-lg text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="ml-2 px-2 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {product.stock !== undefined && (
              <div className="flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            )}

            <div className="prose prose-sm dark:prose-invert">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Mô tả sản phẩm</h3>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button className="flex-1 text-white bg-brand-primary hover:bg-brand-accent">
                Thêm vào giỏ hàng
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 dark:border-gray-600">
                <Heart className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="border-gray-300 dark:border-gray-600">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {product.category && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Danh mục: {' '}
                  <Link
                    to={`/danh-muc/${product.category.slug}`}
                    className="text-brand-primary hover:underline"
                  >
                    {product.category.name}
                  </Link>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-2xl font-bold text-center text-brand-text dark:text-white">
              Sản phẩm liên quan
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {relatedProducts.map((related) => (
                <Link
                  key={related._id}
                  to={`/san-pham/${related.slug}`}
                  className="overflow-hidden transition bg-white border border-gray-200 rounded-xl hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="aspect-square p-4 bg-gray-50 dark:bg-gray-700/50">
                    {related.images?.[0] ? (
                      <img
                        src={related.images[0]}
                        alt={related.name}
                        loading="lazy"
                        className="object-cover w-full h-full"
                        width="400"
                        height="400"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">💄</div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-sm font-medium line-clamp-1 text-brand-text dark:text-white">
                      {related.name}
                    </h3>
                    <p className="text-sm font-bold text-brand-primary">
                      {formatPrice(related.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
