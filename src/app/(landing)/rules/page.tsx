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
  description: 'پیش از رزرو هتل، قوانین و مقررات زروان تریپ شامل شرایط کنسلی، استرداد وجه و حریم خصوصی کاربران را مطالعه کنید.',
  alternates: { canonical: 'https://zarvantrip.com/rules' },
};

// تابع دریافت داده در سمت سرور با مدیریت ۱۰۰٪ ایمن خطاها
async function getRules() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cps.zarvantrip.com/api/v1';

  try {
    const res = await fetch(`${baseUrl}/config/rules/`, { 
      cache: 'no-store', // لغو کش برای جلوگیری از تداخل با Next.js و دریافت دیتای زنده
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error('خطا در ارتباط سرور به بک‌اند قوانین:', error);
    return []; // بازگرداندن آرایه خالی به جای پرتاب خطا
  }
}

export default async function Rules() {
  const response = await getRules();
  
  // استخراج کاملاً ایمن داده‌ها برای جلوگیری از ارور map is not a function
  let data: any[] = [];
  if (Array.isArray(response)) {
    data = response;
  } else if (response?.data && Array.isArray(response.data)) {
    data = response.data;
  } else if (response?.results && Array.isArray(response.results)) {
    data = response.results;
  }

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
              key={index}
              sectionIsFirst={index === 0}
              section={{ id: String(index), ...section }}
              firstSectionID={index === 0 ? String(index) : null}
              // این خط اضافه شد تا تایپ‌اسکریپت اجازه عبور بدهد
              setActiveSection={(() => {}) as any} 
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