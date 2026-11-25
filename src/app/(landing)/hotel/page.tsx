import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronLeft } from 'lucide-react';
import {
  Filters,
  Setting,
  HotelList,
  AmazingHotels,
  SuggestedHotels,
} from '@/components/landing/modules/hotels';

import StickyArea from '@/components/landing/shared/StickyArea';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  fetchBackendJson,
  fetchHomepageCities,
  safeDecode,
  toHttpsUrl,
} from '@/lib/seo';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

type Props = {
  searchParams: SearchParams;
};

type HotelListItem = {
  name?: string;
  slug?: string;
  main_image?: string;
  stars?: number;
  city?: {
    name?: string;
    slug?: string;
  };
};

type BestFilterResponse = {
  count?: number;
  results?: HotelListItem[];
};

const CITY_NAME_FALLBACK: Record<string, string> = {
  tehran: 'تهران',
  mashhad: 'مشهد',
  isfahan: 'اصفهان',
  shiraz: 'شیراز',
  kish: 'کیش',
  qeshm: 'قشم',
  tabriz: 'تبریز',
  rasht: 'رشت',
  yazd: 'یزد',
  ramsar: 'رامسر',
  antalya: 'آنتالیا',
  istanbul: 'استانبول',
  dubai: 'دبی',
};

function getSingleParam(val?: string | string[]): string {
  if (Array.isArray(val)) return val[0] || '';
  return val || '';
}

async function resolveCityDisplayName(citySlug: string): Promise<string> {
  if (!citySlug) return '';
  const cities = await fetchHomepageCities();
  const matched = cities.find(
    (c) => c.slug?.toLowerCase() === citySlug.toLowerCase(),
  );
  if (matched?.name) return matched.name;
  const fallback = CITY_NAME_FALLBACK[citySlug.toLowerCase()];
  if (fallback) return fallback;
  return safeDecode(citySlug).replace(/-/g, ' ');
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const cityParam = getSingleParam(params?.city).trim();
  const lastMinute = getSingleParam(params?.['last-minute']) === 'show';
  const amazingHotels = getSingleParam(params?.['amazing-hotels']) === 'show';
  const starParam = getSingleParam(params?.star);

  const cityName = cityParam ? await resolveCityDisplayName(cityParam) : '';

  const canonicalUrl = cityParam
    ? `${SITE_URL}/hotel?city=${encodeURIComponent(cityParam)}`
    : `${SITE_URL}/hotel`;

  let title = `لیست هتل‌ها | رزرو بهترین هتل‌های ایران و جهان | ${SITE_NAME}`;
  let description =
    'مقایسه قیمت، امکانات و نظرات مسافران بهترین هتل‌های داخلی و خارجی و رزرو آنلاین با تخفیف ویژه و صدور آنی واچر در زروان تریپ.';

  if (cityName) {
    title = `رزرو هتل‌های ${cityName} با بهترین قیمت و تخفیف | ${SITE_NAME}`;
    description = `مشاهده لیست کامل هتل‌های ${cityName} همراه با قیمت روز، تصاویر، امکانات و نظرات مسافران. رزرو آنلاین هتل در ${cityName} با پشتیبانی ۲۴ ساعته در زروان تریپ.`;
  } else if (lastMinute) {
    title = `هتل‌های لحظه آخری با بیشترین تخفیف | ${SITE_NAME}`;
    description =
      'رزرو هتل‌های لحظه آخری ایران با تخفیف‌های ویژه و تایید فوری در زروان تریپ.';
  } else if (amazingHotels) {
    title = `هتل‌های شگفت‌انگیز و منتخب زروان تریپ | ${SITE_NAME}`;
    description =
      'بهترین هتل‌های پیشنهادی و دارای تخفیف شگفت‌انگیز برای اقامت راحت و اقتصادی در زروان تریپ.';
  } else if (starParam) {
    title = `رزرو هتل‌های ${starParam} ستاره ایران و جهان | ${SITE_NAME}`;
  }

  return {
    title,
    description,
    keywords: [
      'رزرو هتل',
      'لیست هتل ها',
      'قیمت هتل',
      'بهترین هتل ها',
      ...(cityName ? [`رزرو هتل ${cityName}`, `هتل های ${cityName}`] : []),
      'رزرو آنلاین هتل',
      'زروان تریپ',
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'fa_IR',
      type: 'website',
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function BestHotels({ searchParams }: Props) {
  const params = await searchParams;
  const cityParam = getSingleParam(params?.city).trim();
  const cityName = cityParam ? await resolveCityDisplayName(cityParam) : '';

  const canonicalUrl = cityParam
    ? `${SITE_URL}/hotel?city=${encodeURIComponent(cityParam)}`
    : `${SITE_URL}/hotel`;

  const apiQuery = cityParam
    ? `/hotel/hotels/best-filter/?page=1&city=${encodeURIComponent(cityParam)}`
    : '/hotel/hotels/best-filter/?page=1';

  const listData = await fetchBackendJson<BestFilterResponse>(apiQuery, 1800);
  const items = (listData?.results ?? []).filter(
    (item) => Boolean(item?.slug && item?.city?.slug),
  );

  const pageHeading = cityName
    ? `رزرو آنلاین هتل‌های ${cityName}`
    : 'لیست و رزرو آنلاین بهترین هتل‌های ایران و جهان';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#collection`,
        url: canonicalUrl,
        name: pageHeading,
        inLanguage: 'fa-IR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'خانه',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'رزرو هتل',
            item: `${SITE_URL}/hotel`,
          },
          ...(cityName
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `هتل‌های ${cityName}`,
                  item: canonicalUrl,
                },
              ]
            : []),
        ],
      },
      ...(items.length > 0
        ? [
            {
              '@type': 'ItemList',
              numberOfItems: items.length,
              itemListElement: items.slice(0, 12).map((item, idx) => ({
                '@type': 'ListItem',
                position: idx + 1,
                name: `هتل ${item.name}${item.city?.name ? ` ${item.city.name}` : ''}`,
                url: `${SITE_URL}/hotel/${encodeURIComponent(item.city!.slug!)}/${encodeURIComponent(item.slug!)}`,
                ...(toHttpsUrl(item.main_image)
                  ? { image: toHttpsUrl(item.main_image) }
                  : {}),
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mt-2">
        <StickyArea
          childrenStatus={{ static: true, fixed: true }}
          searchbarStatus={{ static: true, fixed: true }}
        >
          <Filters />
        </StickyArea>
      </div>

      <main className="mt-4 lg:mt-10">
        

        <Setting />

        <div className="grid gap-10 lg:mt-10 lg:grid-cols-[20rem_1fr]">
          <aside className="hidden lg:block">
            <Filters />
          </aside>

          <div className="space-y-12 lg:space-y-16">
            <Suspense fallback={<div>در حال بارگذاری هتل‌ها...</div>}>
              <SuggestedHotels />
              <AmazingHotels />
              <HotelList />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}