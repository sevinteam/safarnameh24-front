'use client';

import { use, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  MapPin,
  MessageSquareText,
  Plus,
  Star,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';
import { axiosInstance } from '@/utils/axios';
import { showCMToast } from '@/components/landing/shared/toast';

type PointItem = {
  id: number;
  title: string;
  is_positive: boolean;
  is_negative: boolean;
};

type SuggestedItem = {
  id: number;
  title: string;
};

type ReviewInitData = {
  tracking_code: string;
  already_reviewed: boolean;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  hotel: {
    id: number;
    name: string;
    slug: string;
    city_slug?: string | null;
    stars: number;
    city_name: string;
    main_image: string;
  };
  comment_point_items: PointItem[];
  suggested_comment_items: SuggestedItem[];
};

const JALALI_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

function toPersianDigits(val: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (d) => persianDigits[Number(d)]);
}

function formatJalaliDateText(dateStr?: string): string {
  if (!dateStr) return '';
  const normalized = dateStr
    .trim()
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/\//g, '-');
  const parts = normalized.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (monthIdx < 0 || monthIdx > 11 || Number.isNaN(day)) {
    return dateStr;
  }

  return `${toPersianDigits(day)} ${JALALI_MONTHS[monthIdx]} ${toPersianDigits(year)}`;
}

const STAR_LABELS: Record<number, { text: string; tone: string }> = {
  1: { text: 'بسیار ضعیف', tone: 'text-rose-600' },
  2: { text: 'نسبتاً ضعیف', tone: 'text-orange-600' },
  3: { text: 'معمولی و خوب', tone: 'text-amber-600' },
  4: { text: 'خیلی خوب', tone: 'text-emerald-600' },
  5: { text: 'عالی و بی‌نقص', tone: 'text-emerald-700' },
};

const EMOJI_OPTIONS = [
  { key: 'love', emoji: '😍', label: 'عالی بود', bg: '#ffe4e6' },
  { key: 'heart', emoji: '❤️', label: 'دوست داشتم', bg: '#fee2e2' },
  { key: 'smile', emoji: '☺️', label: 'راضی بودم', bg: '#dcfce7' },
  { key: 'like', emoji: '👍', label: 'خوب بود', bg: '#e0f2fe' },
  { key: 'confused', emoji: '😕', label: 'معمولی / ضعیف', bg: '#fef3c7' },
] as const;

function HotelCoverMedia({
  src,
  alt,
  cityName,
  hotelStars,
}: {
  src?: string;
  alt: string;
  cityName?: string;
  hotelStars?: number;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className="relative min-h-[230px] w-full overflow-hidden bg-zinc-900 lg:h-full lg:min-h-[290px]">
      {src && !imgFailed ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cs-dark-blue via-zinc-800 to-zinc-900 text-white/30">
          <Building2 className="h-16 w-16" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-center justify-between gap-2 text-white">
        {cityName ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-white/95">
            <MapPin className="h-4 w-4 text-white/80" />
            <span>{cityName}</span>
          </div>
        ) : (
          <span />
        )}
        {hotelStars ? (
          <div className="flex items-center gap-1 text-xs font-bold text-amber-300 tabular-nums">
            <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            <span>{toPersianDigits(hotelStars)} ستاره</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function PostStayReviewPage({
  params,
}: {
  params: Promise<{ trackingCode: string }>;
}) {
  const { trackingCode } = use(params);
  const initializedRef = useRef(false);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stars, setStars] = useState<number>(5);
  const [hoverStar, setHoverStar] = useState<number>(0);
  const [avatarStyle, setAvatarStyle] = useState<string>('love');
  const [userPickedEmoji, setUserPickedEmoji] = useState<boolean>(false);
  const [suggestedRatings, setSuggestedRatings] = useState<Record<number, number>>({});
  const [selectedStrengths, setSelectedStrengths] = useState<number[]>([]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<number[]>([]);
  const [guestName, setGuestName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  const { data: reviewData, isLoading, isError, error } = useQuery<ReviewInitData>({
    queryKey: ['post-stay-review-init', trackingCode],
    enabled: Boolean(trackingCode),
    retry: false,
    queryFn: () =>
      axiosInstance(`/hotel/reviews/reservation/${trackingCode}/`).then((res) => {
        return res?.data?.data || res?.data;
      }),
  });

  useEffect(() => {
    if (reviewData && !initializedRef.current) {
      initializedRef.current = true;
      if (reviewData.guest_name) {
        setGuestName(reviewData.guest_name);
      }
      if (reviewData.suggested_comment_items?.length) {
        const initRatings: Record<number, number> = {};
        reviewData.suggested_comment_items.forEach((item) => {
          initRatings[item.id] = 5;
        });
        setSuggestedRatings(initRatings);
      }
    }
  }, [reviewData]);

  function handleSelectStars(val: number) {
    setStars(val);
    if (!userPickedEmoji) {
      if (val >= 5) setAvatarStyle('love');
      else if (val === 4) setAvatarStyle('smile');
      else if (val === 3) setAvatarStyle('like');
      else setAvatarStyle('confused');
    }
  }

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = {
        guest_name: guestName.trim() || 'مسافر زروان تریپ',
        stars,
        avatar_style: avatarStyle,
        text: text.trim(),
        strength_ids: selectedStrengths,
        weakness_ids: selectedWeaknesses,
        suggested_items_with_rating: Object.entries(suggestedRatings).map(
          ([itemId, rating]) => ({
            suggested_item_id: Number(itemId),
            rating: Number(rating),
          }),
        ),
      };
      return axiosInstance.post(
        `/hotel/reviews/reservation/${trackingCode}/submit/`,
        payload,
      );
    },
    onSuccess: () => {
      setSubmittedSuccess(true);
      showCMToast({
        type: 'success',
        title: 'دیدگاه شما ثبت شد',
        description: 'با تشکر از شما، نظر ارزشمندتان در صفحه هتل منتشر گردید.',
      });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { message?: string; detail?: string } };
      };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.detail ||
        'خطا در ثبت نظر. لطفاً دوباره تلاش کنید.';
      showCMToast({
        type: 'error',
        title: 'خطا در ثبت دیدگاه',
        description: msg,
      });
    },
  });

  function toggleStrength(id: number) {
    setSelectedStrengths((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleWeakness(id: number) {
    setSelectedWeaknesses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  if (isLoading) {
    return (
      <main className="mt-4 w-full xl:mt-10" dir="rtl">
        <div className="mb-8 h-72 animate-pulse rounded-2xl border border-zinc-200/80 bg-white" />
        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <div className="hidden h-72 animate-pulse rounded-2xl border border-zinc-200/80 bg-white lg:block" />
          <div className="h-96 animate-pulse rounded-2xl border border-zinc-200/80 bg-white" />
        </div>
      </main>
    );
  }

  if (isError || !reviewData) {
    const axiosErr = error as {
      response?: { data?: { message?: string; detail?: string } };
    } | null;
    const errMsg =
      axiosErr?.response?.data?.message ||
      axiosErr?.response?.data?.detail ||
      'رزرو معتبری با این کد پیگیری یافت نشد.';

    return (
      <main className="mt-4 w-full xl:mt-10" dir="rtl">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 lg:p-14">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-cs-red">
              <AlertCircle className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-black text-zinc-900">
              امکان ثبت نظر وجود ندارد
            </h1>
            <p className="mt-2.5 text-sm font-medium leading-7 text-zinc-500">
              {errMsg}
            </p>
            <div className="mt-7 flex justify-center">
              <Link
                href="/"
                className="flex h-11 items-center justify-center rounded-xl bg-cs-dark-blue px-6 text-xs font-bold text-white transition-colors hover:bg-zinc-800 whitespace-nowrap"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (submittedSuccess || reviewData.already_reviewed) {
    const hotelCitySlug = reviewData.hotel.city_slug || 'iran';

    return (
      <main className="mt-4 w-full xl:mt-10" dir="rtl">
        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white lg:grid lg:grid-cols-[1fr_1.1fr] lg:items-stretch">
          <HotelCoverMedia
            src={reviewData.hotel.main_image}
            alt={reviewData.hotel.name}
            cityName={reviewData.hotel.city_name}
            hotelStars={reviewData.hotel.stars}
          />

          <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500 tabular-nums">
              <span>ثبت تجربه اقامت</span>
              <span aria-hidden="true">·</span>
              <span>کد پیگیری {reviewData.tracking_code}</span>
            </div>

            <h1 className="mt-2 text-xl font-black text-zinc-900 text-balance lg:text-2xl">
              {submittedSuccess
                ? 'سپاس از ثبت دیدگاه ارزشمند شما'
                : 'شما قبلاً برای این رزرو نظر داده‌اید'}
            </h1>
            <p className="mt-3 text-sm font-medium leading-7 text-zinc-600">
              نظر شما با موفقیت برای هتل{' '}
              <strong className="font-extrabold text-zinc-900">
                {reviewData.hotel.name}
              </strong>{' '}
              ثبت شده است و تجربه واقعی شما به انتخاب بهتر سایر مسافران کمک می‌کند.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={`/hotel/${encodeURIComponent(hotelCitySlug)}/${reviewData.hotel.slug}#customer-reviews`}
                className="flex h-11 items-center justify-center rounded-xl bg-cs-dark-blue px-6 text-xs font-bold text-white transition-colors hover:bg-zinc-800 whitespace-nowrap"
              >
                مشاهده نظر در صفحه هتل
              </Link>
              <Link
                href="/"
                className="flex h-11 items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap"
              >
                صفحه اصلی زروان تریپ
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const positiveItems = reviewData.comment_point_items.filter((i) => i.is_positive);
  const negativeItems = reviewData.comment_point_items.filter((i) => i.is_negative);

  const chapters = [
    {
      num: 1 as const,
      code: '۰۱',
      title: 'امتیاز کل و بخش‌ها',
      mobileTitle: 'امتیازها',
      subtitle: 'ارزیابی کلی کیفیت اقامت',
    },
    {
      num: 2 as const,
      code: '۰۲',
      title: 'نقاط قوت و ضعف',
      mobileTitle: 'نقاط کلیدی',
      subtitle: 'جزئیات تجربه در هتل',
    },
    {
      num: 3 as const,
      code: '۰۳',
      title: 'حس و متن دیدگاه',
      mobileTitle: 'متن دیدگاه',
      subtitle: 'انتشار نظر در صفحه هتل',
    },
  ];

  return (
    <main className="mt-4 w-full xl:mt-10" dir="rtl">
      {/* هیروی دو ستونه هتل و خلاصه اقامت */}
      <header className="mb-6 flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white lg:mb-8 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-stretch">
        <div className="order-2 flex flex-col justify-between p-5 sm:p-6 lg:order-1 lg:p-10">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500 tabular-nums">
              <span className="font-bold text-cs-red">بازخورد پس از اقامت</span>
              <span aria-hidden="true">·</span>
              <span>کد پیگیری: {reviewData.tracking_code}</span>
            </div>

            <h1 className="text-2xl font-black text-zinc-900 text-balance lg:text-3xl">
              {reviewData.hotel.name}
            </h1>

            <p className="max-w-xl text-sm font-medium leading-7 text-zinc-500">
              خوشحال می‌شویم تجربه واقعی خود از اقامت در این هتل را با مسافران
              زروان تریپ به اشتراک بگذارید.
            </p>
          </div>

          <div className="mt-8 grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>بازه اقامت</span>
              </div>
              <div className="mt-1 text-xs font-extrabold text-zinc-800 tabular-nums lg:text-sm">
                {formatJalaliDateText(reviewData.check_in_date)} تا{' '}
                {formatJalaliDateText(reviewData.check_out_date)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400">
                <User className="h-3.5 w-3.5" />
                <span>نام مسافر</span>
              </div>
              <div className="mt-1 truncate text-xs font-extrabold text-zinc-800 lg:text-sm">
                {guestName.trim() || reviewData.guest_name || 'مسافر زروان تریپ'}
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <HotelCoverMedia
            src={reviewData.hotel.main_image}
            alt={reviewData.hotel.name}
            cityName={reviewData.hotel.city_name}
            hotelStars={reviewData.hotel.stars}
          />
        </div>
      </header>

      {/* بدنه دو ستونه: فهرست مراحل عمودی + فرم */}
      <div className="grid gap-6 lg:grid-cols-[17.5rem_1fr] lg:items-start lg:gap-8">
        {/* فهرست مراحل (مشابه الگوی فهرست بخش‌ها در دسکتاپ و تب نواری در موبایل) */}
        <aside className="rounded-2xl border border-zinc-200/80 bg-white p-2 sm:p-3 lg:sticky lg:top-24 lg:p-5">
          <div className="mb-3 hidden px-2 text-xs font-extrabold text-zinc-900 lg:block">
            مراحل ثبت تجربه سفر
          </div>

          <nav
            aria-label="مراحل ثبت دیدگاه"
            className="grid grid-cols-3 gap-1.5 lg:grid-cols-1 lg:gap-2"
          >
            {chapters.map((chapter) => {
              const isActive = step === chapter.num;
              const isDone = step > chapter.num;
              return (
                <button
                  key={chapter.num}
                  type="button"
                  onClick={() => setStep(chapter.num)}
                  className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-center transition-colors sm:flex-row sm:justify-start sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-right lg:py-3 ${
                    isActive
                      ? 'bg-zinc-900 text-white'
                      : isDone
                        ? 'bg-emerald-50/70 text-emerald-800 hover:bg-emerald-50'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <span
                    className={`hidden h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black tabular-nums sm:flex ${
                      isActive
                        ? 'bg-white/15 text-white'
                        : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-zinc-100 text-zinc-500'
                    }`}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" /> : chapter.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[11px] font-extrabold sm:hidden">
                      {chapter.mobileTitle}
                    </div>
                    <div className="hidden truncate text-xs font-extrabold sm:block">
                      {chapter.title}
                    </div>
                    <div
                      className={`mt-0.5 hidden truncate text-[11px] font-medium lg:block ${
                        isActive ? 'text-zinc-300' : 'text-zinc-400'
                      }`}
                    >
                      {chapter.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-5 hidden space-y-2 border-t border-zinc-100 pt-4 text-xs font-medium text-zinc-500 lg:block">
            <div className="flex items-center justify-between">
              <span>امتیاز انتخابی</span>
              <span className={`font-extrabold tabular-nums ${STAR_LABELS[stars].tone}`}>
                {toPersianDigits(stars)} از ۵
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>نکات انتخاب‌شده</span>
              <span className="font-bold text-zinc-800 tabular-nums">
                {toPersianDigits(selectedStrengths.length + selectedWeaknesses.length)} مورد
              </span>
            </div>
          </div>
        </aside>

        {/* بدنه فرم تعاملی */}
        <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 sm:p-6 lg:p-10">
          <AnimatePresence mode="wait">
            {/* ================= مرحله ۱ ================= */}
            {step === 1 && (
              <motion.div
                key="guest-step-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="border-b border-zinc-100 pb-8 text-center">
                  <div className="text-xs font-bold text-cs-red tabular-nums">
                    ۰۱ · ارزیابی کلی
                  </div>
                  <h2 className="mt-1.5 text-lg font-black text-zinc-900 text-balance lg:text-xl">
                    امتیاز کلی شما به این اقامت چند ستاره است؟
                  </h2>
                  <p className="mt-1 text-xs font-medium text-zinc-500">
                    با کلیک روی هر ستاره میزان رضایت خود را مشخص کنید
                  </p>

                  <div
                    className="mt-6 inline-flex max-w-full items-center justify-center gap-1 rounded-2xl border border-zinc-200 bg-zinc-50/70 px-3 py-2.5 sm:gap-2.5 sm:px-6 sm:py-3.5"
                    dir="ltr"
                  >
                    {[1, 2, 3, 4, 5].map((s) => {
                      const filled = s <= (hoverStar || stars);
                      return (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverStar(s)}
                          onMouseLeave={() => setHoverStar(0)}
                          onClick={() => handleSelectStars(s)}
                          aria-label={`${s} ستاره`}
                          className="p-1.5 transition-transform duration-150 hover:scale-110 active:scale-95"
                        >
                          <Star
                            className={`h-7 w-7 sm:h-8 sm:w-8 ${
                              filled
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-zinc-100 text-zinc-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`mt-3 text-sm font-black tabular-nums ${STAR_LABELS[stars].tone}`}
                  >
                    {STAR_LABELS[stars].text} ({toPersianDigits(stars)} از ۵)
                  </div>
                </div>

                {reviewData.suggested_comment_items.length > 0 && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-zinc-900">
                        امتیاز به بخش‌های مختلف هتل
                      </h3>
                      <span className="text-xs font-medium text-zinc-400 tabular-nums">
                        {toPersianDigits(reviewData.suggested_comment_items.length)} بخش
                      </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {reviewData.suggested_comment_items.map((item) => {
                        const currentVal = suggestedRatings[item.id] ?? 5;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200/80 bg-zinc-50/40 px-4 py-3.5"
                          >
                            <span className="truncate text-xs font-bold text-zinc-800">
                              {item.title}
                            </span>
                            <div className="flex shrink-0 items-center gap-2.5">
                              <div className="flex items-center gap-0.5" dir="ltr">
                                {[1, 2, 3, 4, 5].map((r) => {
                                  const filled = r <= currentVal;
                                  return (
                                    <button
                                      key={r}
                                      type="button"
                                      onClick={() =>
                                        setSuggestedRatings((prev) => ({
                                          ...prev,
                                          [item.id]: r,
                                        }))
                                      }
                                      aria-label={`امتیاز ${r} به ${item.title}`}
                                      className="p-0.5 transition-transform hover:scale-110"
                                    >
                                      <Star
                                        className={`h-4 w-4 ${
                                          filled
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'fill-zinc-100 text-zinc-300'
                                        }`}
                                      />
                                    </button>
                                  );
                                })}
                              </div>
                              <span className="min-w-[26px] text-left text-xs font-bold text-zinc-500 tabular-nums">
                                {toPersianDigits(currentVal)}/۵
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-end border-t border-zinc-100 pt-5">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cs-dark-blue px-6 text-xs font-bold text-white transition-colors hover:bg-zinc-800 sm:w-auto whitespace-nowrap"
                  >
                    <span>مرحله بعد: نقاط قوت و ضعف</span>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= مرحله ۲ ================= */}
            {step === 2 && (
              <motion.div
                key="guest-step-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div>
                  <div className="text-xs font-bold text-cs-red tabular-nums">
                    ۰۲ · جزئیات تجربه
                  </div>
                  <h2 className="mt-1.5 text-lg font-black text-zinc-900">
                    چه نکاتی در اقامت شما برجسته بود؟
                  </h2>
                  <p className="mt-1 text-xs font-medium text-zinc-500">
                    گزینه‌هایی که بیشتر با تجربه شما مطابقت دارد را انتخاب کنید
                  </p>
                </div>

                {positiveItems.length > 0 && (
                  <div className="border-t border-zinc-100 pt-6">
                    <div className="mb-3.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-700">
                        <ThumbsUp className="h-4 w-4" />
                        <span>نقاط قوت هتل</span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-500 tabular-nums">
                        {toPersianDigits(selectedStrengths.length)} انتخاب
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {positiveItems.map((item) => {
                        const sel = selectedStrengths.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleStrength(item.id)}
                            className={`inline-flex min-h-[42px] max-w-full items-center gap-1.5 rounded-xl border px-3.5 py-2 text-right text-xs font-bold transition-colors ${
                              sel
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                            }`}
                          >
                            {sel ? (
                              <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            ) : (
                              <Plus className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                            )}
                            <span>{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {negativeItems.length > 0 && (
                  <div className="border-t border-zinc-100 pt-6">
                    <div className="mb-3.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-rose-700">
                        <ThumbsDown className="h-4 w-4" />
                        <span>مواردی که نیاز به بهبود دارد</span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-500 tabular-nums">
                        {toPersianDigits(selectedWeaknesses.length)} انتخاب
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {negativeItems.map((item) => {
                        const sel = selectedWeaknesses.includes(item.id);
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleWeakness(item.id)}
                            className={`inline-flex min-h-[42px] max-w-full items-center gap-1.5 rounded-xl border px-3.5 py-2 text-right text-xs font-bold transition-colors ${
                              sel
                                ? 'border-rose-600 bg-rose-50 text-rose-800'
                                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                            }`}
                          >
                            {sel ? (
                              <Check className="h-3.5 w-3.5 shrink-0 text-rose-600" />
                            ) : (
                              <Plus className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                            )}
                            <span>{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto whitespace-nowrap"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>مرحله قبل</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cs-dark-blue px-6 text-xs font-bold text-white transition-colors hover:bg-zinc-800 sm:w-auto whitespace-nowrap"
                  >
                    <span>مرحله بعد: نگارش دیدگاه</span>
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ================= مرحله ۳ ================= */}
            {step === 3 && (
              <motion.div
                key="guest-step-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div>
                  <div className="text-xs font-bold text-cs-red tabular-nums">
                    ۰۳ · حس و روایت سفر
                  </div>
                  <h2 className="mt-1.5 text-lg font-black text-zinc-900">
                    تجربه خود را با سایر مسافران به اشتراک بگذارید
                  </h2>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-extrabold text-zinc-900">
                    حس کلی خود را برای نمایش کنار دیدگاه انتخاب کنید
                  </label>
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                    {EMOJI_OPTIONS.map((opt, idx) => {
                      const isSelected = avatarStyle === opt.key;
                      const spanFullOnMobileLast =
                        idx === EMOJI_OPTIONS.length - 1
                          ? 'col-span-2 sm:col-span-1'
                          : '';
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setAvatarStyle(opt.key);
                            setUserPickedEmoji(true);
                          }}
                          className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors ${spanFullOnMobileLast} ${
                            isSelected
                              ? 'border-cs-dark-blue bg-zinc-50 ring-1 ring-cs-dark-blue'
                              : 'border-zinc-200 bg-white hover:bg-zinc-50'
                          }`}
                        >
                          <span
                            style={{ backgroundColor: opt.bg }}
                            className="flex size-10 items-center justify-center rounded-full"
                          >
                            <span className="block translate-y-[1px] text-[22px] leading-none">
                              {opt.emoji}
                            </span>
                          </span>
                          <span className="text-[11px] font-bold text-zinc-700 whitespace-nowrap">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="guest-review-name"
                    className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-900"
                  >
                    <User className="h-4 w-4 text-zinc-500" />
                    <span>نام نمایشی شما در بخش نظرات هتل</span>
                  </label>
                  <input
                    id="guest-review-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="مثلاً: علیرضا آذرخش"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 text-xs font-semibold text-zinc-900 outline-none transition-colors focus:border-cs-dark-blue focus:bg-white lg:text-sm"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label
                      htmlFor="guest-review-text"
                      className="flex items-center gap-2 text-xs font-extrabold text-zinc-900"
                    >
                      <MessageSquareText className="h-4 w-4 text-zinc-500" />
                      <span>متن تجربه اقامت شما</span>
                    </label>
                    <span className="text-[11px] font-medium text-zinc-400 tabular-nums">
                      {toPersianDigits(text.trim().length)} کاراکتر
                    </span>
                  </div>
                  <textarea
                    id="guest-review-text"
                    rows={5}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="کیفیت اتاق‌ها، برخورد پرسنل، نظافت و موقعیت مکانی چطور بود؟"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-xs font-medium leading-7 text-zinc-900 outline-none transition-colors focus:border-cs-dark-blue focus:bg-white lg:text-sm"
                  />
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto whitespace-nowrap"
                  >
                    <ArrowRight className="h-4 w-4" />
                    <span>مرحله قبل</span>
                  </button>

                  <button
                    type="button"
                    disabled={submitMutation.isPending || !text.trim()}
                    onClick={() => submitMutation.mutate()}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 text-xs font-black text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-auto whitespace-nowrap"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>
                      {submitMutation.isPending ? 'در حال ثبت...' : 'ثبت نهایی نظر'}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}