import { memo } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = memo(({ product }) => {
  return (
    <Link to={`/san-pham/${product.slug}`}>
      <div className="overflow-hidden transition bg-white border rounded-xl hover:shadow-md hover:border-brand-primary/30 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 aspect-square p-4">
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
        <div className="p-3 text-center">
          <h3 className="text-sm font-medium text-brand-text dark:text-white line-clamp-1">{product.name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">{product.brand || ''}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-base font-bold text-brand-primary">
              {new Intl.NumberFormat('vi-VN').format(product.price)}đ
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through dark:text-gray-500 dark:text-gray-400 dark:text-gray-500">
                {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
