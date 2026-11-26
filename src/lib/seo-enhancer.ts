import { Hotel } from '@/types';

export type EnhancedSeoConfig = {
  title: string;
  description: string;
  keywords: string[];
  structuredData: Record<string, unknown>;
};

/**
 * Utility function to dynamically generate enhanced SEO metadata and Schema.org
 * structured data based on hotel category, stars, tags, and location.
 */
export function generateEnhancedHotelSeo(
  hotel: Hotel & {
    category?: string;
    tags?: Array<{ title: string }>;
    city?: { name?: string; province?: string };
    price_info?: { total_price?: number };
  },
  customTags: string[] = []
): EnhancedSeoConfig {
  const hotelName = hotel?.name || 'هتل';
  const cityName = hotel?.city?.name || hotel?.city?.province || 'ایران';
  const stars = hotel?.stars ? `${hotel.stars} ستاره` : '';
  const category = hotel?.category || 'لوکس و اقتصادی';
  
  const tagTitles = Array.isArray(hotel?.tags)
    ? hotel.tags.map((t) => t.title).filter(Boolean)
    : [];

  const combinedKeywords = Array.from(
    new Set([
      `رزرو ${hotelName}`,
      `هتل ${hotelName} ${cityName}`,
      `قیمت ${hotelName}`,
      `رزرو آنلاین هتل در ${cityName}`,
      `بهترین هتل های ${cityName}`,
      ...tagTitles,
      ...customTags,
    ])
  );

  const seoTitle = `رزرو ${stars} ${hotelName} ${cityName} با تخفیف ویژه و واچر آنی`;
  const seoDescription = `رزرو آنلاین ${hotelName} واقع در ${cityName} (${stars}). مشاهده قیمت اتاق‌ها، عکس‌های واقعی، امکانات، نظرات مسافران و تخفیف‌های ویژه با پشتیبانی ۲۴ ساعته.`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotelName,
    description: seoDescription,
    address: {
      '@type': 'PostalAddress',
      addressLocality: cityName,
      addressCountry: 'IR',
    },
    ...(hotel?.stars ? { starRating: { '@type': 'Rating', ratingValue: hotel.stars } } : {}),
    ...(hotel?.price_info?.total_price ? {
      offers: {
        '@type': 'Offer',
        price: hotel.price_info.total_price * 10,
        priceCurrency: 'IRR',
        availability: 'https://schema.org/InStock',
      }
    } : {}),
  };

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: combinedKeywords,
    structuredData,
  };
}
