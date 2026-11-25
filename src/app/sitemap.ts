import type { MetadataRoute } from 'next';
import {
  SITE_URL,
  fetchAllHotelsForSitemap,
  fetchHomepageCities,
  toHttpsUrl,
} from '@/lib/seo';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [hotels, cities] = await Promise.all([
    fetchAllHotelsForSitemap(),
    fetchHomepageCities(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/hotel`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about-us`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact-us`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/rules`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacypolicy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities
    .filter((city) => Boolean(city?.slug))
    .map((city) => ({
      url: `${SITE_URL}/hotel?city=${encodeURIComponent(city.slug)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.85,
      ...(city.image
        ? { images: [toHttpsUrl(city.image)].filter(Boolean) as string[] }
        : {}),
    }));

  const hotelRoutes: MetadataRoute.Sitemap = hotels.map((hotel) => {
    const imgUrl = toHttpsUrl(hotel.main_image);
    return {
      url: `${SITE_URL}/hotel/${encodeURIComponent(hotel.city!.slug!)}/${encodeURIComponent(hotel.slug)}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      ...(imgUrl ? { images: [imgUrl] } : {}),
    };
  });

  return [...staticRoutes, ...cityRoutes, ...hotelRoutes];
}
