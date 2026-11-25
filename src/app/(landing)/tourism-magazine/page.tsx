import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Eye, Sparkles } from 'lucide-react';
import { home } from '@/constants/landing/home';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: `مجله گردشگری و راهنمای سفر | ${SITE_NAME}`,
  description:
    'جدیدترین مقالات راهنمای سفر، معرفی هتل‌های لوکس، جاذبه‌های گردشگری شهرهای ایران و جهان و نکات کاربردی رزرو هتل در مجله گردشگری زروان تریپ.',
  keywords: [
    'مجله گردشگری',
    'وبلاگ سفر',
    'راهنمای سفر',
    'جاذبه‌های گردشگری',
    'معرفی هتل',
    'زروان تریپ',
  ],
  alternates: {
    canonical: `${SITE_URL}/tourism-magazine`,
  },
  openGraph: {
    title: `مجله گردشگری زروان تریپ | راهنمای جامع سفر و هتل`,
    description:
      'خواندنی‌ترین مقالات گردشگری، راهنمای سفر به شهرهای مختلف و بررسی تخصصی هتل‌ها.',
    url: `${SITE_URL}/tourism-magazine`,
    siteName: SITE_NAME,
    locale: 'fa_IR',
    type: 'website',
    images: [{ url: DEFAULT_OG_IMAGE, alt: 'مجله گردشگری زروان تریپ' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `مجله گردشگری زروان تریپ`,
    description: 'راهنمای سفر، جاذبه‌های گردشگری و معرفی بهترین هتل‌ها.',
    images: [DEFAULT_OG_IMAGE],
  },
};

const storyCategories = [
  { id: 1, title: 'پایتخت (تهران)', image: '/image/city/tehran.png' },
  { id: 2, title: 'اصفهان', image: '/image/city/shiraz.png' },
  { id: 3, title: 'بوشهر', image: '/image/city/antalia.png' },
  { id: 4, title: 'چهارمحال بختیاری', image: '/image/city/mashhad.png' },
  { id: 5, title: 'مازندران', image: '/image/city/tehran.png' },
  { id: 6, title: 'بندر عباس', image: '/image/city/antalia.png' },
  { id: 7, title: 'کرمانشاه', image: '/image/city/mashhad.png' },
  { id: 8, title: 'آذربایجان غربی', image: '/image/city/shiraz.png' },
  { id: 9, title: 'مشهد', image: '/image/city/mashhad.png' },
  { id: 10, title: 'گلستان', image: '/image/city/tehran.png' },
];

export default function TourismMagazinePage() {
  const blogs = home.interestingBLogs;
  const featuredBlog = blogs[0];
  const remainingBlogs = blogs.slice(1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/tourism-magazine#blog`,
        url: `${SITE_URL}/tourism-magazine`,
        name: `مجله گردشگری ${SITE_NAME}`,
        description:
          'مقالات راهنمای سفر و معرفی هتل‌های ایران و جهان در مجله زروان تریپ.',
        publisher: {
          '@type': 'TravelAgency',
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'خانه', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'مجله گردشگری',
            item: `${SITE_URL}/tourism-magazine`,
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
      <main className="container mx-auto px-4 py-6 lg:py-8 space-y-10">
        
        {/* Story / Category Circles Bar matching Figma screenshot */}
        <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-zinc-100">
          <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-none justify-start lg:justify-between">
            {storyCategories.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group"
              >
                <div className="relative size-16 sm:size-20 rounded-full p-0.5 bg-gradient-to-tr from-red-500 to-pink-500 transition-transform duration-300 group-hover:scale-105 shadow-md">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-white border-2 border-white">
                    <Image
                      fill
                      src={item.image}
                      alt={item.title}
                      className="object-cover"
                    />
                  </div>
                </div>
                <span className="text-xs font-extrabold text-zinc-800 text-center max-w-[5rem] truncate">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col gap-2 text-center lg:text-right border-b border-zinc-100 pb-6">
          <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-cs-blue font-bold text-xs uppercase tracking-wider">
            <Sparkles className="size-4" />
            مجله گردشگری و وبلاگ سفر
          </div>
          <h1 className="text-xl font-black text-zinc-900 lg:text-3xl">
            راهنمای سفر و خواندنی‌های هتل‌ها
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-zinc-500 max-w-2xl">
            با مقالات تخصصی زروان تریپ، جاذبه‌های گردشگری شهرهای ایران و جهان را بشناسید و بهترین انتخاب را برای اقامت و رزرو هتل داشته باشید.
          </p>
        </div>

        {/* Featured Hero Article */}
        {featuredBlog && (
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white shadow-xl lg:grid lg:grid-cols-2">
            <div className="relative h-64 lg:h-full min-h-[22rem]">
              <Image
                fill
                priority
                src={featuredBlog.image}
                alt={featuredBlog.title}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 lg:hidden" />
              {featuredBlog.mostVisited && (
                <span className="absolute top-4 right-4 rounded-xl bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-md">
                  محبوب‌ترین مقاله
                </span>
              )}
            </div>
            <div className="flex flex-col justify-center p-6 lg:p-12 space-y-6">
              <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {featuredBlog.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  ۴ دقیقه مطالعه
                </span>
              </div>
              <h2 className="text-xl font-black lg:text-3xl leading-snug">
                {featuredBlog.title}
              </h2>
              <p className="text-sm font-medium text-zinc-300 leading-relaxed line-clamp-3 lg:line-clamp-4">
                {featuredBlog.desc}
              </p>
              <div>
                <Link
                  href={`/tourism-magazine/${featuredBlog.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-zinc-900 transition hover:bg-zinc-100 shadow-sm"
                >
                  <span>مطالعه کامل مقاله</span>
                  <Eye className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid */}
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-zinc-900 lg:text-xl">
            آخرین مقالات و راهنمای سفر
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {remainingBlogs.map((blog) => (
              <article
                key={blog.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white border border-zinc-100 shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                  <Image
                    fill
                    src={blog.image}
                    alt={blog.title}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {blog.mostVisited && (
                    <span className="absolute top-3 right-3 rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow">
                      پربازدید
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-400">
                    <span>{blog.date}</span>
                    <span>۳ دقیقه مطالعه</span>
                  </div>
                  <h3 className="font-extrabold text-zinc-900 line-clamp-1 text-base">
                    {blog.title}
                  </h3>
                  <p className="text-xs font-medium text-zinc-600 line-clamp-3 leading-relaxed">
                    {blog.desc}
                  </p>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-zinc-50">
                    <Link
                      href={`/tourism-magazine/${blog.id}`}
                      className="text-xs font-bold text-cs-blue hover:underline"
                    >
                      ادامه مطلب ←
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
