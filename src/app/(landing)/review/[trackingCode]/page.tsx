'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/utils/axios';
import { showCMToast } from '@/components/landing/shared/toast';
import {
  Star1,
  TickCircle,
  ArrowLeft,
  ArrowRight,
  Like1,
  Dislike,
  MessageText1,
  User,
  Calendar,
  Location,
} from 'iconsax-react';

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

const STAR_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: 'بسیار ضعیف', color: 'text-rose-500' },
  2: { text: 'نسبتاً ضعیف', color: 'text-orange-500' },
  3: { text: 'معمولی و خوب', color: 'text-amber-500' },
  4: { text: 'خیلی خوب', color: 'text-emerald-500' },
  5: { text: 'عالی و بی‌نقص', color: 'text-green-600' },
};

const EMOJI_OPTIONS = [
  { key: 'love', emoji: '😍', label: 'عالی بود', bg: '#ffe4e6' },
  { key: 'heart', emoji: '❤️', label: 'دوست داشتم', bg: '#fee2e2' },
  { key: 'smile', emoji: '☺️', label: 'راضی بودم', bg: '#dcfce7' },
  { key: 'like', emoji: '👍', label: 'خوب بود', bg: '#e0f2fe' },
  { key: 'confused', emoji: '😕', label: 'معمولی / ضعیف', bg: '#fef3c7' },
] as const;

export default function PostStayReviewPage({
  params,
}: {
  params: Promise<{ trackingCode: string }>;
}) {
  const { trackingCode } = use(params);

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
    if (reviewData) {
      if (reviewData.guest_name && !guestName) {
        setGuestName(reviewData.guest_name);
      }
      if (
        reviewData.suggested_comment_items?.length &&
        Object.keys(suggestedRatings).length === 0
      ) {
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
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
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
      <main className="container mx-auto max-w-2xl px-4 py-20">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-zinc-100 bg-white p-10 shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cs-blue border-t-transparent" />
          <p className="text-sm font-bold text-zinc-600">در حال بارگذاری اطلاعات رزرو...</p>
        </div>
      </main>
    );
  }

  if (isError || !reviewData) {
    const errMsg =
      (error as any)?.response?.data?.message ||
      (error as any)?.response?.data?.detail ||
      'رزرو معتبری با این کد پیگیری یافت نشد.';
    return (
      <main className="container mx-auto max-w-lg px-4 py-20" dir="rtl">
        <div className="rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-lg shadow-rose-500/5">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-cs-red">
            <span className="text-2xl font-black">!</span>
          </div>
          <h1 className="mb-2 text-lg font-black text-zinc-900">امکان ثبت نظر وجود ندارد</h1>
          <p className="mb-6 text-xs font-semibold leading-6 text-zinc-500">{errMsg}</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-cs-dark-blue px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </main>
    );
  }

  if (submittedSuccess || reviewData.already_reviewed) {
    const hotelCitySlug = reviewData.hotel.city_slug || 'iran';

    return (
      <main className="container mx-auto max-w-lg px-4 py-20" dir="rtl">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-lg shadow-emerald-500/5">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
            <TickCircle size={36} variant="Bold" color="currentColor" />
          </div>
          <h1 className="mb-2 text-lg font-black text-emerald-800">
            {submittedSuccess
              ? 'سپاس از ثبت دیدگاه ارزشمند شما!'
              : 'شما قبلاً برای این رزرو نظر داده‌اید'}
          </h1>
          <p className="mb-8 text-xs font-semibold leading-7 text-zinc-500">
            نظر شما با موفقیت در صفحه هتل <strong>{reviewData.hotel.name}</strong> ثبت شد.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-center">
            <Link
              href={`/hotel/${encodeURIComponent(hotelCitySlug)}/${reviewData.hotel.slug}#customer-reviews`}
              className="rounded-xl bg-cs-dark-blue px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90"
            >
              مشاهده نظر در صفحه هتل
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-zinc-100 px-6 py-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
            >
              صفحه اصلی زروان تریپ
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const positiveItems = reviewData.comment_point_items.filter((i) => i.is_positive);
  const negativeItems = reviewData.comment_point_items.filter((i) => i.is_negative);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 lg:py-12" dir="rtl">
      {/* کارت هتل و مشخصات رزرو */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm">
        {reviewData.hotel.main_image ? (
          <div className="relative h-36 w-full sm:h-40">
            <img
              src={reviewData.hotel.main_image}
              alt={reviewData.hotel.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-white">
              <div>
                <span className="rounded-lg bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
                  کد پیگیری: {reviewData.tracking_code}
                </span>
                <h1 className="mt-1 text-sm font-black sm:text-base">
                  {reviewData.hotel.name}
                </h1>
              </div>
              {reviewData.hotel.city_name ? (
                <div className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                  <Location size={14} color="currentColor" />
                  <span>{reviewData.hotel.city_name}</span>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/80 px-5 py-3 text-xs font-bold text-zinc-600">
          <div className="flex items-center gap-1.5">
            <Calendar size={15} color="currentColor" className="text-cs-blue" />
            <span>
              تاریخ اقامت: {formatJalaliDateText(reviewData.check_in_date)} الی{' '}
              {formatJalaliDateText(reviewData.check_out_date)}
            </span>
          </div>
          <span className="text-zinc-400">ثبت تجربه سفر</span>
        </div>
      </div>

      {/* نوار مراحل استپی */}
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-200/80 bg-white p-2.5 shadow-sm">
        {[
          { num: 1, label: '۱. امتیاز کل و جزئیات' },
          { num: 2, label: '۲. نقاط قوت و ضعف' },
          { num: 3, label: '۳. ایموجی و متن نظر' },
        ].map((item) => {
          const isActive = step === item.num;
          const isDone = step > item.num;
          return (
            <button
              key={item.num}
              type="button"
              onClick={() => setStep(item.num as 1 | 2 | 3)}
              className={`rounded-xl py-2.5 text-center text-xs font-extrabold transition ${
                isActive
                  ? 'bg-cs-dark-blue text-white shadow-md'
                  : isDone
                    ? 'bg-emerald-50 font-bold text-emerald-700'
                    : 'bg-zinc-100/70 text-zinc-500 hover:bg-zinc-200/70'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* بدنه فرم */}
      <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm lg:p-8">
        {/* ================= استپ ۱ ================= */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-1 text-base font-black text-zinc-900 lg:text-lg">
                امتیاز کلی شما به این هتل چند ستاره است؟
              </h2>
              <p className="mb-5 text-xs font-semibold text-zinc-400">
                برای ثبت امتیاز، روی ستاره‌ها کلیک کنید
              </p>

              <div
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-amber-200/80 bg-amber-50/70 px-5 py-3 shadow-sm"
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
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star1
                        size={28}
                        variant={filled ? 'Bold' : 'Outline'}
                        color={filled ? '#f59e0b' : '#d4d4d8'}
                      />
                    </button>
                  );
                })}
              </div>

              <div className={`mt-3 text-sm font-black ${STAR_LABELS[stars].color}`}>
                {STAR_LABELS[stars].text} ({toPersianDigits(stars)} از ۵)
              </div>
            </div>

            {reviewData.suggested_comment_items.length > 0 && (
              <div className="border-t border-zinc-100 pt-6">
                <h3 className="mb-4 text-xs font-extrabold text-zinc-700 lg:text-sm">
                  امتیازدهی به بخش‌های مختلف هتل:
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {reviewData.suggested_comment_items.map((item) => {
                    const currentVal = suggestedRatings[item.id] ?? 5;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200/70 bg-zinc-50/80 px-4 py-3"
                      >
                        <span className="text-xs font-bold text-zinc-800">
                          {item.title}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
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
                                  <Star1
                                    size={16}
                                    variant={filled ? 'Bold' : 'Outline'}
                                    color={filled ? '#f59e0b' : '#d4d4d8'}
                                  />
                                </button>
                              );
                            })}
                          </div>
                          <span className="min-w-[24px] text-left text-[11px] font-bold text-zinc-500">
                            {toPersianDigits(currentVal)}/۵
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-cs-dark-blue px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95"
              >
                <span>مرحله بعد</span>
                <ArrowLeft size={16} color="currentColor" />
              </button>
            </div>
          </div>
        )}

        {/* ================= استپ ۲ ================= */}
        {step === 2 && (
          <div className="space-y-8">
            {positiveItems.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-emerald-700 lg:text-sm">
                  <Like1 size={18} variant="Bold" color="currentColor" />
                  <span>نقاط قوت هتل (انتخاب کنید)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {positiveItems.map((item) => {
                    const sel = selectedStrengths.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleStrength(item.id)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                          sel
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {sel ? '✓ ' : '+ '}
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {negativeItems.length > 0 && (
              <div className="border-t border-zinc-100 pt-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-extrabold text-rose-600 lg:text-sm">
                  <Dislike size={18} variant="Bold" color="currentColor" />
                  <span>نقاط ضعف هتل (در صورت وجود انتخاب کنید)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {negativeItems.map((item) => {
                    const sel = selectedWeaknesses.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleWeakness(item.id)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition ${
                          sel
                            ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {sel ? '✓ ' : '+ '}
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
              >
                <ArrowRight size={16} color="currentColor" />
                <span>مرحله قبل</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-xl bg-cs-dark-blue px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95"
              >
                <span>مرحله بعد</span>
                <ArrowLeft size={16} color="currentColor" />
              </button>
            </div>
          </div>
        )}

        {/* ================= استپ ۳ ================= */}
        {step === 3 && (
          <div className="space-y-6">
            {/* انتخاب ایموجی برای آواتار نظر */}
            <div>
              <label className="mb-3 block text-xs font-extrabold text-zinc-800">
                ایموجی حس خود را برای نمایش کنار نظرتان انتخاب کنید
              </label>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {EMOJI_OPTIONS.map((opt) => {
                  const isSelected = avatarStyle === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        setAvatarStyle(opt.key);
                        setUserPickedEmoji(true);
                      }}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition ${
                        isSelected
                          ? 'border-cs-dark-blue bg-blue-50/50 shadow-sm ring-2 ring-cs-dark-blue/15'
                          : 'border-zinc-200 bg-white hover:bg-zinc-50'
                      }`}
                    >
                      <span
                        style={{ backgroundColor: opt.bg }}
                        className="flex size-11 items-center justify-center rounded-full"
                      >
                        <span className="block translate-y-[2px] text-[24px] leading-none">
                          {opt.emoji}
                        </span>
                      </span>
                      <span className="text-[10px] font-bold text-zinc-700 sm:text-[11px]">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-800">
                <User size={16} color="currentColor" className="text-cs-blue" />
                <span>نام نمایشی شما در بخش نظرات هتل</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثلاً: علیرضا آذرخش"
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-semibold text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-800">
                <MessageText1 size={16} color="currentColor" className="text-cs-blue" />
                <span>تجربه خود از اقامت در این هتل را بنویسید</span>
              </label>
              <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="کیفیت اتاق‌ها، برخورد پرسنل، نظافت و موقعیت مکانی چطور بود؟"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs font-medium leading-7 text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
              >
                <ArrowRight size={16} color="currentColor" />
                <span>مرحله قبل</span>
              </button>

              <button
                type="button"
                disabled={submitMutation.isPending || !text.trim()}
                onClick={() => submitMutation.mutate()}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-xs font-black text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <TickCircle size={18} variant="Bold" color="currentColor" />
                <span>
                  {submitMutation.isPending ? 'در حال ثبت...' : 'ثبت نهایی نظر'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}