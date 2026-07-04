import SEO from "@/components/common/SEO";
import Skeleton from "@/components/common/Skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { optimizeBanner, optimizeProduct } from "@/utils/imageUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { bannerApi } from "../api/productApi";
import { fetchCategories } from "../store/slices/categorySlice";
import { fetchProducts } from "../store/slices/productSlice";

const HomePage = () => {
	const dispatch = useDispatch();
	const { toast } = useToast();

	const productsState = useSelector((state) => state.products);
	const categoriesState = useSelector((state) => state.categories);

	const products = productsState?.items || [];
	const loading = productsState?.loading || false;
	const error = productsState?.error || null;

	const categories = categoriesState?.items || [];

	const [banners, setBanners] = useState([]);
	const [bannerLoading, setBannerLoading] = useState(true);
	const hasFetched = useRef(false);

	const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const timerRef = useRef(null);

	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;

		const fetchData = async () => {
			console.log("🔄 Fetching data sequentially...");
			try {
				await dispatch(fetchProducts({ limit: 8, sort: "-createdAt" }));
				await dispatch(fetchCategories());
				await fetchBanners();
			} catch (error) {
				console.error("❌ Error fetching data:", error);
			}
		};

		fetchData();
	}, [dispatch]);

	const fetchBanners = async () => {
		try {
			console.log("🔄 Fetching banners...");
			const response = await bannerApi.getBanners();
			console.log("✅ Banners loaded:", response.data);
			setBanners(response.data || []);
		} catch (error) {
			console.error("❌ Lỗi tải banner:", error);
			toast({
				title: "Lỗi tải banner",
				description: error.message || "Không thể tải banner",
				variant: "destructive",
			});
		} finally {
			setBannerLoading(false);
		}
	};

	const handleNextBanner = useCallback(() => {
		if (isTransitioning || banners.length <= 1) return;

		setIsTransitioning(true);
		setCurrentBannerIndex((prev) => {
			if (prev === banners.length - 1) {
				return 0;
			}
			return prev + 1;
		});

		setTimeout(() => setIsTransitioning(false), 700);
	}, [isTransitioning, banners.length]);

	const handlePrevBanner = useCallback(() => {
		if (isTransitioning || banners.length <= 1) return;

		setIsTransitioning(true);
		setCurrentBannerIndex((prev) => {
			if (prev === 0) {
				return banners.length - 1;
			}
			return prev - 1;
		});

		setTimeout(() => setIsTransitioning(false), 700);
	}, [isTransitioning, banners.length]);

	const goToBanner = useCallback(
		(index) => {
			if (
				isTransitioning ||
				index === currentBannerIndex ||
				banners.length <= 1
			)
				return;

			setIsTransitioning(true);
			setCurrentBannerIndex(index);
			setTimeout(() => setIsTransitioning(false), 700);
		},
		[isTransitioning, currentBannerIndex, banners.length],
	);

	useEffect(() => {
		if (banners.length <= 1) return;

		if (timerRef.current) {
			clearInterval(timerRef.current);
		}

		timerRef.current = setInterval(() => {
			handleNextBanner();
		}, 4000);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [banners.length, handleNextBanner]);

	if (loading) {
		return (
			<div className="space-y-8">
				<div className="w-full h-56 bg-gray-200 dark:bg-gray-700 sm:h-72 md:h-96 rounded-2xl animate-pulse"></div>
				<div className="py-8 space-y-4 text-center">
					<div className="w-64 h-12 mx-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
					<div className="h-6 mx-auto bg-gray-200 rounded dark:bg-gray-700 w-80 animate-pulse"></div>
					<div className="flex justify-center gap-8">
						<div className="w-20 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
						<div className="w-20 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
						<div className="w-20 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
						<div className="w-20 h-6 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
					</div>
					<div className="w-48 h-8 mx-auto bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
					<div className="w-40 h-10 mx-auto bg-gray-200 rounded-full dark:bg-gray-700 animate-pulse"></div>
				</div>
				<div>
					<div className="w-48 h-8 mx-auto mb-8 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{[...Array(8)].map((_, i) => (
							<div
								key={i}
								className="p-4 bg-white shadow-sm dark:bg-gray-800 rounded-xl"
							>
								<Skeleton className="w-full aspect-square" />
								<Skeleton className="w-3/4 h-4 mt-3" />
								<Skeleton className="w-1/2 h-4 mt-2" />
								<Skeleton className="w-2/3 h-5 mt-2" />
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-12 text-center">
				<p className="text-red-500 dark:text-red-400">
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
				title="Trang chủ - Mỹ phẩm chính hãng"
				description="TrangAllure Shop - Cửa hàng mỹ phẩm chính hãng với các sản phẩm son môi, kem nền, skincare chất lượng cao. Mua sắm an toàn, giá tốt."
				url="https://trangallure.shop"
				keywords="mỹ phẩm, son môi, kem nền, skincare, trang điểm, chăm sóc da"
			/>

			<div className="space-y-12">
				{/* Banner Slider */}
				{!bannerLoading && banners.length > 0 ? (
					<section className="relative overflow-hidden rounded-2xl group banner-container">
						<div
							className="flex transition-transform duration-700 ease-in-out"
							style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
						>
							{banners.map((banner, index) => (
								<div key={banner._id} className="flex-shrink-0 min-w-full">
									<a
										href={banner.link || "#"}
										target={
											banner.link?.startsWith("http") ? "_blank" : "_self"
										}
										rel="noopener noreferrer"
										className="block"
									>
										<div className="relative w-full h-full">
											<img
												src={optimizeBanner(banner.image)}
												alt={banner.title || "Banner"}
												loading={index === 0 ? "eager" : "lazy"}
												fetchpriority={index === 0 ? "high" : "auto"}
												className="object-cover w-full h-full"
												width="1200"
												height="400"
												decoding="async"
											/>
											{banner.title && (
												<div className="absolute inset-0 flex items-center justify-center bg-black/30">
													<div className="p-4 text-center text-white">
														<h2 className="text-2xl font-bold md:text-4xl font-display">
															{banner.title}
														</h2>
													</div>
												</div>
											)}
										</div>
									</a>
								</div>
							))}
						</div>

						{banners.length > 1 && (
							<>
								<button
									onClick={handlePrevBanner}
									className="absolute z-10 p-3 text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 left-4 top-1/2 bg-black/40 hover:bg-black/70 group-hover:opacity-100 hover:scale-110"
									disabled={isTransitioning}
									aria-label="Previous banner"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2.5"
											d="M15 19l-7-7 7-7"
										/>
									</svg>
								</button>
								<button
									onClick={handleNextBanner}
									className="absolute z-10 p-3 text-white transition-all duration-300 -translate-y-1/2 rounded-full opacity-0 right-4 top-1/2 bg-black/40 hover:bg-black/70 group-hover:opacity-100 hover:scale-110"
									disabled={isTransitioning}
									aria-label="Next banner"
								>
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2.5"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</>
						)}

						{banners.length > 1 && (
							<div className="absolute z-10 flex gap-3 -translate-x-1/2 bottom-4 left-1/2">
								{banners.map((_, index) => (
									<button
										key={index}
										onClick={() => goToBanner(index)}
										className={`transition-all duration-300 rounded-full ${
											currentBannerIndex === index
												? "w-8 h-3 bg-white shadow-lg"
												: "w-3 h-3 bg-white/50 hover:bg-white/80 hover:scale-110"
										}`}
										disabled={isTransitioning}
										aria-label={`Go to banner ${index + 1}`}
									/>
								))}
							</div>
						)}
					</section>
				) : (
					!bannerLoading && (
						<div className="h-56 bg-gray-200 sm:h-72 md:h-96 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
					)
				)}

				{/* Brand Header - Optimized for CLS */}
				<section
					className="brand-header text-center"
					style={{
						minHeight: "280px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						padding: "32px 0",
					}}
				>
					<h1 className="text-4xl font-bold tracking-wider uppercase md:text-6xl lg:text-7xl text-brand-text dark:text-white">
						TRANG ALLURE
					</h1>
					<p className="mt-3 text-base tracking-wide text-gray-500 dark:text-gray-400 md:text-xl">
						Order – Săn Sale hàng Authentic từ các thương hiệu nổi tiếng
					</p>

					<div
						className="flex flex-wrap justify-center gap-4 mt-6 text-base font-medium text-gray-700 dark:text-gray-300 md:gap-8 md:text-lg"
						style={{ minHeight: "40px" }}
					>
						{categories.length > 0 ? (
							categories.slice(0, 4).map((cat, index) => (
								<span key={cat._id}>
									<Link
										to={`/danh-muc/${cat.slug}`}
										className="transition hover:text-brand-primary dark:hover:text-brand-primary"
									>
										{cat.icon} {cat.name.toUpperCase()}
									</Link>
									{index < Math.min(categories.length, 4) - 1 && (
										<span className="hidden ml-4 text-gray-300 dark:text-gray-600 sm:inline md:ml-8">
											•
										</span>
									)}
								</span>
							))
						) : (
							<span className="text-gray-500 dark:text-gray-400">
								Đang tải danh mục...
							</span>
						)}
					</div>

					<p className="mt-6 text-lg tracking-wide text-gray-600 dark:text-gray-400 md:text-2xl">
						Hàng đẹp – Giá tốt – Uy tín – Tận tâm
					</p>

					<div className="mt-4" style={{ minHeight: "44px" }}>
						<span className="inline-block px-6 py-2 text-base font-semibold rounded-full text-brand-primary bg-brand-primary/20 dark:bg-brand-primary/10 md:text-lg">
							🚀 SHIP TOÀN QUỐC
						</span>
					</div>
				</section>

				{/* Featured Products */}
				<section>
					<h2 className="mb-8 text-2xl font-bold tracking-wide text-center md:text-3xl text-brand-text dark:text-white">
						SẢN PHẨM NỔI BẬT
					</h2>
					{products.length > 0 ? (
						<>
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
								{products.slice(0, 8).map((product) => (
									<Link key={product._id} to={`/san-pham/${product.slug}`}>
										<div className="overflow-hidden transition bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-brand-primary/30 dark:hover:border-brand-primary/30">
											<div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-700/50 aspect-square">
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
											<div className="p-3 text-center">
												<h3 className="text-sm font-medium text-brand-text dark:text-white line-clamp-1 md:text-base">
													{product.name}
												</h3>
												<p className="text-xs text-gray-500 dark:text-gray-400 md:text-sm">
													{product.brand || ""}
												</p>
												<div className="flex items-center justify-center gap-2 mt-1">
													<span className="text-base font-bold text-brand-primary dark:text-brand-primary md:text-lg">
														{new Intl.NumberFormat("vi-VN").format(
															product.price,
														)}
														đ
													</span>
													{product.originalPrice &&
														product.originalPrice > product.price && (
															<span className="text-xs text-gray-400 line-through dark:text-gray-500 md:text-sm">
																{new Intl.NumberFormat("vi-VN").format(
																	product.originalPrice,
																)}
																đ
															</span>
														)}
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
							<div className="mt-10 text-center">
								<Link to="/san-pham">
									<Button
										variant="outline"
										className="px-8 py-3 text-base font-semibold border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white dark:border-brand-primary dark:text-brand-primary dark:hover:bg-brand-primary dark:hover:text-white md:text-lg"
									>
										Xem tất cả sản phẩm
									</Button>
								</Link>
							</div>
						</>
					) : (
						<div className="py-12 text-center">
							<p className="text-gray-500 dark:text-gray-400">
								Chưa có sản phẩm nào
							</p>
						</div>
					)}
				</section>
			</div>
		</>
	);
};

export default HomePage;
