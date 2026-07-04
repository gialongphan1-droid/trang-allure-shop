import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  image,
  url,
  product,
  category,
  keywords,
  pageType = 'website', // 'home', 'category', 'product', 'blog'
  publishedTime,
  modifiedTime,
  ratingValue,
  ratingCount,
  priceCurrency = 'VND',
}) => {
  const siteName = 'TrangAllure Shop';
  const siteUrl = 'https://trangallure.shop';
  const defaultImage = `${siteUrl}/og-image.jpg`;

  // ✅ SLOGAN 1: Meta Title
  const getPageTitle = () => {
    if (product) {
      return `${product.name} | ${siteName}`;
    }
    if (category) {
      return `${category.name} - Mỹ phẩm chính hãng | ${siteName}`;
    }
    if (pageType === 'home') {
      return 'TRANG ALLURE - Mỹ phẩm chính hãng, săn sale mỗi ngày';
    }
    if (pageType === 'blog') {
      return `${title} | ${siteName}`;
    }
    return title ? `${title} | ${siteName}` : siteName;
  };

  // ✅ SLOGAN 2: Meta Description
  const getPageDescription = () => {
    if (product) {
      return `Mua ${product.name} chính hãng giá ${new Intl.NumberFormat('vi-VN').format(product.price)}đ tại TrangAllure Shop. ${product.brand ? `Thương hiệu ${product.brand}.` : ''} Giao hàng nhanh toàn quốc.`;
    }
    if (category) {
      return `Khám phá bộ sưu tập ${category.name} tại TrangAllure Shop. ${category.description || 'Mỹ phẩm chính hãng, chất lượng cao, giá tốt nhất thị trường.'}`;
    }
    if (pageType === 'home') {
      return 'TRANG ALLURE - Nơi hội tụ các thương hiệu mỹ phẩm Authentic. Săn ngay ưu đãi sốc, hàng chính hãng 100%!';
    }
    if (pageType === 'blog') {
      return description || `Bài viết mới nhất tại TrangAllure Shop về mỹ phẩm và làm đẹp.`;
    }
    return description || 'TrangAllure Shop - Mỹ phẩm chính hãng, chất lượng cao, giá tốt.';
  };

  // ✅ Keywords tự động theo loại trang
  const getPageKeywords = () => {
    if (product) {
      const baseKeywords = ['mỹ phẩm chính hãng', product.name, product.brand || ''];
      return [...baseKeywords, ...(keywords?.split(',') || [])].filter(Boolean).join(', ');
    }
    if (category) {
      return `${category.name}, mỹ phẩm ${category.name}, ${category.name} chính hãng, trang điểm, làm đẹp`;
    }
    if (pageType === 'home') {
      return 'mỹ phẩm chính hãng, son môi, kem nền, skincare, trang điểm, chăm sóc da, sale mỹ phẩm';
    }
    if (pageType === 'blog') {
      return keywords || 'mỹ phẩm, làm đẹp, chăm sóc da, trang điểm';
    }
    return keywords || 'mỹ phẩm chính hãng, son môi, kem nền, skincare, trang điểm, chăm sóc da';
  };

  const pageTitle = getPageTitle();
  const pageDescription = getPageDescription();
  const pageImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
  const pageUrl = url || siteUrl;
  const pageKeywords = getPageKeywords();

  // ✅ Schema động cho các loại trang
  const getSchema = () => {
    // Schema cho Product
    if (product) {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.images?.[0] || defaultImage,
        "brand": {
          "@type": "Brand",
          "name": product.brand || "TrangAllure"
        },
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": priceCurrency,
          "availability": product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "url": pageUrl,
        },
        ...(ratingValue && ratingCount && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": ratingValue,
            "ratingCount": ratingCount,
            "bestRating": "5",
            "worstRating": "1"
          }
        })
      };
    }

    // Schema cho Category
    if (category) {
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.name,
        "description": category.description || `Khám phá bộ sưu tập ${category.name} tại TrangAllure Shop.`,
        "url": pageUrl,
        "about": {
          "@type": "Thing",
          "name": category.name
        }
      };
    }

    // Schema cho Blog/Article
    if (pageType === 'blog') {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": pageImage,
        "url": pageUrl,
        "publisher": {
          "@type": "Organization",
          "name": siteName
        },
        ...(publishedTime && { "datePublished": publishedTime }),
        ...(modifiedTime && { "dateModified": modifiedTime })
      };
    }

    // Schema mặc định cho WebSite (trang chủ, contact, etc.)
    return {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": siteName,
      "url": siteUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${siteUrl}/san-pham?search={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };
  };

  return (
    <Helmet>
      {/* ===== CƠ BẢN ===== */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <link rel="canonical" href={pageUrl} />

      {/* ===== OPEN GRAPH (Facebook, Zalo, LinkedIn, etc.) ===== */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={product ? "product" : pageType === 'blog' ? "article" : "website"} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="vi_VN" />
      {product && (
        <>
          <meta property="og:price:amount" content={product.price} />
          <meta property="og:price:currency" content={priceCurrency} />
          <meta property="og:availability" content={product.stock > 0 ? "instock" : "out of stock"} />
        </>
      )}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* ===== TWITTER CARD ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* ===== DỮ LIỆU CÓ CẤU TRÚC (JSON-LD) ===== */}
      <script type="application/ld+json">
        {JSON.stringify(getSchema())}
      </script>
    </Helmet>
  );
};

export default SEO;