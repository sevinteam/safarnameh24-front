import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Share2 } from 'lucide-react';
import { home } from '@/constants/landing/home';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = home.interestingBLogs.find(
    (b) => String(b.id) === slug || b.title.includes(slug),
  ) || home.interestingBLogs[0];

  const title = `${blog.title} | مجله گردشگری ${SITE_NAME}`;
  const description = blog.desc.slice(0, 150) + '...';
  const imageUrl = blog.image.startsWith('http')
    ? blog.image
    : `${SITE_URL}${blog.image}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/tourism-magazine/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/tourism-magazine/${slug}`,
      siteName: SITE_NAME,
      locale: 'fa_IR',
      type: 'article',
      images: [{ url: imageUrl, alt: blog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function TourismMagazineDetail({ params }: Props) {
  const { slug } = await params;
  const blog = home.interestingBLogs.find(
    (b) => String(b.id) === slug || b.title.includes(slug),
  ) || home.interestingBLogs[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${SITE_URL}/tourism-magazine/${slug}#article`,
        headline: blog.title,
        description: blog.desc,
        image: blog.image.startsWith('http') ? blog.image : `${SITE_URL}${blog.image}`,
        datePublished: '2026-01-01T00:00:00+03:30',
        dateModified: '2026-11-25T00:00:00+03:30',
        author: {
          '@type': 'Organization',
          name: SITE_NAME,
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: DEFAULT_OG_IMAGE,
          },
        },
        mainEntityOfPage: `${SITE_URL}/tourism-magazine/${slug}`,
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
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: `${SITE_URL}/tourism-magazine/${slug}`,
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
      <main className="container mx-auto px-4 py-8 lg:py-12 max-w-4xl space-y-8">
        {/* Featured Image */}
        <div className="relative h-72 sm:h-96 w-full overflow-hidden rounded-2xl bg-zinc-100 shadow-sm">
          <Image
            fill
            priority
            src={blog.image}
            alt={blog.title}
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <article className="prose prose-zinc max-w-none text-zinc-700 text-sm sm:text-base leading-8 sm:leading-9 text-justify space-y-6">
          <h1 className="text-2xl font-black text-zinc-900 lg:text-3xl leading-tight mb-2">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-500 pb-4 border-b border-zinc-100 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              تاریخ انتشار: {blog.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              زمان مطالعه: ۴ دقیقه
            </span>
          </div>

          <p className="font-semibold text-lg text-zinc-900 leading-relaxed">
            {blog.desc}
          </p>
          <p>
            سفر کردن یکی از بهترین راه‌ها برای تجربه‌اندوزی، آشنایی با فرهنگ‌های جدید و فاصله گرفتن از روزمرگی‌هاست. انتخاب محل اقامت مناسب و هتل باکیفیت نقش بسیار مهمی در کیفیت سفر شما دارد. در این مقاله به بررسی نکات کلیدی، جاذبه‌های دیدنی و راهنمای کامل رزرو هتل پرداخته‌ایم تا سفری خاطره‌انگیز را تجربه کنید.
          </p>
          <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 pt-4">
            چرا برنامه‌ریزی پیش از سفر اهمیت دارد؟
          </h2>
          <p>
            هنگامی که مقصد سفر خود را انتخاب می‌کنید، بررسی دقیق امکانات رفاهی، دسترسی به مراکز خرید و جاهای دیدنی، و همچنین مقایسه قیمت هتل‌ها از طریق سامانه‌های معتبر مانند سفرنامه ۲۴ به شما کمک می‌کند تا هم در هزینه‌ها صرفه‌جویی کنید و هم اقامتی بی‌دغدغه داشته باشید.
          </p>
          <blockquote className="border-r-4 border-cs-blue bg-zinc-50 p-4 rounded-l-xl text-zinc-800 font-bold my-6">
            «پیشنهاد می‌کنیم پیش از نهایی کردن رزرو هتل، نظرات مسافران قبلی و امتیاز پاکیزگی و کیفیت غذا را به دقت مطالعه کنید.»
          </blockquote>
          <h2 className="text-lg sm:text-xl font-extrabold text-zinc-900 pt-4">
            جمع‌بندی و رزرو آنلاین هتل
          </h2>
          <p>
            در نهایت، رزرو آنلاین هتل از طریق سفرنامه ۲۴ با تضمین بهترین قیمت و صدور آنی واچر به شما آرامش خاطر می‌دهد تا بدون هیچ‌گونه نگرانی برای سفر خود آماده شوید. پشتیبانی ۲۴ ساعته تیم ما در تمامی مراحل سفر در کنار شماست.
          </p>
        </article>

        {/* Share & Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-600">
            <Share2 className="size-4" />
            <span>اشتراک‌گذاری این مقاله:</span>
          </div>
          <Link
            href="/hotel"
            className="rounded-xl bg-cs-dark-blue px-6 py-3 text-xs font-bold text-white transition hover:bg-cs-dark-blue/90 shadow-sm"
          >
            مشاهده لیست هتل‌ها و رزرو آنلاین ←
          </Link>
        </div>
      </main>
    </>
  );
}
