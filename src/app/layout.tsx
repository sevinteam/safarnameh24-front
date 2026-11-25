import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';

import MainWrapper from '@/components/landing/shared/MainWrapper';
import { cn } from '@/utils/utils';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_NAME_EN,
  SITE_URL,
  fetchSiteGlobalSeoData,
  getMetadataBaseUrl,
  toHttpsUrl,
} from '@/lib/seo';

// ---------------------------------------------------

const GTM_ID = 'GTM-PFSBR64';

// Local font
const interFont = localFont({
  src: [
    {
      path: '../../public/font/inter/Inter_18pt-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../../public/font/inter/Inter_18pt-Black.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/font/inter/Inter_18pt-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
});

const iranSansFont = localFont({
  src: [
    { path: '../../public/font/woff/IRANSansX-LightD4.woff', weight: '400' },
    { path: '../../public/font/woff2/IRANSansX-LightD4.woff2', weight: '400' },
    { path: '../../public/font/woff/IRANSansX-RegularD4.woff', weight: '500' },
    {
      path: '../../public/font/woff2/IRANSansX-RegularD4.woff2',
      weight: '500',
    },
    { path: '../../public/font/woff/IRANSansX-MediumD4.woff', weight: '600' },
    { path: '../../public/font/woff2/IRANSansX-MediumD4.woff2', weight: '600' },
    { path: '../../public/font/woff/IRANSansX-DemiBoldD4.woff', weight: '700' },
    {
      path: '../../public/font/woff2/IRANSansX-DemiBoldD4.woff2',
      weight: '700',
    },
    { path: '../../public/font/woff/IRANSansX-BoldD4.woff', weight: '800' },
    { path: '../../public/font/woff2/IRANSansX-BoldD4.woff2', weight: '800' },
    { path: '../../public/font/woff/IRANSansX-BlackD4.woff', weight: '900' },
    { path: '../../public/font/woff2/IRANSansX-BlackD4.woff2', weight: '900' },
  ],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: getMetadataBaseUrl(),
  title: {
    default: `${SITE_NAME} | رزرو آنلاین هتل‌های داخلی و خارجی با بهترین قیمت`,
    template: '%s',
  },
  description:
    'رزرو آنلاین هتل‌های داخلی و خارجی در سفرنامه ۲۴ با تضمین بهترین قیمت، تخفیف‌های ویژه، بررسی امکانات و نظرات مسافران و صدور آنی واچر با پشتیبانی ۲۴ ساعته.',
  applicationName: SITE_NAME,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: `${SITE_NAME} | رزرو آنلاین هتل با بهترین قیمت`,
    description:
      'انتخاب و رزرو آنلاین بهترین هتل‌های ایران و جهان با تخفیف ویژه و پشتیبانی ۲۴ ساعته در سفرنامه ۲۴.',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: `${SITE_NAME} - ${SITE_NAME_EN}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | رزرو آنلاین هتل با بهترین قیمت`,
    description:
      'رزرو آنلاین بهترین هتل‌های ایران و جهان با تضمین قیمت و صدور آنی واچر در سفرنامه ۲۴.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { mainConfig, phone, email, address, sameAs } =
    await fetchSiteGlobalSeoData();

  const logoUrl = toHttpsUrl(mainConfig?.header_logo) || DEFAULT_OG_IMAGE;

  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TravelAgency',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        alternateName: SITE_NAME_EN,
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
        description:
          mainConfig?.footer_description?.replace(/\s+/g, ' ').trim() ||
          'زروان‌تریپ، سامانه رزرو آنلاین هتل در ایران با پشتیبانی ۲۴ ساعته.',
        email,
        telephone: phone,
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IR',
          addressLocality: 'تهران',
          streetAddress: address,
        },
        ...(sameAs.length > 0 ? { sameAs } : {}),
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: phone,
          contactType: 'customer service',
          areaServed: 'IR',
          availableLanguage: ['Persian', 'English'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        alternateName: SITE_NAME_EN,
        inLanguage: 'fa-IR',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/hotel?city={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };

  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
      </head>
      <body
        className={cn(
          interFont.variable,
          iranSansFont.variable,
          'ss01 font-sans antialiased',
        )}
        suppressHydrationWarning
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />

        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}