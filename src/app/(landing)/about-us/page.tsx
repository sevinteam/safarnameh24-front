import { Metadata } from 'next';
import {
  Gallery,
  OurStory,
  ReasonOfSelection,
  LookingAtServices,
  FrequentlyQuestions,
} from '@/components/landing/modules/about-us';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `درباره سفرنامه ۲۴ | رزرو آنلاین هتل‌های برتر با بهترین قیمت`,
  description:
    'با سفرنامه ۲۴ آشنا شوید؛ مرجع تخصصی رزرو آنلاین هتل‌های ایران و جهان با گلچینی از بهترین اقامتگاه‌ها، تضمین قیمت و پشتیبانی ۲۴ ساعته.',
  keywords: [
    'درباره سفرنامه ۲۴',
    'سفرنامه ۲۴',
    'safarnameh24',
    'رزرو هتل',
    'رزرو آنلاین هتل',
    'بهترین هتل‌ها',
  ],
  alternates: {
    canonical: `${SITE_URL}/about-us`,
  },
  openGraph: {
    title: `درباره ${SITE_NAME} | مرجع رزرو هتل‌های باکیفیت`,
    description:
      'سفر به یادماندنی با رزرو بهترین هتل‌ها در سفرنامه ۲۴. ما کیفیت و قیمت اقامت شما را تضمین می‌کنیم.',
    url: `${SITE_URL}/about-us`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: `درباره ${SITE_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `درباره ${SITE_NAME} | رزرو آنلاین هتل`,
    description:
      'آشنایی با داستان، خدمات و مزایای رزرو آنلاین هتل در سفرنامه ۲۴.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function AboutUs() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        url: `${SITE_URL}/about-us`,
        name: `درباره ${SITE_NAME}`,
        inLanguage: 'fa-IR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'درباره ما',
            item: `${SITE_URL}/about-us`,
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
      <main className="mt-4 flex flex-col gap-14 lg:gap-20 xl:mt-12">
        <OurStory />
        <ReasonOfSelection />
        <FrequentlyQuestions />
        <Gallery />
        <LookingAtServices />
      </main>
    </>
  );
}