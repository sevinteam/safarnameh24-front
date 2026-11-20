import {
  NavBar,
  Section,
  BackToTopBtn,
} from '@/components/landing/modules/rules';
import StickyArea from '@/components/landing/shared/StickyArea';
import { Metadata } from 'next';

// جلوگیری از ارور بیلد و اجبار به رندر داینامیک
export const dynamic = 'force-dynamic';

// متادیتا برای سئو
export const metadata: Metadata = {
  title: 'قوانین و مقررات زروان تریپ | شرایط رزرو هتل',
  description:
    'پیش از رزرو هتل، قوانین و مقررات زروان تریپ شامل شرایط کنسلی، استرداد وجه و حریم خصوصی کاربران را مطالعه کنید.',
  alternates: { canonical: 'https://zarvantrip.com/rules' },
};

// تابع دریافت داده در سمت سرور همراه با گزارش دقیق خطا برای دیباگ
async function getRules() {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cps.zarvantrip.com/api/v1';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
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
      return {
        data: [],
        debug: `Status: ${res.status} | URL: ${url}`,
      };
    }

    const json = await res.json();

    let list: any[] = [];
    if (Array.isArray(json)) {
      list = json;
    } else if (Array.isArray(json?.data)) {
      list = json.data;
    } else if (Array.isArray(json?.results)) {
      list = json.results;
    }

    return {
      data: list,
      debug: `OK (${res.status}) | Length: ${list.length} | URL: ${url}`,
    };
  } catch (error: any) {
    return {
      data: [],
      debug: `Fetch Error: ${error?.cause?.code || error?.message || 'Unknown'} | URL: ${url}`,
    };
  }
}

export default async function Rules() {
  const { data, debug } = await getRules();

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

  return (
    <main className="container mx-auto">
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
            <p>
              در حال حاضر قوانین و مقرراتی ثبت نشده است یا سرور در دسترس نمی‌باشد.
            </p>
            {/* این خط موقتی است؛ بعد از رفع مشکل حذف کنید */}
            <p dir="ltr" className="mt-4 text-xs text-red-500 font-mono">
              {debug}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}