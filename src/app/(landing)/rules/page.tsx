import {
  NavBar,
  Section,
  BackToTopBtn,
} from '@/components/landing/modules/rules';
import StickyArea from '@/components/landing/shared/StickyArea';
import { Metadata } from 'next';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  getBackendApiBaseUrl,
} from '@/lib/seo';

// جلوگیری از ارور بیلد و اجبار به رندر داینامیک
export const dynamic = 'force-dynamic';

// متادیتا برای سئو
export const metadata: Metadata = {
  title: `قوانین و مقررات رزرو هتل در ${SITE_NAME} | شرایط کنسلی و استرداد`,
  description:
    'پیش از رزرو هتل، قوانین و مقررات زروان تریپ شامل شرایط کنسلی، جرائم، استرداد وجه و قوانین پذیرش مسافر در هتل‌ها را مطالعه کنید.',
  alternates: { canonical: `${SITE_URL}/rules` },
  openGraph: {
    title: `قوانین و مقررات | ${SITE_NAME}`,
    description:
      'قوانین رزرو هتل، شرایط کنسلی و استرداد وجه در سامانه رزرواسیون زروان تریپ.',
    url: `${SITE_URL}/rules`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: `قوانین و مقررات ${SITE_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `قوانین و مقررات | ${SITE_NAME}`,
    description:
      'مطالعه شرایط کنسلی، استرداد وجه و مقررات رزرو آنلاین هتل در زروان تریپ.',
    images: [DEFAULT_OG_IMAGE],
  },
};

// تابع دریافت داده در سمت سرور با مدیریت امن آدرس و خطاها
async function getRules() {
  const baseUrl = getBackendApiBaseUrl();
  const url = `${baseUrl}/config/rules/`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; ZarvanTripFrontend/1.0)',
      },
    });

    if (!res.ok) {
      console.error(`[Rules API Error] Status: ${res.status} | URL: ${url}`);
      return [];
    }

    const json = await res.json();

    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.results)) return json.results;

    return [];
  } catch (error) {
    console.error(`[Rules API Catch] URL: ${url}`, error);
    return [];
  }
}

export default async function Rules() {
  const data = await getRules();

  const navList = data.map((item: any, index: number) => ({
    id: String(index),
    tab_title: item?.tab_title || '',
  }));

  const totalDuration = data.reduce((sum: number, item: any) => {
    const plainText = (item?.text || '').replace(/<[^>]*>/g, '');
    return sum + Math.ceil(plainText.length / 1000);
  }, 0);

  // تابع خنثی با تگ سرور که بدون خطا به کلاینت پاس داده می‌شود
  async function dummySetActive() {
    'use server';
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'قوانین و مقررات',
        item: `${SITE_URL}/rules`,
      },
    ],
  };

  return (
    <main className="container mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">قوانین و مقررات رزرو هتل زروان تریپ</h1>

      <div className="mt-2">
        <StickyArea
          childrenStatus={{ static: true, fixed: true }}
          searchbarStatus={{ static: false, fixed: false }}
          fixedClassName="py-0"
        >
          <NavBar activeSection="0" navList={navList} />
        </StickyArea>
      </div>

      <div className="space-y-12 xl:mt-12">
        {/* نوار چسبان زمان مطالعه */}
        <div className="sticky top-24 bg-white h-16 p-3 items-center justify-between gap-12 hidden rounded-xl shadow-[0_0_2rem_rgba(0,0,0,0.05)] lg:flex">
          <div className="flex-1">
            <NavBar activeSection="0" navList={navList} />
          </div>
          <div className="w-fit h-full flex gap-2">
            <BackToTopBtn />
            <div className="bg-zinc-100 text-zinc-700 text-cs08 font-bold px-5 flex-center gap-1 rounded-lg">
              زمان مطالعه: {totalDuration > 0 ? totalDuration : 1} دقیقه
            </div>
          </div>
        </div>

        {/* لیست بخش‌ها و متن قوانین */}
        {data.length > 0 ? (
          data.map((section: any, index: number) => (
            <Section
              key={section?.id ?? index}
              sectionIsFirst={index === 0}
              section={{ id: String(index), ...section }}
              firstSectionID={index === 0 ? String(index) : null}
              setActiveSection={dummySetActive as any}
            />
          ))
        ) : (
          <div className="py-20 text-center text-zinc-500 font-semibold bg-white rounded-2xl border border-zinc-100 shadow-sm">
            در حال حاضر قوانین و مقرراتی ثبت نشده است یا سرور در دسترس نمی‌باشد.
          </div>
        )}
      </div>
    </main>
  );
}