import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Share2, 
  MessageSquare, 
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import SEO from '@/components/common/SEO';
import Skeleton from '@/components/common/Skeleton';
import { optimizeDetail, optimizeThumbnail, optimizeProduct } from '@/utils/imageUtils';

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { toast } = useToast();

  // Thông tin liên hệ - có thể set qua env hoặc hardcode
  const contact = {
    messenger: import.meta.env.VITE_MESSENGER_LINK || 'https://m.me/trangallure.shop',
    zalo: import.meta.env.VITE_ZALO_LINK || 'https://zalo.me/0987654321',
    facebook: import.meta.env.VITE_FACEBOOK_PAGE || 'https://facebook.com/trangallure.shop',
  };

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
        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Không tìm thấy sản phẩm</h2>
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

  const getShareText = () => {
    const price = product.price ? formatPrice(product.price) : '';
    return `🛍️ ${product.name}\n💰 Giá: ${price}\n🔗 Xem chi tiết: https://trangallure.shop/san-pham/${product.slug}`;
  };

  const handleContact = (platform) => {
    const url = `https://trangallure.shop/san-pham/${product.slug}`;
    const text = getShareText();
    let link = '';

    switch (platform) {
      case 'messenger':
        link = `${contact.messenger}?text=${encodeURIComponent(text + '\n' + url)}`;
        break;
      case 'zalo':
        link = `${contact.zalo}?text=${encodeURIComponent(text + '\n' + url)}`;
        break;
      case 'facebook':
        link = `${contact.facebook}?text=${encodeURIComponent(text + '\n' + url)}`;
        break;
      default:
        return;
    }

    window.open(link, '_blank', 'noopener,noreferrer');
  };

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
        <nav className="flex mb-6 text-sm text-gray-500 dark:text-gray-400">
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
                  src={optimizeDetail(product.images[selectedImage])}
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition dark:bg-gray-800/80 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5 dark:text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-md hover:bg-white transition dark:bg-gray-800/80 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-5 h-5 dark:text-white" />
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
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <img
                      src={optimizeThumbnail(img)}
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
                    <span className="ml-3 text-lg text-gray-400 line-through dark:text-gray-500">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="ml-2 px-2 py-1 text-sm font-bold text-white bg-red-500 rounded-full">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Mô tả với scroll */}
            <div className="prose prose-sm dark:prose-invert max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Mô tả sản phẩm</h3>
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </p>
            </div>

            {/* Nút liên hệ đặt hàng */}
            <div className="pt-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="w-full text-white bg-brand-primary hover:bg-brand-accent">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Liên hệ đặt hàng
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleContact('messenger')} className="cursor-pointer">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                    Messenger
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContact('zalo')} className="cursor-pointer">
                    <Send className="w-4 h-4 mr-2 text-blue-600" />
                    Zalo
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleContact('facebook')} className="cursor-pointer">
                    <Share2 className="w-4 h-4 mr-2 text-blue-700" />
                    Facebook
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <p className="mt-2 text-xs text-center text-gray-400 dark:text-gray-500">
                Nhấn để chọn kênh liên hệ đặt hàng
              </p>
            </div>

            {product.category && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Danh mục:{' '}
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
                        src={optimizeProduct(related.images[0])}
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