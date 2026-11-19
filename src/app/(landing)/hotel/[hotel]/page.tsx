import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import { apiBaseUrl } from '@/constants';
import { hotel } from '@/constants/landing';

// ایمپورت‌های کامپوننت‌ها
import { 
  Tags, Rooms, Pictures, Facilities, Description, SectionLinks, 
  EssentialTips, ImportantPlaces, CustomerReviews, SuggestedHotels, 
  AdditionalDetails, InitialInformation, RulesAndRegulations, FrequentlyQuestions 
} from '@/components/landing/modules/hotel';
import HotelWrapper from '@/components/landing/modules/hotel/molecules/HotelWrapper';
import StickyArea from '@/components/landing/shared/StickyArea';
import Configs from '@/components/landing/modules/hotel/Configs';
import { TopBarConfig } from '@/components/landing/shared';
import { Section } from '@/components/landing/modules/hotel/molecules/Section';
import Sharing from '@/components/landing/modules/hotel/molecules/sharing/Sharing';
import { FavoriteButton } from '@/components/landing/modules/hotel/molecules/favorite-button';
import MImageGallery from '@/components/landing/modules/hotel/molecules/pictures-gallery/MImageGallery';
import DImageGallery from '@/components/landing/modules/hotel/molecules/pictures-gallery/LSPicturesGallery';

type Props = { params: Promise<{ hotel: string }> };

// ۱. فچ کش‌شده سئو (جلوگیری از ریکوئست‌های تکراری)
const getHotelSeo = cache(async (hotelSlug: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/hotel/seo/${hotelSlug}/`, {
      next: { revalidate: 3600 }, // کش ۱ ساعته ISR
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching SEO:", error);
    return null;
  }
});

// ۲. فچ کش‌شده اطلاعات پایه هتل
const getHotelIntroduction = cache(async (hotelSlug: string) => {
  try {
    const res = await fetch(`${apiBaseUrl}/hotel/hotels/${hotelSlug}/introduction/`, {
      next: { revalidate: 3600 }, // کش ۱ ساعته
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching hotel introduction:", error);
    return null;
  }
});

// ۳. تولید متادیتای کاملاً پویا و ایمن صفحه
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { hotel: hotelSlug } = await params;
  
  // ابتدا تلاش برای دریافت دیتای سئو و اطلاعات هتل به صورت همزمان
  const [seo, hotelData] = await Promise.all([
    getHotelSeo(hotelSlug),
    getHotelIntroduction(hotelSlug)
  ]);

  // رمزگشایی اسلاگ برای استفاده در تایتل (در صورتی که فارسی باشد)
  const decodedSlug = decodeURIComponent(hotelSlug).replace(/-/g, ' ');

  // اگر دیتای سئو وجود داشت، از آن استفاده کن
  if (seo && seo.title_tag) {
    return {
      title: seo.title_tag,
      description: seo.description || `رزرو هتل در زروان تریپ`,
      keywords: Array.isArray(seo.keywords) ? seo.keywords : [],
      robots: {
        index: !seo.no_index,
        follow: !seo.no_index,
      },
      alternates: {
        canonical: seo.canonical_url || `https://zarvantrip.com/hotel/${hotelSlug}`,
      },
      openGraph: {
        title: seo.og_title || seo.title_tag,
        description: seo.og_description || seo.description,
        images: seo.og_image ? [{ url: seo.og_image }] : [],
        type: 'website',
        locale: 'fa_IR',
      },
    };
  }

  // اگر دیتای سئو نبود، اما اطلاعات پایه هتل لود شد (تایتل پویا بر اساس نام هتل)
  if (hotelData && hotelData.name) {
    return {
      title: `رزرو هتل ${hotelData.name} با بهترین قیمت | زروان تریپ`,
      description: `رزرو آنلاین و اطلاعات کامل هتل ${hotelData.name} ${hotelData.city_name ? `در ${hotelData.city_name}` : ''} با تخفیف ویژه در زروان تریپ.`,
      alternates: {
        canonical: `https://zarvantrip.com/hotel/${hotelSlug}`,
      }
    };
  }

  // حالت سقوط نهایی (Fallback) به جای نمایش تایتل صفحه اصلی، از نام اسلاگ استفاده می‌کند
  return {
    title: `رزرو هتل ${decodedSlug} | زروان تریپ`,
    description: `رزرو آنلاین هتل ${decodedSlug} با بهترین قیمت و پشتیبانی ۲۴ ساعته در زروان تریپ.`,
    alternates: {
      canonical: `https://zarvantrip.com/hotel/${hotelSlug}`,
    }
  };
}

export default async function Hotel({ params }: Props) {
  const { hotel: hotelSlug } = await params;
  const sectionLinks = hotel?.sectionLinks || [];

  // دریافت اطلاعات پایه هتل
  const hotelData = await getHotelIntroduction(hotelSlug);
  if (!hotelData) {
    notFound();
  }

  // تعریف اسکیما غنی‌شده برای گوگل
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotelData.name,
    description: hotelData.description || `رزرو هتل ${hotelData.name} در زروان تریپ`,
    starRating: {
      '@type': 'Rating',
      ratingValue: hotelData.stars || 3,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: hotelData.city_name || 'ایران',
      streetAddress: hotelData.address || '',
    },
    ...(hotelData.logo_preview ? { image: hotelData.logo_preview } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HotelWrapper>
        <StickyArea
          scrollFromTop={500}
          fixedClassName="pb-0"
          staticClassName="mt-5"
          childrenStatus={{ fixed: true }}
          searchbarStatus={{ static: true, fixed: true }}
        >
          <div className="-mx-5 -mt-3">
            <SectionLinks sectionList={sectionLinks} />
          </div>
        </StickyArea>

        <div className="relative mt-5 flex flex-col gap-14 lg:mt-12 lg:gap-20">
          <Pictures hotelSlug={hotelSlug} />

          <div className="relative -my-8 flex h-16 gap-3 rounded-xl bg-white p-2.5 shadow-xl shadow-black/5 lg:hidden">
            <FavoriteButton hotelSlug={hotelSlug} />
            <div className="grid flex-1 grid-cols-2 gap-3 sm:mr-auto sm:w-60 sm:flex-none">
              <Sharing />
              <MImageGallery hotelSlug={hotelSlug} />
              <DImageGallery hotelSlug={hotelSlug} />
            </div>
          </div>

          <div className="-mx-5 -mb-6 flex h-12 items-center overflow-hidden bg-white pt-1 shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.03)] lg:hidden">
            <SectionLinks sectionList={sectionLinks} />
          </div>

          <Configs hotelSlug={hotelSlug} sectionList={sectionLinks} />

          <div>
            <TopBarConfig className="mb-1 lg:mb-2" title={{ type: 'single', text: 'توضیحات هتل' }} />
            <div id="description" className="grid items-start gap-12 lg:grid-cols-2">
              <Description hotelSlug={hotelSlug} />
              <InitialInformation hotelSlug={hotelSlug} />
            </div>
          </div>

          <Rooms hotelSlug={hotelSlug} />

          <AdditionalDetails hotelSlug={hotelSlug} />

          <Section sectionID="rules" className="grid items-start gap-8 lg:grid-cols-2">
            <RulesAndRegulations hotelSlug={hotelSlug} />
            <EssentialTips hotelSlug={hotelSlug} />
          </Section>

          <Facilities hotelSlug={hotelSlug} />

          <ImportantPlaces hotelSlug={hotelSlug} />

          <FrequentlyQuestions hotelSlug={hotelSlug} />

          <Suspense fallback={<div className="h-40 w-full animate-pulse rounded-2xl bg-zinc-100" />}>
            <CustomerReviews hotelSlug={hotelSlug} />
          </Suspense>

          <Tags hotelSlug={hotelSlug} />

          <Suspense fallback={<div className="h-40 w-full animate-pulse rounded-2xl bg-zinc-100" />}>
            <SuggestedHotels hotelSlug={hotelSlug} />
          </Suspense>
        </div>
      </HotelWrapper>
    </>
  );
}