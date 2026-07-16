import { optimizeProduct } from "@/utils/imageUtils";
import { memo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProductCard = memo(({ product }) => {
  const { name, price, originalPrice, images, brand, slug, stock, discount } = product;
  
  // Tính % giảm giá
  const discountPercent = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : discount || 0;
  
  // Kiểm tra còn hàng
  const isInStock = stock !== undefined ? stock > 0 : true;
  const isLowStock = stock !== undefined && stock > 0 && stock < 5;

  return (
    <Link to={`/san-pham/${slug}`} className="block h-full">
      <Card 
        className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
      >
        {/* Hình ảnh sản phẩm */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          {images?.[0] ? (
            <img
              src={optimizeProduct(images[0])}
              alt={name}
              loading="lazy"
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              width="400"
              height="400"
              decoding="async"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-4xl sm:text-6xl">💄</span>
            </div>
          )}

          {/* Badge góc trên */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {discountPercent > 0 && (
              <Badge variant="secondary" className="text-xs">
                -{discountPercent}%
              </Badge>
            )}
            {!isInStock && (
              <Badge variant="destructive" className="text-xs">
                Hết hàng
              </Badge>
            )}
            {isLowStock && isInStock && (
              <Badge variant="warning" className="text-xs">
                Sắp hết
              </Badge>
            )}
          </div>
        </div>

        {/* Nội dung sản phẩm */}
        <CardContent className="p-3 sm:p-4">
          {/* Tên sản phẩm */}
          <h3 className="text-xs font-semibold text-brand-text line-clamp-2 sm:text-sm md:text-base hover:text-brand-primary transition-colors">
            {name}
          </h3>
          
          {/* Thương hiệu */}
          {brand && (
            <p className="text-xs text-muted-foreground mt-0.5 sm:text-sm">
              {brand}
            </p>
          )}

          {/* Giá */}
          <div className="flex items-center justify-center gap-1 mt-2 sm:gap-2">
            <span className="text-sm font-bold text-brand-primary sm:text-base md:text-lg">
              {new Intl.NumberFormat("vi-VN").format(price)}đ
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-muted-foreground line-through sm:text-sm">
                {new Intl.NumberFormat("vi-VN").format(originalPrice)}đ
              </span>
            )}
          </div>

          {/* Trạng thái tồn kho */}
          {isInStock && stock !== undefined && (
            <p className="text-xs text-muted-foreground mt-1">
              Còn {stock} sản phẩm
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;