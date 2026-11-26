import { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `حریم خصوصی کاربران و امنیت اطلاعات | ${SITE_NAME}`,
  description:
    'سیاست‌ها و قوانین حفظ حریم خصوصی، رمزنگاری و امنیت اطلاعات شخصی کاربران و مسافران در سامانه رزرواسیون آنلاین زروان تریپ.',
  alternates: { canonical: `${SITE_URL}/privacypolicy` },
  openGraph: {
    title: `حریم خصوصی کاربران | ${SITE_NAME}`,
    description:
      'سیاست‌های حفظ حریم خصوصی و امنیت داده‌های کاربران در زروان تریپ.',
    url: `${SITE_URL}/privacypolicy`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: `حریم خصوصی ${SITE_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `حریم خصوصی کاربران | ${SITE_NAME}`,
    description:
      'سیاست‌های حفظ حریم خصوصی و امنیت اطلاعات در زروان تریپ.',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function PrivacyPolicy() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'حریم خصوصی',
        item: `${SITE_URL}/privacypolicy`,
      },
    ],
  };

  const sections = [
    { id: 'intro', number: '۰۱', title: 'مقدمه و تعهدات ما' },
    { id: 'collection', number: '۰۲', title: 'اطلاعاتی که جمع‌آوری می‌کنیم' },
    { id: 'usage', number: '۰۳', title: 'نحوه استفاده از اطلاعات' },
    { id: 'security', number: '۰۴', title: 'حفاظت و امنیت داده‌ها' },
    { id: 'updates', number: '۰۵', title: 'تغییرات در حریم خصوصی' },
  ];

  const trustPillars = [
    {
      title: 'حفظ محرمانگی داده‌ها',
      description: 'عدم فروش یا واگذاری اطلاعات شخصی کاربران به اشخاص ثالث',
    },
    {
      title: 'پرداخت امن شاپرک',
      description: 'عدم ذخیره‌سازی اطلاعات کارت بانکی در سرورهای زروان تریپ',
    },
    {
      title: 'انتقال رمزنگاری‌شده',
      description: 'حفاظت از ارتباطات و داده‌ها با پروتکل امنیتی استاندارد SSL',
    },
  ];

  return (
    <main className="mt-4 w-full overflow-x-hidden xl:mt-12" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* هدر صفحه */}
      <header className="mb-5 rounded-2xl border border-zinc-200/80 bg-white p-5 sm:mb-6 sm:p-6 lg:mb-8 lg:p-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between lg:gap-5">
          <div className="max-w-2xl space-y-2 sm:space-y-3">
            <h1 className="text-xl font-black text-zinc-900 text-balance sm:text-2xl lg:text-3xl">
              حریم خصوصی کاربران و امنیت اطلاعات
            </h1>
            <p className="text-xs font-medium leading-7 text-zinc-500 sm:text-sm lg:text-[15px]">
              شفافیت در نحوه گردآوری، نگهداری و محافظت از داده‌های مسافران و
              کاربران در سامانه رزرواسیون آنلاین زروان تریپ.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
            <span>آخرین به‌روزرسانی: آبان ۱۴۰۵</span>
            <span aria-hidden="true">·</span>
            <span>زمان مطالعه: ۳ دقیقه</span>
          </div>
        </div>

        {/* اصول کلیدی امنیت */}
        <div className="mt-5 grid gap-4 border-t border-zinc-100 pt-5 sm:mt-8 sm:grid-cols-2 sm:pt-6 md:grid-cols-3 md:gap-6">
          {trustPillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`space-y-1 ${
                idx === trustPillars.length - 1 ? 'sm:col-span-2 md:col-span-1' : ''
              }`}
            >
              <div className="text-xs font-extrabold text-zinc-900 sm:text-sm">
                {pillar.title}
              </div>
              <p className="text-xs font-medium leading-6 text-zinc-500">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* بدنه دو ستونه: فهرست مطالب + متن سند */}
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[16.5rem_1fr] lg:items-start lg:gap-8">
        {/* فهرست مطالب واکنش‌گرا: در موبایل نوار اسکرول افقی جمع‌وجور، در تبلت دو ستونه و در دسکتاپ ستون چسبان */}
        <aside className="min-w-0 rounded-2xl border border-zinc-200/80 bg-white p-3.5 sm:p-5 lg:sticky lg:top-24">
          <div className="mb-2.5 text-xs font-extrabold text-zinc-900 lg:mb-4">
            فهرست بخش‌ها
          </div>

          <nav
            aria-label="فهرست حریم خصوصی"
            className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:gap-1 sm:overflow-visible sm:pb-0 lg:grid-cols-1"
          >
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex min-h-[40px] shrink-0 items-center gap-2 rounded-lg border border-zinc-100 bg-zinc-50/70 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors duration-150 hover:bg-zinc-100 hover:text-cs-red sm:shrink sm:gap-2.5 sm:border-transparent sm:bg-transparent sm:px-2.5 sm:text-zinc-600 sm:hover:bg-zinc-50 whitespace-nowrap sm:whitespace-normal"
              >
                <span className="shrink-0 font-extrabold text-cs-red tabular-nums">
                  {item.number}
                </span>
                <span className="sm:truncate">{item.title}</span>
              </a>
            ))}
          </nav>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3 text-xs font-semibold lg:mt-5 lg:block lg:space-y-2 lg:pt-4">
            <Link
              href="/rules"
              className="block text-zinc-500 transition-colors hover:text-zinc-900"
            >
              مطالعه قوانین و مقررات رزرو
            </Link>
            <Link
              href="/contact-us"
              className="block text-cs-blue transition-colors hover:underline"
            >
              تماس با پشتیبانی
            </Link>
          </div>
        </aside>

        {/* محتوای اصلی حریم خصوصی */}
        <article className="min-w-0 rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 lg:p-10">
          <div className="divide-y divide-zinc-100 text-right text-sm leading-8 text-zinc-600 sm:text-justify lg:text-[15px] lg:leading-8">
            <section id="intro" className="scroll-mt-20 pb-6 sm:pb-8 lg:scroll-mt-28">
              <h2 className="mb-3 flex items-baseline gap-2.5 text-base font-extrabold text-zinc-900 sm:text-lg">
                <span className="text-xs font-black text-cs-red tabular-nums sm:text-sm">
                  ۰۱.
                </span>
                <span>مقدمه و تعهدات ما</span>
              </h2>
              <p>
                وب‌سایت رزرواسیون آنلاین{' '}
                <strong className="font-extrabold text-zinc-900">
                  زروان تریپ
                </strong>{' '}
                به حریم خصوصی کاربران خود احترام می‌گذارد و متعهد به حفاظت از
                اطلاعات شخصی شماست. این سند توضیح می‌دهد که ما چه اطلاعاتی را
                جمع‌آوری می‌کنیم، چگونه از آن‌ها استفاده می‌کنیم و چه اقداماتی
                برای حفظ امنیت آن‌ها انجام می‌دهیم. استفاده شما از خدمات سایت به
                منزله پذیرش این سیاست‌ها می‌باشد.
              </p>
            </section>

            <section id="collection" className="scroll-mt-20 py-6 sm:py-8 lg:scroll-mt-28">
              <h2 className="mb-3 flex items-baseline gap-2.5 text-base font-extrabold text-zinc-900 sm:text-lg">
                <span className="text-xs font-black text-cs-red tabular-nums sm:text-sm">
                  ۰۲.
                </span>
                <span>اطلاعاتی که جمع‌آوری می‌کنیم</span>
              </h2>
              <p>
                برای ارائه خدمات رزرو هتل و صدور واچر، ما به اطلاعاتی از قبیل
                نام و نام خانوادگی، کد ملی (یا شماره پاسپورت برای اتباع)، شماره
                تماس و آدرس ایمیل نیاز داریم. همچنین در هنگام پرداخت، اطلاعات
                هویتی تراکنش به صورت امن ثبت می‌گردد (اطلاعات کارت بانکی شما
                مستقیماً در درگاه شاپرک وارد شده و در سایت ما ذخیره نمی‌شود).
              </p>
            </section>

            <section id="usage" className="scroll-mt-20 py-6 sm:py-8 lg:scroll-mt-28">
              <h2 className="mb-4 flex items-baseline gap-2.5 text-base font-extrabold text-zinc-900 sm:text-lg">
                <span className="text-xs font-black text-cs-red tabular-nums sm:text-sm">
                  ۰۳.
                </span>
                <span>نحوه استفاده از اطلاعات</span>
              </h2>
              <ul className="space-y-3 text-zinc-600">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-extrabold text-cs-red tabular-nums">
                    ۱.
                  </span>
                  <span>
                    تکمیل فرآیند رزرواسیون و ارسال مشخصات مسافر به هتل یا
                    اقامتگاه مربوطه.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-extrabold text-cs-red tabular-nums">
                    ۲.
                  </span>
                  <span>
                    ارسال پیامک‌های اطلاع‌رسانی، فاکتور، کد تایید و لینک واچر.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-extrabold text-cs-red tabular-nums">
                    ۳.
                  </span>
                  <span>
                    پشتیبانی سریع‌تر و پیگیری شکایات یا درخواست‌های کنسلی.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-xs font-extrabold text-cs-red tabular-nums">
                    ۴.
                  </span>
                  <span>جلوگیری از تقلب و تراکنش‌های غیرمجاز.</span>
                </li>
              </ul>
            </section>

            <section id="security" className="scroll-mt-20 py-6 sm:py-8 lg:scroll-mt-28">
              <h2 className="mb-3 flex items-baseline gap-2.5 text-base font-extrabold text-zinc-900 sm:text-lg">
                <span className="text-xs font-black text-cs-red tabular-nums sm:text-sm">
                  ۰۴.
                </span>
                <span>حفاظت و امنیت داده‌ها</span>
              </h2>
              <p>
                زروان تریپ از پروتکل‌های امنیتی استاندارد (مانند SSL) برای
                رمزنگاری اطلاعات شما در بستر اینترنت استفاده می‌کند. دسترسی به
                پایگاه داده کاربران به شدت محدود بوده و اطلاعات شخصی شما به هیچ
                وجه به اشخاص ثالث (جز هتل محل اقامت جهت پذیرش) فروخته یا اجاره
                داده نخواهد شد. در صورت درخواست مراجع قضایی ذی‌صلاح، اطلاعات طبق
                قانون ارائه می‌گردد.
              </p>
            </section>

            <section id="updates" className="scroll-mt-20 pt-6 sm:pt-8 lg:scroll-mt-28">
              <h2 className="mb-3 flex items-baseline gap-2.5 text-base font-extrabold text-zinc-900 sm:text-lg">
                <span className="text-xs font-black text-cs-red tabular-nums sm:text-sm">
                  ۰۵.
                </span>
                <span>تغییرات در حریم خصوصی</span>
              </h2>
              <p>
                زروان تریپ حق تغییر و بروزرسانی این قوانین را در هر زمان برای خود
                محفوظ می‌دارد. هرگونه تغییر در همین صفحه اطلاع‌رسانی خواهد شد و
                ادامه استفاده شما از سایت به معنای پذیرش تغییرات جدید است.
              </p>
            </section>
          </div>

          {/* بخش تماس در انتهای سند */}
          <div className="mt-8 flex flex-col gap-4 rounded-xl bg-zinc-50 p-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="space-y-1">
              <p className="text-sm font-extrabold text-zinc-900">
                سوالی درباره حریم خصوصی دارید؟
              </p>
              <p className="text-xs font-medium leading-6 text-zinc-500">
                تیم پشتیبانی ۲۴ ساعته زروان تریپ آماده پاسخگویی به پرسش‌های
                شماست.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center shrink-0">
              <a
                href="tel:02122347613"
                dir="ltr"
                className="flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-800 tabular-nums transition-colors hover:border-zinc-300 hover:bg-zinc-50 sm:h-10 sm:w-auto"
              >
                021-22347613
              </a>
              <Link
                href="/contact-us"
                className="flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-cs-dark-blue px-4 text-xs font-bold text-white transition-colors hover:bg-zinc-800 sm:h-10 sm:w-auto"
              >
                تماس با پشتیبانی
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}