\import {
  NavBar,
  Section,
  BackToTopBtn,
} from '@/components/landing/modules/rules';
import StickyArea from '@/components/landing/shared/StickyArea';
import { Metadata } from 'next';

// جلوگیری از ارور بیلد داکر در زمان ساخت صفحات استاتیک
export const dynamic = 'force-dynamic';

// 1. متادیتا برای این صفحه
export const metadata: Metadata = {
  title: 'قوانین و مقررات زروان تریپ | شرایط رزرو هتل',
  description: 'پیش از رزرو هتل، قوانین و مقررات زروان تریپ شامل شرایط کنسلی، استرداد وجه و حریم خصوصی کاربران را مطالعه کنید.',
  alternates: { canonical: 'https://zarvantrip.com/rules' },
};

// تابع دریافت داده در سمت سرور (کاملاً ایمن در برابر ارورهای URL و قطع بودن سرور)
async function getRules() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cps.zarvantrip.com/api/v1';

  try {
    const res = await fetch(`${baseUrl}/config/rules/`, { 
      next: { revalidate: 3600 } // کش کردن داده‌ها برای 1 ساعت
    });
    if (!res.ok) {
      console.error('خطا در پاسخ سرور قوانین:', res.status, res.statusText);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('خطا در دریافت قوانین:', error);
    return null;
  }
}

export default async function Rules() {
  const response = await getRules();
  
  // اصلاح هوشمند: پشتیبانی همزمان از پاسخ آرایه مستقیم یا ساختار { data: [...] }
  const data = Array.isArray(response) 
    ? response 
    : (response?.data || (Array.isArray(response?.results) ? response.results : []));

  const navList = data.map((item: any, index: number) => ({
    id: String(index),
    tab_title: item?.tab_title || '',
  }));

  const totalDuration = data.reduce((sum: number, item: any) => {
    const plainText = (item?.text || '').replace(/<[^>]*>/g, '');
    return sum + Math.ceil(plainText.length / 1000);
  }, 0);

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
        {/* Sticky Bar */}
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

        {/* لیست بخش‌ها */}
        {data.length > 0 ? (
          data.map((section: any, index: number) => (
            <Section
              key={index}
              sectionIsFirst={index === 0}
              setActiveSection={() => {}} 
              section={{ id: String(index), ...section }}
              firstSectionID={index === 0 ? String(index) : null}
            />
          ))
        ) : (
          <div className="py-20 text-center text-zinc-500 font-semibold">
            در حال حاضر قوانین و مقرراتی ثبت نشده است.
          </div>
        )}
      </div>
    </main>
  );
}