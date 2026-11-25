import { Metadata } from 'next';
import {
  Services,
  BestHotels,
  HeroSection,
  AmazingHotels,
  SuggestedHotels,
  CustomerReviews,
  BestSellingHotels,
  MostVisitedCities,
  AdvertisingBanners,
} from '@/components/landing/modules/home';

import StickyArea from '@/components/landing/shared/StickyArea';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `${SITE_NAME} | رزرو آنلاین هتل با بهترین قیمت و تخفیف ویژه`,
  description:
    'در سفرنامه ۲۴ بهترین هتل‌های ایران و جهان را با تضمین ارزان‌ترین قیمت، تخفیف‌های شگفت‌انگیز، مشاهده عکس و نظرات مسافران و پشتیبانی ۲۴ ساعته رزرو کنید.',
  keywords: [
    'سفرنامه ۲۴',
    'ZarvanTrip',
    'رزرو هتل',
    'رزرو آنلاین هتل',
    'رزرو هتل تهران',
    'رزرو هتل مشهد',
    'هتل تخفیف دار',
    'بهترین هتل ها',
    'رزرو هتل ارزان',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `${SITE_NAME} | مرجع تخصصی رزرو آنلاین هتل‌های ایران و جهان`,
    description:
      'مقایسه قیمت، امکانات و نظرات هتل‌ها و رزرو آنلاین با واچر آنی و پشتیبانی ۲۴ ساعته در سفرنامه ۲۴.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: 'سفرنامه ۲۴ | رزرو آنلاین هتل',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | رزرو آنلاین هتل با بهترین قیمت`,
    description:
      'رزرو سریع و مطمئن هتل‌های داخلی و خارجی با تخفیف ویژه و صدور آنی واچر در سفرنامه ۲۴.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function Home() {
  return (
    <>
      <h1 className="sr-only">
        رزرو آنلاین هتل‌های داخلی و خارجی با بهترین قیمت در سفرنامه ۲۴
      </h1>

      <StickyArea
        staticClassName="mt-2"
        childrenStatus={{ static: true, fixed: true }}
        searchbarStatus={{ static: true, fixed: true }}
      />

      <main className="mt-5 flex flex-col gap-14 lg:mt-0 lg:gap-20">
        <HeroSection />
        <Services />
        <SuggestedHotels />
        <MostVisitedCities />
        <AmazingHotels />
        <AdvertisingBanners />
        <BestSellingHotels />
        <BestHotels />
        <CustomerReviews />
      </main>
    </>
  );
}