import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  image, 
  url, 
  product, 
  category,
  keywords 
}) => {
  const siteName = 'TrangAllure Shop';
  const siteUrl = 'https://trangallure.shop';
  const defaultImage = '/og-image.jpg';
  
  const pageTitle = title ? `${title} - ${siteName}` : siteName;
  const pageDescription = description || 'TrangAllure Shop cung cấp mỹ phẩm chính hãng, son môi, kem nền, skincare chất lượng cao. Mua sắm an toàn, giá tốt.';
  const pageImage = image || defaultImage;
  const pageUrl = url || siteUrl;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />
      
      {/* Schema.org JSON-LD cho Product */}
      {product && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images?.[0] || defaultImage,
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "VND",
              "availability": "https://schema.org/InStock"
            },
            "brand": {
              "@type": "Brand",
              "name": product.brand || "TrangAllure"
            }
          })}
        </script>
      )}

      {/* Schema.org cho Category */}
      {category && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": category.name,
            "description": category.description,
            "url": pageUrl
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;