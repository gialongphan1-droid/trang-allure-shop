import SEO from "@/components/common/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
	getLcpImageUrl,
	optimizeBanner,
	optimizeProduct,
} from "@/utils/imageUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { bannerApi, productApi } from "../api/productApi";
import { fetchCategories } from "../store/slices/categorySlice";

const HomePage = () => {
	const dispatch = useDispatch();
	const { toast } = useToast();

	// ✅ State cho danh mục (từ Redux)
	const categoriesState = useSelector((state) => state.categories);
	const categories = categoriesState?.items || [];

	// ✅ State cho sản phẩm nổi bật (chỉ lấy 4 sản phẩm mới nhất)
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [featuredLoading, setFeaturedLoading] = useState(true);
	const [featuredError, setFeaturedError] = useState(null);
	const FEATURED_LIMIT = 4;

	// ✅ State cho banner
	const [banners, setBanners] = useState([]);
	const [bannerLoading, setBannerLoading] = useState(true);

	// ✅ State cho slider banner
	const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const timerRef = useRef(null);
	const hasFetched = useRef(false);

	// ✅ Fetch sản phẩm nổi bật (chỉ 4 sản phẩm)
	const fetchFeaturedProducts = useCallback(async () => {
		try {
			setFeaturedLoading(true);
			setFeaturedError(null);
			const response = await productApi.getProducts({
				page: 1,
				limit: FEATURED_LIMIT,
				sort: "-createdAt",
			});
			if (response && response.success) {
				setFeaturedProducts(response.data || []);
			} else {
				throw new Error("Không thể tải sản phẩm");
			}
		} catch (error) {
			console.error("❌ Lỗi tải sản phẩm nổi bật:", error);
			setFeaturedError(error.message);
			toast({
				title: "Lỗi tải sản phẩm",
				description: error.message || "Không thể tải sản phẩm",
				variant: "destructive",
			});
		} finally {
			setFeaturedLoading(false);
		}
	}, [toast]);

	// ✅ Fetch banners
	const fetchBanners = async () => {
		try {
			console.log("🔄 Fetching banners...");
			const response = await bannerApi.getBanners();
			console.log("✅ Banners response:", response);

			if (response && response.success && response.data) {
				setBanners(response.data);
			} else if (response && Array.isArray(response)) {
				setBanners(response);
			} else {
				console.warn("⚠️ No banners data found, using empty array");
				setBanners([]);
			}
		} catch (error) {
			console.error("❌ Lỗi tải banner:", error);
			toast({
				title: "Lỗi tải banner",
				description: error.message || "Không thể tải banner",
				variant: "destructive",
			});
			setBanners([]);
		} finally {
			setBannerLoading(false);
		}
	};

	// ✅ Fetch dữ liệu ban đầu
	useEffect(() => {
		if (hasFetched.current) return;
		hasFetched.current = true;

		const fetchData = async () => {
			console.log("🔄 Fetching data sequentially...");
			try {
				await dispatch(fetchCategories());
				await fetchFeaturedProducts();
				await fetchBanners();
			} catch (error) {
				console.error("❌ Error fetching data:", error);
			}
		};

		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dispatch]);

	// ✅ Banner slider
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

	// ✅ Tự động chuyển banner
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

	// ✅ Tính % giảm giá
	const getDiscountPercent = (product) => {
		if (product.originalPrice && product.originalPrice > product.price) {
			return Math.round(
				((product.originalPrice - product.price) / product.originalPrice) * 100,
			);
		}
		return 0;
	};

	const hasBanners = banners.length > 0;

	if (featuredLoading && featuredProducts.length === 0 && bannerLoading) {
		return (
			<div className="container px-4 py-8 mx-auto space-y-8">
				<div className="w-full h-56 bg-gray-200 sm:h-72 md:h-96 rounded-2xl animate-pulse"></div>
				<div className="py-8 space-y-4 text-center">
					<div className="w-64 h-12 mx-auto bg-gray-200 rounded animate-pulse"></div>
					<div className="h-6 mx-auto bg-gray-200 rounded w-80 animate-pulse"></div>
					<div className="flex justify-center gap-8">
						<div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
						<div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
						<div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
						<div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
					</div>
					<div className="w-48 h-8 mx-auto bg-gray-200 rounded animate-pulse"></div>
					<div className="w-40 h-10 mx-auto bg-gray-200 rounded-full animate-pulse"></div>
				</div>
				<div>
					<div className="w-48 h-8 mx-auto mb-8 bg-gray-200 rounded animate-pulse"></div>
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
						{[...Array(4)].map((_, i) => (
							<Card key={i} className="h-full">
								<div className="bg-gray-200 aspect-square skeleton" />
								<CardContent className="p-3 sm:p-4">
									<div className="w-3/4 h-4 bg-gray-200 rounded skeleton" />
									<div className="w-1/2 h-3 mt-2 bg-gray-200 rounded skeleton" />
									<div className="flex gap-2 mt-3">
										<div className="w-1/3 h-5 bg-gray-200 rounded skeleton" />
										<div className="w-1/4 h-5 bg-gray-200 rounded skeleton" />
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</div>
		);
	}

	if (featuredError && featuredProducts.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-destructive">Lỗi tải dữ liệu: {featuredError}</p>
				<Button onClick={() => window.location.reload()} className="mt-4">
					Thử lại
				</Button>
			</div>
		);
	}

	return (
		<>
			<SEO
				pageType="home"
				title="Mỹ phẩm chính hãng - TrangAllure Shop"
				description="TrangAllure Shop - Nơi hội tụ các thương hiệu mỹ phẩm Authentic. Săn ngay ưu đãi sốc, hàng chính hãng 100%!"
				keywords="mỹ phẩm, trang điểm, chăm sóc da, làm đẹp, TrangAllure Shop"
			/>

			<div className="container px-4 py-8 mx-auto space-y-12">
				{/* Banner Slider */}
				{!bannerLoading && hasBanners ? (
					<section className="relative overflow-hidden rounded-2xl group banner-container">
						<div
							className="flex transition-transform duration-700 ease-in-out"
							style={{
								transform: `translateX(-${currentBannerIndex * 100}%)`,
							}}
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
												src={
													index === 0
														? getLcpImageUrl(banner.image)
														: optimizeBanner(banner.image)
												}
												alt={banner.title || "Banner"}
												loading={index === 0 ? "eager" : "lazy"}
												fetchPriority={index === 0 ? "high" : "auto"}
												width={index === 0 ? "1200" : "800"}
												height={index === 0 ? "400" : "400"}
												className="object-cover w-full h-full"
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
												? "w-10 h-4 bg-white shadow-lg"
												: "w-4 h-4 bg-white/50 hover:bg-white/80 hover:scale-110"
										}`}
										disabled={isTransitioning}
										aria-label={`Go to banner ${index + 1}`}
									/>
								))}
							</div>
						)}
					</section>
				) : (
					!bannerLoading && null
				)}

				{/* Brand Header */}
				<section className="py-8 text-center md:py-12">
					<h1 className="text-3xl font-bold tracking-wider uppercase sm:text-4xl md:text-6xl lg:text-7xl font-display text-brand-text">
						TRANG ALLURE
					</h1>
					<p className="mt-2 text-sm tracking-wide text-muted-foreground sm:text-base md:text-xl">
						Order – Săn Sale hàng Authentic từ các thương hiệu nổi tiếng
					</p>

					<div className="flex flex-wrap justify-center gap-3 mt-4 text-sm font-medium text-muted-foreground sm:gap-4 md:gap-8 sm:text-base md:text-lg">
						{categories.length > 0 ? (
							categories.slice(0, 4).map((cat, index) => (
								<span key={cat._id}>
									<Link
										to={`/danh-muc/${cat.slug}`}
										className="transition hover:text-brand-primary"
									>
										{cat.icon} {cat.name.toUpperCase()}
									</Link>
									{index < Math.min(categories.length, 4) - 1 && (
										<span className="hidden ml-3 text-border sm:inline md:ml-8">
											•
										</span>
									)}
								</span>
							))
						) : (
							<span className="text-muted-foreground">
								Đang tải danh mục...
							</span>
						)}
					</div>

					<p className="mt-4 text-base tracking-wide text-muted-foreground sm:text-lg md:text-2xl">
						Hàng đẹp – Giá tốt – Uy tín – Tận tâm
					</p>

					<div className="mt-3">
						<Badge variant="success" className="text-sm px-4 py-1.5">
							🚀 SHIP TOÀN QUỐC
						</Badge>
					</div>
				</section>

				{/* Featured Products - Chỉ hiển thị 4 sản phẩm */}
				<section className="min-h-[400px]">
					<h2 className="mb-6 text-xl font-bold tracking-wide text-center sm:mb-8 sm:text-2xl md:text-3xl font-display text-brand-text">
						SẢN PHẨM NỔI BẬT
					</h2>

					{featuredLoading && featuredProducts.length === 0 ? (
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
							{[...Array(4)].map((_, i) => (
								<Card key={i} className="h-full">
									<div className="bg-gray-200 aspect-square skeleton" />
									<CardContent className="p-3 sm:p-4">
										<div className="w-3/4 h-4 bg-gray-200 rounded skeleton" />
										<div className="w-1/2 h-3 mt-2 bg-gray-200 rounded skeleton" />
										<div className="flex gap-2 mt-3">
											<div className="w-1/3 h-5 bg-gray-200 rounded skeleton" />
											<div className="w-1/4 h-5 bg-gray-200 rounded skeleton" />
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : featuredProducts.length > 0 ? (
						<>
							<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
								{featuredProducts.map((product) => {
									const discountPercent = getDiscountPercent(product);
									return (
										<Link
											key={product._id}
											to={`/san-pham/${product.slug}`}
											className="block h-full"
										>
											<Card className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
												<div className="relative overflow-hidden aspect-square bg-gray-50">
													{product.images?.[0] ? (
														<img
															src={optimizeProduct(product.images[0])}
															alt={product.name}
															loading="lazy"
															className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
															width="400"
															height="400"
															decoding="async"
														/>
													) : (
														<div className="flex items-center justify-center w-full h-full">
															<span className="text-6xl">💄</span>
														</div>
													)}

													{discountPercent > 0 && (
														<Badge
															variant="secondary"
															className="absolute text-xs top-2 right-2"
														>
															-{discountPercent}%
														</Badge>
													)}
												</div>
												<CardContent className="p-3 sm:p-4">
													<h3 className="text-xs font-semibold transition-colors text-brand-text line-clamp-1 sm:text-sm md:text-base hover:text-brand-primary">
														{product.name}
													</h3>
													<p className="text-xs text-muted-foreground sm:text-sm">
														{product.brand || ""}
													</p>
													<div className="flex items-center justify-center gap-1 mt-1 sm:gap-2">
														<span className="text-sm font-bold text-brand-primary sm:text-base md:text-lg">
															{new Intl.NumberFormat("vi-VN").format(
																product.price,
															)}
															đ
														</span>
														{product.originalPrice &&
															product.originalPrice > product.price && (
																<span className="text-xs line-through text-muted-foreground sm:text-sm">
																	{new Intl.NumberFormat("vi-VN").format(
																		product.originalPrice,
																	)}
																	đ
																</span>
															)}
													</div>
												</CardContent>
											</Card>
										</Link>
									);
								})}
							</div>

							{/* ✅ Nút Xem tất cả sản phẩm */}
							<div className="mt-8 text-center sm:mt-10">
								<Link to="/san-pham">
									<Button
										variant="outline"
										className="px-8 py-3 text-sm font-semibold transition-all duration-300 border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white hover:scale-105"
									>
										Xem tất cả sản phẩm
									</Button>
								</Link>
							</div>
						</>
					) : (
						<div className="py-12 text-center">
							<p className="text-muted-foreground">Chưa có sản phẩm nào</p>
						</div>
					)}
				</section>
			</div>
		</>
	);
};

export default HomePage;