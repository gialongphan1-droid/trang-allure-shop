import { optimizeProduct } from "@/utils/imageUtils";
import { memo } from "react";
import { Link } from "react-router-dom";

const ProductCard = memo(({ product }) => {
	return (
		<Link to={`/san-pham/${product.slug}`}>
			<div
				className="overflow-hidden transition bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-brand-primary/30
				style={{ minHeight: "200px" }}
			>
				<div className="flex items-center justify-center bg-gray-50 aspect-square">
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
						<span className="text-4xl sm:text-6xl">💄</span>
					)}
				</div>
				<div className="p-2 text-center sm:p-3">
					<h3 className="text-xs font-medium text-brand-text line-clamp-1 sm:text-sm md:text-base">
						{product.name}
					</h3>
					<p className="text-xs text-gray-500 sm:text-sm">
						{product.brand || ""}
					</p>
					<div className="flex items-center justify-center gap-1 mt-1 sm:gap-2">
						<span className="text-sm font-bold text-brand-primary sm:text-base md:text-lg">
							{new Intl.NumberFormat("vi-VN").format(product.price)}đ
						</span>
						{product.originalPrice && product.originalPrice > product.price && (
							<span className="text-xs text-gray-400 line-through sm:text-sm">
								{new Intl.NumberFormat("vi-VN").format(product.originalPrice)}đ
							</span>
						)}
					</div>
				</div>
			</div>
		</Link>
	);
});

ProductCard.displayName = "ProductCard";

export default ProductCard;