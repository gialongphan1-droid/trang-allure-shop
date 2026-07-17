import SEO from "@/components/common/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { optimizeProduct } from "@/utils/imageUtils";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchProducts } from "../store/slices/productSlice";

const ProductList = () => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const {
		items: products,
		loading,
		error,
		totalPages,
		currentPage,
		pagination,
	} = useSelector((state) => state.products);

	const [filters, setFilters] = useState({
		search: searchParams.get("search") || "",
		page: parseInt(searchParams.get("page")) || 1,
		limit: 4,
	});

	const [searchInput, setSearchInput] = useState(filters.search);

	// ✅ Lấy currentPage từ nhiều nguồn, ưu tiên: pagination.page, currentPage, filters.page
	const effectiveCurrentPage =
		pagination?.page || currentPage || filters.page || 1;
	// ✅ Lấy totalPages từ pagination hoặc totalPages
	const effectiveTotalPages = pagination?.totalPages || totalPages || 1;

	// Debug log
	console.log("📊 Pagination debug:", {
		currentPage,
		pagination,
		effectiveCurrentPage,
		effectiveTotalPages,
		productsLength: products.length,
	});

	useEffect(() => {
		const params = {};
		if (filters.search) params.search = filters.search;
		if (filters.page > 1) params.page = filters.page;
		setSearchParams(params);
	}, [filters, setSearchParams]);

	useEffect(() => {
		dispatch(
			fetchProducts({
				search: filters.search || undefined,
				page: filters.page,
				limit: filters.limit,
			}),
		);
	}, [dispatch, filters]);

	const handleSearch = (e) => {
		e.preventDefault();
		setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
	};

	const clearSearch = () => {
		setSearchInput("");
		setFilters((prev) => ({ ...prev, search: "", page: 1 }));
	};

	const handlePageChange = (newPage) => {
		console.log(
			`🔄 handlePageChange called with newPage: ${newPage}, effectiveTotalPages: ${effectiveTotalPages}`,
		);
		if (newPage >= 1 && newPage <= effectiveTotalPages) {
			setFilters((prev) => ({ ...prev, page: newPage }));
			console.log(`✅ Page changed to ${newPage}`);
		} else {
			console.warn(
				`⚠️ Invalid page: ${newPage}, effectiveTotalPages: ${effectiveTotalPages}`,
			);
		}
	};

	const formatPrice = (price) => {
		return new Intl.NumberFormat("vi-VN").format(price) + "đ";
	};

	const getDiscountPercent = (product) => {
		if (product.originalPrice && product.originalPrice > product.price) {
			return Math.round(
				((product.originalPrice - product.price) / product.originalPrice) * 100,
			);
		}
		return 0;
	};

	if (loading && products.length === 0) {
		return (
			<div className="container px-4 py-8 mx-auto">
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
		);
	}

	if (error) {
		return (
			<div className="py-12 text-center">
				<p className="text-destructive">Lỗi tải dữ liệu: {error}</p>
				<Button onClick={() => window.location.reload()} className="mt-4">
					Thử lại
				</Button>
			</div>
		);
	}

	const pageTitle = filters.search
		? `Kết quả tìm kiếm "${filters.search}" - TrangAllure Shop`
		: "Tất cả sản phẩm - TrangAllure Shop";

	const pageDescription = filters.search
		? `Tìm thấy ${products.length} sản phẩm cho từ khóa "${filters.search}"`
		: "Khám phá bộ sưu tập sản phẩm chất lượng cao tại TrangAllure Shop";

	return (
		<>
			<SEO
				pageType="product-list"
				title={pageTitle}
				description={pageDescription}
				url={`https://trangallure.shop/san-pham${window.location.search}`}
				keywords="sản phẩm, mỹ phẩm, trang điểm, làm đẹp, TrangAllure"
			/>

			<div className="container px-4 py-8 mx-auto">
				<nav className="flex mb-6 text-sm text-muted-foreground">
					<Link to="/" className="transition-colors hover:text-brand-primary">
						Trang chủ
					</Link>
					<span className="mx-2">/</span>
					<span className="text-foreground">Sản phẩm</span>
				</nav>

				<h1 className="mb-6 text-2xl font-bold md:text-3xl font-display text-brand-text">
					{filters.search
						? `Kết quả tìm kiếm: "${filters.search}"`
						: "Tất cả sản phẩm"}
				</h1>

				<div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
					<form onSubmit={handleSearch} className="flex-1 max-w-md">
						<div className="relative">
							<Search className="absolute w-4 h-4 -translate-y-1/2 text-muted-foreground left-3 top-1/2" />
							<Input
								type="text"
								placeholder="Tìm kiếm sản phẩm..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								className="pl-10 pr-10"
							/>
							{searchInput && (
								<button
									type="button"
									onClick={clearSearch}
									className="absolute transition-colors -translate-y-1/2 text-muted-foreground right-3 top-1/2 hover:text-foreground"
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
					</form>
				</div>

				<p className="mb-4 text-sm text-muted-foreground">
					Hiển thị {products.length} sản phẩm
				</p>

				{products.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">Không tìm thấy sản phẩm nào</p>
						<Button onClick={clearSearch} className="mt-4">
							Xóa bộ lọc
						</Button>
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
							{products.map((product) => {
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
												<h3 className="text-sm font-semibold transition-colors text-brand-text line-clamp-1 sm:text-base hover:text-brand-primary">
													{product.name}
												</h3>
												{product.brand && (
													<p className="text-xs text-muted-foreground sm:text-sm">
														{product.brand}
													</p>
												)}
												<div className="flex items-center gap-2 mt-2">
													<span className="text-sm font-bold sm:text-lg text-brand-primary">
														{formatPrice(product.price)}
													</span>
													{product.originalPrice &&
														product.originalPrice > product.price && (
															<span className="text-xs line-through text-muted-foreground sm:text-sm">
																{formatPrice(product.originalPrice)}
															</span>
														)}
												</div>
											</CardContent>
										</Card>
									</Link>
								);
							})}
						</div>

						{/* Phân trang */}
						{effectiveTotalPages > 1 && (
							<div className="flex items-center justify-center gap-4 mt-8">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(effectiveCurrentPage - 1)}
									disabled={effectiveCurrentPage <= 1}
									className="gap-1"
								>
									<ChevronLeft className="w-4 h-4" />
									Trước
								</Button>

								<span className="text-sm text-muted-foreground">
									Trang {effectiveCurrentPage} / {effectiveTotalPages}
								</span>

								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(effectiveCurrentPage + 1)}
									disabled={effectiveCurrentPage >= effectiveTotalPages}
									className="gap-1"
								>
									Sau
									<ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default ProductList;