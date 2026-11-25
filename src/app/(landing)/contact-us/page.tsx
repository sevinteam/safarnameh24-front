import { Metadata } from 'next';
import {
  SendTicket,
  SocialMedias,
  ContactUsWays,
} from '@/components/landing/modules/contact-us';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `تماس با زروان تریپ | پشتیبانی ۲۴ ساعته و پیگیری رزرو هتل`,
  description:
    'برای ارتباط با تیم پشتیبانی ۲۴ ساعته زروان تریپ، پیگیری رزرو هتل، شماره تماس و ارسال تیکت آنلاین از صفحه تماس با ما اقدام کنید.',
  keywords: [
    'تماس با زروان تریپ',
    'پشتیبانی زروان تریپ',
    'شماره تماس زروان تریپ',
    'ارسال تیکت به زروان تریپ',
    'خدمات مشتریان زروان تریپ',
  ],
  alternates: {
    canonical: `${SITE_URL}/contact-us`,
  },
  openGraph: {
    title: `تماس با ما | ${SITE_NAME} - همراه شما در سفر`,
    description:
      'راهنمای ارتباط با زروان تریپ؛ پشتیبانی آنلاین ۲۴ ساعته و شماره تماس برای رزرو هتل.',
    url: `${SITE_URL}/contact-us`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: `تماس با ${SITE_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `تماس با پشتیبانی ${SITE_NAME}`,
    description:
      'پشتیبانی ۲۴ ساعته رزرو هتل، شماره تماس و ارسال تیکت آنلاین در زروان تریپ.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactUs() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        url: `${SITE_URL}/contact-us`,
        name: `تماس با ${SITE_NAME}`,
        inLanguage: 'fa-IR',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'تماس با ما',
            item: `${SITE_URL}/contact-us`,
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
      <main className="mt-4 flex flex-col gap-12 lg:gap-20 xl:mt-12">
        <ContactUsWays />
        <SocialMedias />
        <SendTicket />
      </main>
    </>
  );
}