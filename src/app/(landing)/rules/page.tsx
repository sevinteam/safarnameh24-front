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

// تابع دریافت داده در سمت سرور با مدیریت کامل خطا و جلوگیری از اسلش اضافه
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
      console.error(`[Rules API Error] URL: ${url} | Status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    console.log(
      '[Rules API Success] Structure:',
      Array.isArray(json) ? `Array(${json.length})` : Object.keys(json || {})
    );
    return json;
  } catch (error: any) {
    console.error(
      `[Rules API Catch] URL: ${url} | Error:`,
      error?.message || error
    );
    return null;
  }
}

// استخراج هوشمند آرایه قوانین از هر ساختار احتمالی بک‌اند
function extractRulesArray(response: any): any[] {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.results)) return response.results;
  if (Array.isArray(response?.result)) return response.result;
  if (Array.isArray(response?.rules)) return response.rules;
  if (Array.isArray(response?.data?.results)) return response.data.results;

  if (typeof response === 'object') {
    const firstArray = Object.values(response).find((val) =>
      Array.isArray(val)
    );
    if (firstArray) return firstArray as any[];
  }

  return [];
}

export default async function Rules() {
  const response = await getRules();
  const data = extractRulesArray(response);

  const navList = data.map((item: any, index: number) => ({
    id: String(index),
    tab_title: item?.tab_title || item?.title || '',
  }));

  const totalDuration = data.reduce((sum: number, item: any) => {
    const plainText = (item?.text || item?.content || '').replace(
      /<[^>]*>/g,
      ''
    );
    return sum + Math.ceil(plainText.length / 1000);
  }, 0);

  // تابع خنثی برای جلوگیری از خطای پاس دادن تابع از سرور به کلاینت
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
            در حال حاضر قوانین و مقرراتی ثبت نشده است یا سرور در دسترس نمی‌باشد.
          </div>
        )}
      </div>
    </main>
  );
}