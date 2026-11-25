import { cache } from 'react';

export const SITE_URL = 'https://safarnameh24.com';
export const SITE_NAME = 'سفرنامه ۲۴';
export const SITE_NAME_EN = 'ZarvanTrip';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/image/logo/red.png`;

export function getMetadataBaseUrl(): URL {
  const appUrl = process.env.APP_URL?.trim();
  if (appUrl && /^https?:\/\//i.test(appUrl)) {
    try {
      return new URL(appUrl);
    } catch {
      return new URL(SITE_URL);
    }
  }
  return new URL(SITE_URL);
}

export function getBackendApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || '';
  if (
    !envUrl ||
    envUrl.includes('127.0.0.1') ||
    envUrl.includes('localhost')
  ) {
    return 'https://cps.safarnameh24.com/api/v1';
  }

  const withProtocol = /^https?:\/\//i.test(envUrl)
    ? envUrl
    : `https://${envUrl}`;
  const trimmed = withProtocol.replace(/\/+$/, '');
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
}

export function toHttpsUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('/')) return `${SITE_URL}${trimmed}`;
  if (trimmed.startsWith('http://')) {
    return `https://${trimmed.slice('http://'.length)}`;
  }
  return trimmed;
}

export function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function fetchBackendJson<T>(
  path: string,
  revalidate = 3600,
): Promise<T | null> {
  const baseUrl = getBackendApiBaseUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${baseUrl}${normalizedPath}`;

  try {
    const res = await fetch(url, {
      ...(revalidate > 0
        ? { next: { revalidate } }
        : { cache: 'no-store' as const }),
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type SitemapHotelItem = {
  name: string;
  slug: string;
  main_image?: string | null;
  stars?: number;
  city?: {
    name?: string;
    slug?: string;
  };
};

type BestFilterResponse = {
  count?: number;
  total_pages?: number;
  results?: SitemapHotelItem[];
};

export const fetchAllHotelsForSitemap = cache(
  async (): Promise<SitemapHotelItem[]> => {
    const firstPage = await fetchBackendJson<BestFilterResponse>(
      '/hotel/hotels/best-filter/?page=1',
      3600,
    );

    if (!firstPage?.results?.length) return [];

    const totalPages = Math.min(firstPage.total_pages || 1, 60);
    const allHotels: SitemapHotelItem[] = [...firstPage.results];

    if (totalPages > 1) {
      const pageNumbers = Array.from(
        { length: totalPages - 1 },
        (_, idx) => idx + 2,
      );

      const remainingPages = await Promise.allSettled(
        pageNumbers.map((page) =>
          fetchBackendJson<BestFilterResponse>(
            `/hotel/hotels/best-filter/?page=${page}`,
            3600,
          ),
        ),
      );

      for (const result of remainingPages) {
        if (result.status === 'fulfilled' && result.value?.results?.length) {
          allHotels.push(...result.value.results);
        }
      }
    }

    const seen = new Set<string>();
    return allHotels.filter((item) => {
      if (!item?.slug || !item?.city?.slug) return false;
      const key = `${item.city.slug}/${item.slug}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
);

export type HomepageCityItem = {
  id: number;
  name: string;
  province?: string;
  slug: string;
  image?: string;
  hotels_number?: number;
};

export const fetchHomepageCities = cache(
  async (): Promise<HomepageCityItem[]> => {
    const data = await fetchBackendJson<HomepageCityItem[]>(
      '/hotel/cities/homepage/',
      3600,
    );
    return Array.isArray(data) ? data : [];
  },
);

type MainConfig = {
  header_logo?: string;
  header_title?: string;
  footer_title?: string;
  footer_description?: string;
};

type ContactItem = {
  title?: string;
  value?: string | null;
};

type SocialMediaItem = {
  link?: string | null;
};

export const fetchSiteGlobalSeoData = cache(async () => {
  const [mainConfig, contactInfo, socialMedia] = await Promise.all([
    fetchBackendJson<MainConfig>('/config/main/', 3600),
    fetchBackendJson<ContactItem[]>('/config/contact-info/', 3600),
    fetchBackendJson<SocialMediaItem[]>('/config/social-media/', 3600),
  ]);

  const phoneItem = Array.isArray(contactInfo)
    ? contactInfo.find((c) => c.title?.includes('تماس') && c.value)
    : undefined;
  const emailItem = Array.isArray(contactInfo)
    ? contactInfo.find((c) => c.title?.includes('ایمیل') && c.value)
    : undefined;
  const addressItem = Array.isArray(contactInfo)
    ? contactInfo.find((c) => c.title?.includes('آدرس') && c.value)
    : undefined;

  const sameAs = Array.isArray(socialMedia)
    ? socialMedia
        .map((s) => toHttpsUrl(s.link))
        .filter((u): u is string => Boolean(u))
    : [];

  return {
    mainConfig,
    phone: phoneItem?.value || '+982122347613',
    email: emailItem?.value || 'zarvantrip@gmail.com',
    address:
      addressItem?.value || 'تهران، خیابان سمیه، خیابان پورموسی، پلاک ۲۷، واحد ۴',
    sameAs,
  };
});
