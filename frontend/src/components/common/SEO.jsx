import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  image,
  url,
  product,
  category,
  keywords,
  // ✅ Các props mới cho SEO nâng cao
  publishedTime,
  modifiedTime,
  ratingValue,
  ratingCount,
  priceCurrency = 'VND',
}) => {
  const siteName = 'TrangAllure Shop';
  const siteUrl = 'https://trangallure.shop';
  const defaultImage = `${siteUrl}/og-image.jpg`; // ✅ URL tuyệt đối

  const pageTitle = title ? `${title} - ${siteName}` : siteName;
  const pageDescription = description || 'TrangAllure Shop cung cấp mỹ phẩm chính hãng, son môi, kem nền, skincare chất lượng cao. Mua sắm an toàn, giá tốt.';
  const pageImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
  const pageUrl = url || siteUrl;

  // ✅ Xây dựng schema động cho các loại trang khác nhau
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
        // ✅ Thêm đánh giá nếu có
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

    // Schema cho Category hoặc Collection
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
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageUrl} />

      {/* ===== OPEN GRAPH ===== */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={product ? "product" : "website"} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="vi_VN" />
      {product && (
        <>
          <meta property="og:price:amount" content={product.price} />
          <meta property="og:price:currency" content={priceCurrency} />
          <meta property="og:availability" content={product.stock > 0 ? "instock" : "out of stock"} />
        </>
      )}

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