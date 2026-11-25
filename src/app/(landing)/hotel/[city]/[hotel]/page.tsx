import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { ChevronLeft, MapPin, Star } from 'lucide-react';
import { hotel } from '@/constants/landing';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
  fetchBackendJson,
  safeDecode,
  toHttpsUrl,
} from '@/lib/seo';

import {
  Tags,
  Rooms,
  Pictures,
  Facilities,
  Description,
  SectionLinks,
  EssentialTips,
  ImportantPlaces,
  CustomerReviews,
  SuggestedHotels,
  AdditionalDetails,
  InitialInformation,
  RulesAndRegulations,
  FrequentlyQuestions,
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

type Props = {
  params: Promise<{
    city: string;
    hotel: string;
  }>;
};

type HotelSeoResponse = {
  title_tag?: string;
  description?: string;
  keywords?: string[] | string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  no_index?: boolean;
};

type HotelIntroResponse = {
  id: number;
  name: string;
  city_name?: string;
  city_slug?: string;
  latitude?: string;
  longitude?: string;
  logo_preview?: string;
  stars?: number;
  address?: string;
  floors_count?: number;
  rooms_count?: number;
  check_in_time?: string;
  check_out_time?: string;
};

type HotelDescriptionResponse = { description?: string };
type HotelFurtherDescriptionResponse = { further_description?: string };
type HotelRulesResponse = { rules?: string; important_notes?: string };
type HotelFacilityItem = { id?: number; title: string; icon?: unknown };
type HotelFacilitiesResponse = {
  name?: string;
  facilities?: HotelFacilityItem[];
  room_facilities?: HotelFacilityItem[];
};
type HotelFaqItem = { question: string; answer: string };
type HotelCommentItem = {
  id?: number;
  first_name?: string;
  last_name?: string;
  text?: string;
  stars?: number;
  created_date?: string;
};
type HotelPointsSummary = {
  average_score?: number;
  items?: Array<{ id?: number; title: string; average: number }>;
};
type HotelTagItem = { id?: number; title: string };
type HotelRoomItem = {
  price?: {
    total_price?: number;
    total_price_discount?: number;
  };
  price_calendar?: Array<{
    price?: {
      price?: number;
      price_after_discount?: number;
    };
  }>;
};

const getHotelSeo = cache((slug: string) =>
  fetchBackendJson<HotelSeoResponse>(`/hotel/hotels/${slug}/seo/`),
);
const getHotelIntroduction = cache((slug: string) =>
  fetchBackendJson<HotelIntroResponse>(`/hotel/hotels/${slug}/introduction/`),
);
const getHotelDescription = cache((slug: string) =>
  fetchBackendJson<HotelDescriptionResponse>(
    `/hotel/hotels/${slug}/description/`,
  ),
);
const getHotelImages = cache((slug: string) =>
  fetchBackendJson<string[]>(`/hotel/hotels/${slug}/images/`),
);
const getHotelFacilities = cache((slug: string) =>
  fetchBackendJson<HotelFacilitiesResponse>(
    `/hotel/hotels/${slug}/all-facilities/`,
  ),
);
const getHotelFaqs = cache((slug: string) =>
  fetchBackendJson<HotelFaqItem[]>(`/hotel/hotels/${slug}/faq/`),
);
const getHotelComments = cache((slug: string) =>
  fetchBackendJson<HotelCommentItem[]>(`/hotel/hotels/${slug}/comments/`),
);
const getHotelPointsSummary = cache((slug: string) =>
  fetchBackendJson<HotelPointsSummary>(
    `/hotel/hotels/${slug}/comments/points-summary/`,
  ),
);
const getHotelTags = cache((slug: string) =>
  fetchBackendJson<HotelTagItem[]>(`/hotel/hotels/${slug}/tags/`),
);
const getHotelRules = cache((slug: string) =>
  fetchBackendJson<HotelRulesResponse>(`/hotel/hotels/${slug}/rules/`),
);
const getHotelNearbyPlaces = cache((slug: string) =>
  fetchBackendJson<unknown[]>(`/hotel/hotels/${slug}/nearby-places/`),
);
const getHotelFurtherDescription = cache((slug: string) =>
  fetchBackendJson<HotelFurtherDescriptionResponse>(
    `/hotel/hotels/${slug}/further-description/`,
  ),
);
const getHotelRooms = cache((slug: string) =>
  fetchBackendJson<HotelRoomItem[]>(`/hotel/hotels/${slug}/rooms/`),
);

function parseKeywords(
  seoKeywords?: string[] | string,
  tags?: HotelTagItem[] | null,
): string[] {
  const fromSeo = Array.isArray(seoKeywords)
    ? seoKeywords
    : typeof seoKeywords === 'string'
      ? seoKeywords
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean)
      : [];

  const fromTags = Array.isArray(tags)
    ? tags.map((t) => t.title).filter(Boolean)
    : [];

  return Array.from(new Set([...fromSeo, ...fromTags]));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, hotel: hotelSlug } = await params;

  const [seo, hotelData, descriptionData, images, tags] = await Promise.all([
    getHotelSeo(hotelSlug),
    getHotelIntroduction(hotelSlug),
    getHotelDescription(hotelSlug),
    getHotelImages(hotelSlug),
    getHotelTags(hotelSlug),
  ]);

  const decodedSlug = safeDecode(hotelSlug).replace(/-/g, ' ');
  const citySlug = hotelData?.city_slug || city;
  const canonicalUrl =
    seo?.canonical_url || `${SITE_URL}/hotel/${citySlug}/${hotelSlug}`;

  const hotelDisplayName = hotelData?.name
    ? `هتل ${hotelData.stars ? `${hotelData.stars} ستاره ` : ''}${hotelData.name}${hotelData.city_name ? ` ${hotelData.city_name}` : ''}`
    : `هتل ${decodedSlug}`;

  const fallbackTitle = `رزرو ${hotelDisplayName} با بهترین قیمت | ${SITE_NAME}`;
  const rawDesc =
    descriptionData?.description?.replace(/\s+/g, ' ').trim() || '';
  const fallbackDescription = hotelData?.name
    ? `رزرو آنلاین ${hotelDisplayName} با تضمین بهترین قیمت، مشاهده عکس‌ها، امکانات، نظرات مسافران و صدور آنی واچر در ${SITE_NAME}.${rawDesc ? ` ${rawDesc.slice(0, 80)}` : ''}`
    : `رزرو آنلاین هتل ${decodedSlug} با بهترین قیمت و پشتیبانی ۲۴ ساعته در ${SITE_NAME}.`;

  const title = seo?.title_tag?.trim() || fallbackTitle;
  const description = seo?.description?.trim() || fallbackDescription;
  const ogTitle = seo?.og_title?.trim() || title;
  const ogDescription = seo?.og_description?.trim() || description;
  const ogImage =
    toHttpsUrl(seo?.og_image) ||
    toHttpsUrl(Array.isArray(images) ? images[0] : undefined) ||
    toHttpsUrl(hotelData?.logo_preview) ||
    DEFAULT_OG_IMAGE;

  const keywords = parseKeywords(seo?.keywords, tags);
  const shouldIndex = !seo?.no_index;

  return {
    title,
    description,
    ...(keywords.length > 0 ? { keywords } : {}),
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'fa_IR',
      type: 'website',
      images: [
        {
          url: ogImage,
          alt: hotelDisplayName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export default async function Hotel({ params }: Props) {
  const { city, hotel: hotelSlug } = await params;
  // sectionLinks will be computed dynamically after data fetching

  const [
    hotelData,
    seo,
    descriptionData,
    images,
    facilities,
    faqs,
    comments,
    pointsSummary,
    tags,
    rules,
    nearbyPlaces,
    furtherDescription,
    rooms,
  ] = await Promise.all([
    getHotelIntroduction(hotelSlug),
    getHotelSeo(hotelSlug),
    getHotelDescription(hotelSlug),
    getHotelImages(hotelSlug),
    getHotelFacilities(hotelSlug),
    getHotelFaqs(hotelSlug),
    getHotelComments(hotelSlug),
    getHotelPointsSummary(hotelSlug),
    getHotelTags(hotelSlug),
    getHotelRules(hotelSlug),
    getHotelNearbyPlaces(hotelSlug),
    getHotelFurtherDescription(hotelSlug),
    getHotelRooms(hotelSlug),
  ]);

  const hasRules = Boolean(
    (typeof rules?.rules === "string" && rules.rules.trim()) ||
      (typeof rules?.important_notes === "string" && rules.important_notes.trim()),
  );
  const hasFacilities = Boolean(
    facilities &&
      ((Array.isArray(facilities.facilities) && facilities.facilities.length > 0) ||
        (Array.isArray(facilities.room_facilities) && facilities.room_facilities.length > 0)),
  );
  const hasNearbyPlaces = Boolean(
    Array.isArray(nearbyPlaces) && nearbyPlaces.length > 0,
  );
  const hasFaqs = Boolean(Array.isArray(faqs) && faqs.length > 0);

  const sectionLinks: Array<{ id: string; title: string }> = [
    ...(descriptionData?.description ? [{ id: "description", title: "توضیحات هتل" }] : []),
    { id: "rooms", title: "اتاق ها" },
    ...(hasRules ? [{ id: "rules", title: "قوانین و مقررات" }] : []),
    ...(hasFacilities ? [{ id: "facilities-services", title: "امکانات و سرویس ها" }] : []),
    ...(hasNearbyPlaces ? [{ id: "important-places", title: "اماکن اطراف" }] : []),
    ...(hasFaqs ? [{ id: "frequently-questions", title: "سوالات متداول" }] : []),
    { id: "customer-reviews", title: "دیدگاه مسافران" },
    { id: "suggested-hotels", title: "هتل های پیشنهادی" },
  ];

  if (!hotelData) {
    notFound();
  }

  if (
    hotelData.city_slug &&
    safeDecode(city).trim().toLowerCase() !==
      String(hotelData.city_slug).trim().toLowerCase()
  ) {
    notFound();
  }

  const citySlug = hotelData.city_slug || city;
  const pageUrl = `${SITE_URL}/hotel/${citySlug}/${hotelSlug}`;
  const hotelFullName = `هتل ${hotelData.name}${hotelData.city_name ? ` ${hotelData.city_name}` : ''}`;

  // Hydrate React Query cache for instant SSR HTML rendering
  const queryClient = new QueryClient();
  queryClient.setQueryData(['hotel-information', hotelSlug], {
    data: hotelData,
  });
  if (descriptionData) {
    queryClient.setQueryData(['hotel-description', hotelSlug], {
      data: descriptionData,
    });
  }
  if (Array.isArray(images)) {
    queryClient.setQueryData(['hotel-pictures', hotelSlug], images);
  }
  if (facilities) {
    queryClient.setQueryData(['hotel-services', hotelSlug], {
      data: facilities,
    });
  }
  if (Array.isArray(faqs)) {
    queryClient.setQueryData(['hotel-faqs', hotelSlug], { data: faqs });
  }
  if (Array.isArray(comments)) {
    queryClient.setQueryData(['hotel-comments-list', hotelSlug], {
      data: comments,
    });
  }
  if (pointsSummary) {
    queryClient.setQueryData(['hotel-comments-average', hotelSlug], {
      data: pointsSummary,
    });
  }
  if (Array.isArray(tags)) {
    queryClient.setQueryData(['hotel-tags', hotelSlug], { data: tags });
  }
  if (rules) {
    queryClient.setQueryData(['hotel-rules', hotelSlug], { data: rules });
  }
  if (Array.isArray(nearbyPlaces)) {
    queryClient.setQueryData(['hotel-nearby-places', hotelSlug], {
      data: nearbyPlaces,
    });
  }
  if (furtherDescription) {
    queryClient.setQueryData(['hotel-further-description', hotelSlug], {
      data: furtherDescription,
    });
  }

  const schemaImages = Array.from(
    new Set(
      [
        toHttpsUrl(seo?.og_image),
        ...(Array.isArray(images) ? images.map((img) => toHttpsUrl(img)) : []),
        toHttpsUrl(hotelData.logo_preview),
      ].filter((u): u is string => Boolean(u)),
    ),
  );

  const amenityFeatures = [
    ...(facilities?.facilities ?? []),
    ...(facilities?.room_facilities ?? []),
  ]
    .filter((f) => Boolean(f?.title))
    .slice(0, 30)
    .map((f) => ({
      '@type': 'LocationFeatureSpecification',
      name: f.title,
      value: true,
    }));

  const nightlyPricesToman = Array.isArray(rooms)
    ? rooms
        .flatMap((room) =>
          (room.price_calendar ?? []).map(
            (cal) => cal.price?.price_after_discount || cal.price?.price || 0,
          ),
        )
        .filter((p) => typeof p === 'number' && p > 0)
    : [];

  const minPriceIrr =
    nightlyPricesToman.length > 0
      ? Math.min(...nightlyPricesToman) * 10
      : undefined;
  const maxPriceIrr =
    nightlyPricesToman.length > 0
      ? Math.max(...nightlyPricesToman) * 10
      : undefined;

  const validComments = Array.isArray(comments)
    ? comments.filter((c) => Boolean(c?.text && c?.stars))
    : [];

  const hasValidRating =
    typeof pointsSummary?.average_score === 'number' &&
    pointsSummary.average_score > 0;

  const latNum = Number(hotelData.latitude);
  const lngNum = Number(hotelData.longitude);
  const hasGeo =
    Number.isFinite(latNum) &&
    Number.isFinite(lngNum) &&
    latNum !== 0 &&
    lngNum !== 0;

  const hotelNode: Record<string, unknown> = {
    '@type': 'Hotel',
    '@id': `${pageUrl}#hotel`,
    name: hotelFullName,
    url: pageUrl,
    description:
      seo?.description ||
      descriptionData?.description ||
      `رزرو ${hotelFullName} در ${SITE_NAME}`,
    ...(schemaImages.length > 0 ? { image: schemaImages } : {}),
    ...(hotelData.stars
      ? {
          starRating: {
            '@type': 'Rating',
            ratingValue: hotelData.stars,
            bestRating: 5,
          },
        }
      : {}),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      ...(hotelData.city_name
        ? {
            addressRegion: hotelData.city_name,
            addressLocality: hotelData.city_name,
          }
        : {}),
      ...(hotelData.address ? { streetAddress: hotelData.address } : {}),
    },
    ...(hasGeo
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: latNum,
            longitude: lngNum,
          },
        }
      : {}),
    ...(hotelData.check_in_time
      ? { checkinTime: hotelData.check_in_time }
      : {}),
    ...(hotelData.check_out_time
      ? { checkoutTime: hotelData.check_out_time }
      : {}),
    ...(hotelData.rooms_count ? { numberOfRooms: hotelData.rooms_count } : {}),
    ...(amenityFeatures.length > 0
      ? { amenityFeature: amenityFeatures }
      : {}),
    ...(hasValidRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: pointsSummary!.average_score,
            bestRating: 5,
            worstRating: 1,
            reviewCount: Math.max(validComments.length, 1),
          },
        }
      : {}),
    ...(validComments.length > 0
      ? {
          review: validComments.slice(0, 10).map((c) => ({
            '@type': 'Review',
            author: {
              '@type': 'Person',
              name:
                `${c.first_name || ''} ${c.last_name || ''}`.trim() ||
                'مسافر سفرنامه ۲۴',
            },
            reviewRating: {
              '@type': 'Rating',
              ratingValue: c.stars,
              bestRating: 5,
              worstRating: 1,
            },
            reviewBody: c.text,
          })),
        }
      : {}),
    ...(minPriceIrr && maxPriceIrr
      ? {
          makesOffer: {
            '@type': 'AggregateOffer',
            priceCurrency: 'IRR',
            lowPrice: minPriceIrr,
            highPrice: maxPriceIrr,
            offerCount: rooms?.length || 1,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };

  const breadcrumbNode = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'خانه',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'رزرو هتل',
        item: `${SITE_URL}/hotel`,
      },
      ...(hotelData.city_name
        ? [
            {
              '@type': 'ListItem',
              position: 3,
              name: `هتل‌های ${hotelData.city_name}`,
              item: `${SITE_URL}/hotel?city=${encodeURIComponent(citySlug)}`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: hotelData.city_name ? 4 : 3,
        name: hotelFullName,
        item: pageUrl,
      },
    ],
  };

  const faqNode =
    Array.isArray(faqs) && faqs.length > 0
      ? {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: faqs
            .filter((item) => item?.question && item?.answer)
            .map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer,
              },
            })),
        }
      : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [hotelNode, breadcrumbNode, ...(faqNode ? [faqNode] : [])],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HydrationBoundary state={dehydrate(queryClient)}>
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

          <div className="relative mt-5 flex flex-col gap-14 lg:mt-8 lg:gap-20">
            

            <Pictures hotelSlug={hotelSlug} hotelName={hotelFullName} />

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

            <Section sectionID="description">
              <TopBarConfig
                className="mb-1 lg:mb-2"
                title={{ type: 'single', text: 'توضیحات هتل' }}
              />
              <div className="grid items-start gap-12 lg:grid-cols-2">
                <Description hotelSlug={hotelSlug} />
                <InitialInformation hotelSlug={hotelSlug} />
              </div>
            </Section>

            <Rooms hotelSlug={hotelSlug} />

            <AdditionalDetails hotelSlug={hotelSlug} />

            {hasRules && (
              <Section
                sectionID="rules"
                className="grid items-start gap-8 lg:grid-cols-2"
              >
                <RulesAndRegulations hotelSlug={hotelSlug} />
                <EssentialTips hotelSlug={hotelSlug} />
              </Section>
            )}

            <Facilities hotelSlug={hotelSlug} />

            <ImportantPlaces hotelSlug={hotelSlug} />

            <FrequentlyQuestions hotelSlug={hotelSlug} />

            <Suspense
              fallback={
                <div className="h-40 w-full animate-pulse rounded-2xl bg-zinc-100" />
              }
            >
              <CustomerReviews hotelSlug={hotelSlug} />
            </Suspense>

            <Tags hotelSlug={hotelSlug} />

            <Suspense
              fallback={
                <div className="h-40 w-full animate-pulse rounded-2xl bg-zinc-100" />
              }
            >
              <SuggestedHotels hotelSlug={hotelSlug} />
            </Suspense>
          </div>
        </HotelWrapper>
      </HydrationBoundary>
    </>
  );
}