import { Helmet } from "react-helmet-async";

const SEO = ({
	title,
	description,
	image,
	url,
	product,
	category,
	keywords,
	pageType = "website", // 'home', 'category', 'product', 'blog'
	publishedTime,
	modifiedTime,
	ratingValue,
	ratingCount,
	priceCurrency = "VND",
}) => {
	const siteName = "TrangAllure Shop";
	const siteUrl = "https://trangallure.shop";
	const defaultImage = `${siteUrl}/og-image.jpg`;

	// ✅ SLOGAN 1: Meta Title
	const getPageTitle = () => {
		if (product && product.name) {
			return `${product.name} | ${siteName}`;
		}
		if (category) {
			return `${category.name} - Mỹ phẩm chính hãng | ${siteName}`;
		}
		if (pageType === "home") {
			return "TRANG ALLURE - Mỹ phẩm chính hãng, săn sale mỗi ngày";
		}
		if (pageType === "blog") {
			return `${title} | ${siteName}`;
		}
		return title ? `${title} | ${siteName}` : siteName;
	};

	// ✅ SLOGAN 2: Meta Description
	const getPageDescription = () => {
		if (product && product.name) {
			return `Mua ${product.name} chính hãng giá ${new Intl.NumberFormat("vi-VN").format(product.price)}đ tại TrangAllure Shop. ${product.brand ? `Thương hiệu ${product.brand}.` : ""} Giao hàng nhanh toàn quốc.`;
		}
		if (category) {
			return `Khám phá bộ sưu tập ${category.name} tại TrangAllure Shop. ${category.description || "Mỹ phẩm chính hãng, chất lượng cao, giá tốt nhất thị trường."}`;
		}
		if (pageType === "home") {
			return "TRANG ALLURE - Nơi hội tụ các thương hiệu mỹ phẩm Authentic. Săn ngay ưu đãi sốc, hàng chính hãng 100%!";
		}
		if (pageType === "blog") {
			return (
				description ||
				`Bài viết mới nhất tại TrangAllure Shop về mỹ phẩm và làm đẹp.`
			);
		}
		return (
			description ||
			"TrangAllure Shop - Mỹ phẩm chính hãng, chất lượng cao, giá tốt."
		);
	};

	// ✅ Keywords tự động theo loại trang
	const getPageKeywords = () => {
		if (product && product.name) {
			const baseKeywords = [
				"mỹ phẩm chính hãng",
				product.name,
				product.brand || "",
			];
			return [...baseKeywords, ...(keywords?.split(",") || [])]
				.filter(Boolean)
				.join(", ");
		}
		if (category) {
			return `${category.name}, mỹ phẩm ${category.name}, ${category.name} chính hãng, trang điểm, làm đẹp`;
		}
		if (pageType === "home") {
			return "mỹ phẩm chính hãng, son môi, kem nền, skincare, trang điểm, chăm sóc da, sale mỹ phẩm";
		}
		if (pageType === "blog") {
			return keywords || "mỹ phẩm, làm đẹp, chăm sóc da, trang điểm";
		}
		return (
			keywords ||
			"mỹ phẩm chính hãng, son môi, kem nền, skincare, trang điểm, chăm sóc da"
		);
	};

	const pageTitle = getPageTitle();
	const pageDescription = getPageDescription();
	const pageImage = image
		? image.startsWith("http")
			? image
			: `${siteUrl}${image}`
		: defaultImage;
	const pageUrl = url || siteUrl;
	const pageKeywords = getPageKeywords();

	// ✅ Breadcrumb Schema
	const getBreadcrumbSchema = () => {
		const breadcrumbItems = [
			{ name: "Trang chủ", item: siteUrl }
		];

		// Nếu là trang danh mục
		if (category && category.name) {
			breadcrumbItems.push({
				name: category.name,
				item: `${siteUrl}/danh-muc/${category.slug}`,
			});
		}

		// Nếu là trang sản phẩm
		if (product && product.name) {
			if (product.category && product.category.name) {
				breadcrumbItems.push({
					name: product.category.name,
					item: `${siteUrl}/danh-muc/${product.category.slug}`,
				});
			}
			breadcrumbItems.push({
				name: product.name,
				item: `${siteUrl}/san-pham/${product.slug}`,
			});
		}

		// Nếu là blog
		if (pageType === "blog" && title) {
			breadcrumbItems.push({
				name: "Blog",
				item: `${siteUrl}/blog`,
			});
			breadcrumbItems.push({
				name: title,
				item: pageUrl,
			});
		}

		return {
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			"itemListElement": breadcrumbItems.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.name,
				item: item.item,
			})),
		};
	};

	// ✅ Schema động cho các loại trang
	const getSchema = () => {
		let mainSchema = {};

		// Schema cho Product
		if (product && product.name) {
			mainSchema = {
				"@context": "https://schema.org",
				"@type": "Product",
				name: product.name,
				description: product.description || pageDescription,
				image: product.images?.[0] || defaultImage,
				brand: {
					"@type": "Brand",
					name: product.brand || "TrangAllure",
				},
				offers: {
					"@type": "Offer",
					price: product.price,
					priceCurrency: priceCurrency,
					availability:
						product.stock > 0
							? "https://schema.org/InStock"
							: "https://schema.org/OutOfStock",
					url: pageUrl,
				},
				...(ratingValue &&
					ratingCount && {
						aggregateRating: {
							"@type": "AggregateRating",
							ratingValue: ratingValue,
							ratingCount: ratingCount,
							bestRating: "5",
							worstRating: "1",
						},
					}),
			};
		}
		// Schema cho Category
		else if (category && category.name) {
			mainSchema = {
				"@context": "https://schema.org",
				"@type": "CollectionPage",
				name: category.name,
				description:
					category.description ||
					`Khám phá bộ sưu tập ${category.name} tại TrangAllure Shop.`,
				url: pageUrl,
				about: {
					"@type": "Thing",
					name: category.name,
				},
			};
		}
		// Schema cho Blog/Article
		else if (pageType === "blog" && title) {
			mainSchema = {
				"@context": "https://schema.org",
				"@type": "Article",
				headline: title,
				description: description || pageDescription,
				image: pageImage,
				url: pageUrl,
				publisher: {
					"@type": "Organization",
					name: siteName,
				},
				...(publishedTime && { datePublished: publishedTime }),
				...(modifiedTime && { dateModified: modifiedTime }),
			};
		}
		// Schema mặc định cho WebSite
		else {
			mainSchema = {
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: siteName,
				url: siteUrl,
				potentialAction: {
					"@type": "SearchAction",
					target: `${siteUrl}/san-pham?search={search_term_string}`,
					"query-input": "required name=search_term_string",
				},
			};
		}

		// ✅ Gộp BreadcrumbSchema
		const breadcrumbSchema = getBreadcrumbSchema();

		// Nếu mainSchema có dữ liệu, thêm breadcrumb vào
		return {
			...mainSchema,
			// Breadcrumb riêng cho trang chủ (không cần)
			...(pageType !== "home" && { breadcrumb: breadcrumbSchema }),
		};
	};

	const schema = getSchema();

	return (
		<Helmet>
			{/* ===== CƠ BẢN ===== */}
			<title>{pageTitle}</title>
			<meta name="description" content={pageDescription} />
			<meta name="keywords" content={pageKeywords} />

			{/* ✅ Canonical URL - LUÔN LÀ https://trangallure.shop/ */}
			<link
				rel="canonical"
				href={`${siteUrl}${pageUrl === "/" ? "" : pageUrl}`}
			/>

			{/* ===== OPEN GRAPH (Facebook, Zalo, LinkedIn, etc.) ===== */}
			<meta property="og:title" content={pageTitle} />
			<meta property="og:description" content={pageDescription} />
			<meta property="og:image" content={pageImage} />
			<meta
				property="og:url"
				content={`${siteUrl}${pageUrl === "/" ? "" : pageUrl}`}
			/>
			<meta
				property="og:type"
				content={
					product && product.name
						? "product"
						: pageType === "blog"
							? "article"
							: "website"
				}
			/>
			<meta property="og:site_name" content={siteName} />
			<meta property="og:locale" content="vi_VN" />

			{product && product.name && (
				<>
					<meta property="og:price:amount" content={product.price} />
					<meta property="og:price:currency" content={priceCurrency} />
					<meta
						property="og:availability"
						content={product.stock > 0 ? "instock" : "out of stock"}
					/>
				</>
			)}
			{publishedTime && (
				<meta property="article:published_time" content={publishedTime} />
			)}
			{modifiedTime && (
				<meta property="article:modified_time" content={modifiedTime} />
			)}

			{/* ===== TWITTER CARD ===== */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={pageTitle} />
			<meta name="twitter:description" content={pageDescription} />
			<meta name="twitter:image" content={pageImage} />

			{/* ===== DỮ LIỆU CÓ CẤU TRÚC (JSON-LD) ===== */}
			<script type="application/ld+json">{JSON.stringify(schema)}</script>
		</Helmet>
	);
};

export default SEO;