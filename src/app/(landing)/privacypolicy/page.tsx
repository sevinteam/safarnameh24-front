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

  return (
    <main className="container mx-auto px-4 py-10 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-6 shadow-sm border border-zinc-100 lg:p-10">
        
        {/* هدر صفحه */}
        <div className="mb-10 border-b border-zinc-100 pb-6 text-center">
          <h1 className="text-2xl font-black text-zinc-900 lg:text-3xl">حریم خصوصی کاربران</h1>
          <p className="mt-3 text-sm font-medium text-zinc-500">
            آخرین به‌روزرسانی: آبان ۱۴۰۵
          </p>
        </div>

        {/* محتوای حریم خصوصی */}
        <div className="space-y-8 text-sm leading-8 text-zinc-700 lg:text-base lg:leading-9 text-justify">
          
          <section>
            <h2 className="mb-3 text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cs-dark-blue"></span>
              مقدمه و تعهدات ما
            </h2>
            <p>
              وب‌سایت رزرواسیون آنلاین <strong>زروان تریپ</strong> به حریم خصوصی کاربران خود احترام می‌گذارد و متعهد به حفاظت از اطلاعات شخصی شماست. این سند توضیح می‌دهد که ما چه اطلاعاتی را جمع‌آوری می‌کنیم، چگونه از آن‌ها استفاده می‌کنیم و چه اقداماتی برای حفظ امنیت آن‌ها انجام می‌دهیم. استفاده شما از خدمات سایت به منزله پذیرش این سیاست‌ها می‌باشد.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cs-dark-blue"></span>
              اطلاعاتی که جمع‌آوری می‌کنیم
            </h2>
            <p>
              برای ارائه خدمات رزرو هتل و صدور واچر، ما به اطلاعاتی از قبیل نام و نام خانوادگی، کد ملی (یا شماره پاسپورت برای اتباع)، شماره تماس و آدرس ایمیل نیاز داریم. همچنین در هنگام پرداخت، اطلاعات هویتی تراکنش به صورت امن ثبت می‌گردد (اطلاعات کارت بانکی شما مستقیماً در درگاه شاپرک وارد شده و در سایت ما ذخیره نمی‌شود).
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cs-dark-blue"></span>
              نحوه استفاده از اطلاعات
            </h2>
            <ul className="list-inside list-disc space-y-2 pr-4 text-zinc-600">
              <li>تکمیل فرآیند رزرواسیون و ارسال مشخصات مسافر به هتل یا اقامتگاه مربوطه.</li>
              <li>ارسال پیامک‌های اطلاع‌رسانی، فاکتور، کد تایید و لینک واچر.</li>
              <li>پشتیبانی سریع‌تر و پیگیری شکایات یا درخواست‌های کنسلی.</li>
              <li>جلوگیری از تقلب و تراکنش‌های غیرمجاز.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cs-dark-blue"></span>
              حفاظت و امنیت داده‌ها
            </h2>
            <p>
              زروان تریپ از پروتکل‌های امنیتی استاندارد (مانند SSL) برای رمزنگاری اطلاعات شما در بستر اینترنت استفاده می‌کند. دسترسی به پایگاه داده کاربران به شدت محدود بوده و اطلاعات شخصی شما به هیچ وجه به اشخاص ثالث (جز هتل محل اقامت جهت پذیرش) فروخته یا اجاره داده نخواهد شد. در صورت درخواست مراجع قضایی ذی‌صلاح، اطلاعات طبق قانون ارائه می‌گردد.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-extrabold text-zinc-900 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cs-dark-blue"></span>
              تغییرات در حریم خصوصی
            </h2>
            <p>
              زروان تریپ حق تغییر و بروزرسانی این قوانین را در هر زمان برای خود محفوظ می‌دارد. هرگونه تغییر در همین صفحه اطلاع‌رسانی خواهد شد و ادامه استفاده شما از سایت به معنای پذیرش تغییرات جدید است.
            </p>
          </section>

          <section className="mt-10 rounded-xl bg-zinc-50 p-5 text-center">
            <p className="font-bold text-zinc-800">سوالی دارید؟</p>
            <p className="mt-2 text-sm text-zinc-600">
              در صورت داشتن هرگونه سوال درباره حریم خصوصی، می‌توانید از طریق صفحه{' '}
              <Link href="/contact-us" className="text-cs-blue hover:underline">
                تماس با ما
              </Link>{' '}
              یا شماره تلفن پشتیبانی (۰۲۱۲۲۳۴۷۶۱۳) با ما در ارتباط باشید.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}