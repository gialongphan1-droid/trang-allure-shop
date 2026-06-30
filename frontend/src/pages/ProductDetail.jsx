import SEO from "@/components/common/SEO";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchProductBySlug } from "../store/slices/productSlice";

const ProductDetail = () => {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const {
		currentProduct: product,
		loading,
		error,
	} = useSelector((state) => state.products);

	useEffect(() => {
		console.log("🔍 Slug nhận được:", slug);
		dispatch(fetchProductBySlug(slug));
		window.scrollTo(0, 0);
	}, [dispatch, slug]);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-[60vh]">
				<div className="w-12 h-12 border-t-2 border-b-2 rounded-full animate-spin border-brand-primary"></div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="py-12 text-center">
				<p className="text-red-500 dark:text-red-400">Không tìm thấy sản phẩm</p>
				<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Slug: {slug}</p>
				<Link to="/san-pham">
					<Button className="mt-4">Quay lại danh sách</Button>
				</Link>
			</div>
		);
	}

	return (
		<>
			<SEO
				title={product.name}
				description={product.description?.slice(0, 160)}
				image={product.images?.[0]}
				url={`https://trangallure.shop/san-pham/${product.slug}`}
				product={product}
				keywords={`${product.name}, ${product.brand}, mỹ phẩm, trang điểm`}
			/>

			<div className="space-y-8">
				<div className="text-sm text-gray-500 dark:text-gray-400">
					<Link to="/" className="hover:text-brand-primary dark:hover:text-brand-primary">
						Trang chủ
					</Link>
					{" / "}
					<Link to="/san-pham" className="hover:text-brand-primary dark:hover:text-brand-primary">
						Sản phẩm
					</Link>
					{" / "}
					<span className="text-brand-text dark:text-white">{product.name}</span>
				</div>

				<div className="grid grid-cols-1 gap-8 p-6 bg-white shadow-sm dark:bg-gray-800 md:grid-cols-2 rounded-2xl">
					<div className="space-y-4">
						<div className="overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square rounded-xl">
							{product.images?.[0] ? (
								<img
									src={product.images[0]}
									alt={product.name}
									loading="lazy"
									className="object-cover w-full h-full"
								/>
							) : (
								<div className="flex items-center justify-center w-full h-full text-8xl">
									💄
								</div>
							)}
						</div>
						{product.images?.length > 1 && (
							<div className="grid grid-cols-4 gap-2">
								{product.images.map((img, index) => (
									<div
										key={index}
										className="overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-700 aspect-square"
									>
										<img
											src={img}
											alt={`${product.name} ${index + 1}`}
											loading="lazy"
											className="object-cover w-full h-full"
										/>
									</div>
								))}
							</div>
						)}
					</div>

					<div className="space-y-6">
						<div>
							<h1 className="text-3xl font-bold font-display text-brand-text dark:text-white">
								{product.name}
							</h1>
							{product.brand && (
								<p className="mt-1 text-gray-500 dark:text-gray-400">
									Thương hiệu: {product.brand}
								</p>
							)}
							{product.category && (
								<Link
									to={`/danh-muc/${product.category.slug}`}
									className="text-sm text-brand-primary hover:underline"
								>
									{product.category.icon} {product.category.name}
								</Link>
							)}
						</div>

						<div className="flex items-center gap-3">
							<span className="text-3xl font-bold text-brand-primary">
								{new Intl.NumberFormat("vi-VN").format(product.price)}đ
							</span>
							{product.originalPrice &&
								product.originalPrice > product.price && (
									<span className="text-lg text-gray-400 line-through dark:text-gray-500">
										{new Intl.NumberFormat("vi-VN").format(
											product.originalPrice,
										)}
										đ
									</span>
								)}
						</div>

						<div className="py-4 border-t border-b border-gray-200 dark:border-gray-700">
							<p className="leading-relaxed text-gray-700 dark:text-gray-300">
								{product.description}
							</p>
						</div>

						<div className="space-y-3">
							<p className="text-sm font-medium text-gray-500 dark:text-gray-400">
								📞 Đặt hàng qua:
							</p>
							<div className="flex flex-wrap gap-3">
								<a
									href="https://m.me/trangallure.shop"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
								>
									<MessageCircle className="w-5 h-5" />
									Messenger
								</a>
								<a
									href="https://zalo.me/0905990862"
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-2 px-4 py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
								>
									<Phone className="w-5 h-5" />
									Zalo
								</a>
								<a
									href="tel:0905990862"
									className="flex items-center gap-2 px-4 py-2 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
								>
									<Phone className="w-5 h-5" />
									Gọi ngay
								</a>
							</div>
						</div>

						<div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
							<span className="text-sm text-gray-500 dark:text-gray-400">Chia sẻ:</span>
							<a
								href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-gray-600 transition dark:text-gray-400 hover:text-blue-600"
							>
								<svg
									className="w-5 h-5"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetail;