import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/hotel',
          '/hotel/',
          '/about-us',
          '/contact-us',
          '/rules',
          '/privacypolicy',
        ],
        disallow: [
          '/dashboard/',
          '/payment/',
          '/api/',
          '/admin-review',
          '/review/',
          '/tourism-magazine',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
