import { Metadata } from 'next';
import { Suspense } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';
import MagazineView from '@/components/landing/modules/tourism-magazine/MagazineView';

export const metadata: Metadata = {
  title: `مجله گردشگری و راهنمای سفر | ${SITE_NAME}`,
  description:
    'جدیدترین مقالات راهنمای سفر، معرفی هتل‌های لوکس، جاذبه‌های گردشگری شهرهای ایران و جهان و نکات کاربردی رزرو هتل در مجله گردشگری زروان تریپ.',
  keywords: [
    'مجله گردشگری',
    'وبلاگ سفر',
    'راهنمای سفر',
    'جاذبه‌های گردشگری',
    'معرفی هتل',
    'زروان تریپ',
  ],
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `مجله گردشگری زروان تریپ | راهنمای جامع سفر و هتل`,
    description:
      'خواندنی‌ترین مقالات گردشگری، راهنمای سفر به شهرهای مختلف و بررسی تخصصی هتل‌ها.',
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'مجله گردشگری زروان تریپ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `مجله گردشگری زروان تریپ`,
    description: 'راهنمای سفر، جاذبه‌های گردشگری و معرفی بهترین هتل‌ها.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function BlogPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/blog#blog`,
        url: `${SITE_URL}/blog`,
        name: `مجله گردشگری ${SITE_NAME}`,
        description:
          'مقالات راهنمای سفر و معرفی هتل‌های ایران و جهان در مجله زروان تریپ.',
        publisher: {
          '@type': 'TravelAgency',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'مجله گردشگری',
            item: `${SITE_URL}/blog`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full py-4 sm:py-6">
        <Suspense
          fallback={
            <div className="h-28 w-full animate-pulse rounded-2xl bg-zinc-100" />
          }
        >
          <MagazineView />
        </Suspense>
      </div>
    </>
  );
}
