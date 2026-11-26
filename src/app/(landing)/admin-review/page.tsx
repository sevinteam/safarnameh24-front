'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Lock,
  MapPin,
  MessageSquareText,
  Plus,
  RotateCcw,
  Search,
  Star,
  ThumbsDown,
  ThumbsUp,
  User,
  X,
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

type HotelOption = {
  id: number;
  name: string;
  slug: string;
  city_slug?: string | null;
  stars: number;
  status: string;
  city_name: string;
  main_image: string;
};

type AdminReviewInitData = {
  comment_point_items: PointItem[];
  suggested_comment_items: SuggestedItem[];
  hotels: HotelOption[];
};

type SubmittedResult = {
  comment_id: number;
  hotel_slug: string;
  city_slug?: string | null;
  hotel_name: string;
  created_jalali: string;
};

function toPersianDigits(val: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (d) => persianDigits[Number(d)]);
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

function HotelThumb({
  src,
  alt,
  className = 'h-12 w-16',
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400 ${className}`}
      >
        <Building2 className="h-5 w-5" />
      </div>
    );
  }

  return (
    <div className={`shrink-0 overflow-hidden rounded-xl bg-zinc-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default function AdminHotelReviewPage() {
  const [selectedHotel, setSelectedHotel] = useState<HotelOption | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stars, setStars] = useState<number>(5);
  const [hoverStar, setHoverStar] = useState<number>(0);
  const [avatarStyle, setAvatarStyle] = useState<string>('love');
  const [userPickedEmoji, setUserPickedEmoji] = useState<boolean>(false);
  const [suggestedRatings, setSuggestedRatings] = useState<Record<number, number>>({});
  const [selectedStrengths, setSelectedStrengths] = useState<number[]>([]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState<number[]>([]);
  const [guestName, setGuestName] = useState<string>('');
  const [createdJalali, setCreatedJalali] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [text, setText] = useState<string>('');
  const [submittedResult, setSubmittedResult] = useState<SubmittedResult | null>(null);

  // دیبانس برای جستجوی هتل
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // بستن لیست کشویی هتل با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const {
    data: initData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<AdminReviewInitData>({
    queryKey: ['admin-review-init'],
    retry: false,
    queryFn: () =>
      axiosInstance('/hotel/reviews/admin/init/').then((res) => {
        return res?.data?.data || res?.data;
      }),
  });

  const errorStatus = (error as { response?: { status?: number } } | null)?.response?.status;
  const isNotLoggedIn = isError && errorStatus === 401;
  const isForbidden = isError && errorStatus === 403;
  const isLocked = isError || !initData;

  const { data: searchedHotelsData, isFetching: isSearchingHotels } = useQuery<{
    hotels: HotelOption[];
  }>({
    queryKey: ['admin-review-hotels-search', debouncedQuery],
    enabled: !isLocked && debouncedQuery.length > 0,
    queryFn: () =>
      axiosInstance('/hotel/reviews/admin/hotels/', {
        params: { q: debouncedQuery },
      }).then((res) => {
        return res?.data?.data || res?.data;
      }),
  });

  useEffect(() => {
    if (
      initData?.suggested_comment_items?.length &&
      Object.keys(suggestedRatings).length === 0
    ) {
      const defaults: Record<number, number> = {};
      initData.suggested_comment_items.forEach((item) => {
        defaults[item.id] = 5;
      });
      setSuggestedRatings(defaults);
    }
  }, [initData, suggestedRatings]);

  function handleSelectStars(val: number) {
    if (isLocked) return;
    setStars(val);
    if (!userPickedEmoji) {
      if (val >= 5) setAvatarStyle('love');
      else if (val === 4) setAvatarStyle('smile');
      else if (val === 3) setAvatarStyle('like');
      else setAvatarStyle('confused');
    }
  }

  function resetForm(keepHotel: boolean) {
    if (!keepHotel) {
      setSelectedHotel(null);
      setSearchQuery('');
      setDebouncedQuery('');
    }
    setStep(1);
    setStars(5);
    setHoverStar(0);
    setAvatarStyle('love');
    setUserPickedEmoji(false);
    setSelectedStrengths([]);
    setSelectedWeaknesses([]);
    setGuestName('');
    setCreatedJalali('');
    setIsApproved(true);
    setText('');
    setSubmittedResult(null);

    if (initData?.suggested_comment_items?.length) {
      const defaults: Record<number, number> = {};
      initData.suggested_comment_items.forEach((item) => {
        defaults[item.id] = 5;
      });
      setSuggestedRatings(defaults);
    }
  }

  const submitMutation = useMutation({
    mutationFn: () => {
      if (isLocked) {
        return Promise.reject(new Error('ابتدا باید با حساب ادمین وارد شوید.'));
      }
      if (!selectedHotel) {
        return Promise.reject(new Error('لطفاً ابتدا هتل را انتخاب کنید.'));
      }
      const payload = {
        hotel_id: selectedHotel.id,
        guest_name: guestName.trim() || 'مسافر زروان تریپ',
        stars,
        avatar_style: avatarStyle,
        text: text.trim(),
        created_jalali: createdJalali.trim(),
        is_approved: isApproved,
        strength_ids: selectedStrengths,
        weakness_ids: selectedWeaknesses,
        suggested_items_with_rating: Object.entries(suggestedRatings).map(
          ([itemId, rating]) => ({
            suggested_item_id: Number(itemId),
            rating: Number(rating),
          }),
        ),
      };
      return axiosInstance
        .post('/hotel/reviews/admin/submit/', payload)
        .then((res) => res?.data?.data || res?.data);
    },
    onSuccess: (resData: SubmittedResult) => {
      setSubmittedResult(resData);
      showCMToast({
        type: 'success',
        title: 'دیدگاه با موفقیت ثبت شد',
        description: `نظر برای ${resData.hotel_name || selectedHotel?.name} ذخیره گردید.`,
      });
    },
    onError: (err: unknown) => {
      const axiosErr = err as {
        response?: { data?: { message?: string; detail?: string } };
        message?: string;
      };
      const msg =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.detail ||
        axiosErr?.message ||
        'خطا در ثبت نظر. لطفاً دوباره تلاش کنید.';
      showCMToast({
        type: 'error',
        title: 'خطا در ثبت دیدگاه',
        description: msg,
      });
    },
  });

  function toggleStrength(id: number) {
    if (isLocked) return;
    setSelectedStrengths((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function toggleWeakness(id: number) {
    if (isLocked) return;
    setSelectedWeaknesses((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  if (isLoading) {
    return (
      <main className="mt-4 w-full xl:mt-10" dir="rtl">
        <div className="mb-6 rounded-2xl border border-zinc-200/80 bg-white p-6 lg:p-8">
          <div className="h-6 w-56 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-lg bg-zinc-100" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_21.5rem]">
          <div className="space-y-6">
            <div className="h-32 animate-pulse rounded-2xl border border-zinc-200/80 bg-white" />
            <div className="h-96 animate-pulse rounded-2xl border border-zinc-200/80 bg-white" />
          </div>
          <div className="hidden h-80 animate-pulse rounded-2xl border border-zinc-200/80 bg-white lg:block" />
        </div>
      </main>
    );
  }

  if (submittedResult) {
    const hotelCitySlug =
      submittedResult.city_slug || selectedHotel?.city_slug || 'iran';

    return (
      <main className="mt-4 w-full xl:mt-10" dir="rtl">
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-8 lg:p-12">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <h1 className="text-xl font-black text-zinc-900">
              دیدگاه با موفقیت ثبت شد
            </h1>
            <p className="mt-2 text-sm font-medium leading-7 text-zinc-600">
              نظر جدید برای هتل{' '}
              <strong className="font-extrabold text-zinc-900">
                {submittedResult.hotel_name}
              </strong>{' '}
              در سامانه ذخیره گردید.
            </p>

            {submittedResult.created_jalali ? (
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500 tabular-nums">
                <span>زمان ثبت:</span>
                <span dir="ltr" className="font-mono">
                  {submittedResult.created_jalali}
                </span>
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => resetForm(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-cs-dark-blue px-6 text-xs font-bold text-white transition-colors hover:bg-zinc-800 whitespace-nowrap"
              >
                ثبت نظر جدید برای همین هتل
              </button>
              <button
                type="button"
                onClick={() => resetForm(false)}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50 whitespace-nowrap"
              >
                انتخاب هتل دیگر و ثبت نظر جدید
              </button>
              <Link
                href={`/hotel/${encodeURIComponent(hotelCitySlug)}/${submittedResult.hotel_slug}#customer-reviews`}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-xs font-bold text-white transition-colors hover:bg-emerald-700 whitespace-nowrap"
              >
                مشاهده نظر در صفحه هتل
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const hotelList =
    debouncedQuery.length > 0
      ? searchedHotelsData?.hotels || []
      : initData?.hotels || [];

  const positiveItems = (initData?.comment_point_items || []).filter(
    (i) => i.is_positive,
  );
  const negativeItems = (initData?.comment_point_items || []).filter(
    (i) => i.is_negative,
  );
  const suggestedItems = initData?.suggested_comment_items || [];

  const activeEmoji =
    EMOJI_OPTIONS.find((opt) => opt.key === avatarStyle) || EMOJI_OPTIONS[0];

  const errorPayload = error as {
    response?: { data?: { message?: string; detail?: string } };
  } | null;

  const alertTitle = isNotLoggedIn
    ? 'شما وارد حساب کاربری نشده‌اید'
    : isForbidden
      ? 'دسترسی غیرمجاز (فقط مخصوص ادمین)'
      : 'امکان بارگذاری اطلاعات وجود ندارد';

  const alertDescription = isNotLoggedIn
    ? 'برای ثبت نظر هتل، ابتدا باید با حساب مدیریت (ادمین) وارد سایت شوید. تا زمان ورود، این فرم و تمامی فیلدها قفل هستند.'
    : isForbidden
      ? 'حساب کاربری فعلی شما دسترسی مدیریت (ادمین) ندارد. لطفاً با حساب ادمین وارد شوید تا فرم باز شود.'
      : errorPayload?.response?.data?.message ||
        errorPayload?.response?.data?.detail ||
        'ارتباط با سرور برقرار نشد. فرم تا زمان رفع خطا قفل است.';

  const stepTabs = [
    { num: 1 as const, code: '۰۱', label: 'امتیاز و جزئیات', mobileLabel: 'امتیازها' },
    { num: 2 as const, code: '۰۲', label: 'نقاط قوت و ضعف', mobileLabel: 'نقاط کلیدی' },
    { num: 3 as const, code: '۰۳', label: 'هویت، تاریخ و متن', mobileLabel: 'متن و ثبت' },
  ];

  const canSubmit =
    !isLocked && !submitMutation.isPending && !!text.trim() && !!selectedHotel;

  return (
    <main className="mt-4 w-full xl:mt-10" dir="rtl">
      {/* هدر صفحه هم‌راستا با عرض کانتینر اصلی */}
      <header className="mb-6 rounded-2xl border border-zinc-200/80 bg-white p-6 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500">
              <span className="font-bold text-cs-dark-blue">پنل مدیریت نظرات</span>
              <span aria-hidden="true">·</span>
              <span>ثبت دیدگاه بدون نیاز به رزرو</span>
            </div>
            <h1 className="text-xl font-black text-zinc-900 text-balance lg:text-2xl">
              ثبت دیدگاه ادمین برای هتل‌ها
            </h1>
            <p className="text-xs font-medium leading-6 text-zinc-500 lg:text-sm">
              هتل مورد نظر را انتخاب کنید، امتیاز بخش‌ها و نکات کلیدی را مشخص نمایید
              و پیش‌نمایش نهایی را پیش از انتشار بررسی کنید.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              disabled={isLocked}
              onClick={() => resetForm(false)}
              className="flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>بازنشانی فرم</span>
            </button>
          </div>
        </div>
      </header>

      {/* اعلان قفل بودن در حالت عدم ورود یا دسترسی غیرمجاز */}
      {isLocked && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/90 p-5 lg:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-black text-rose-900 lg:text-base">
                {alertTitle}
              </h2>
              <p className="mt-1 text-xs font-medium leading-6 text-rose-800/90">
                {alertDescription}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={isFetching}
                  onClick={() => refetch()}
                  className="flex h-10 items-center justify-center rounded-xl bg-rose-600 px-4 text-xs font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-60 whitespace-nowrap"
                >
                  {isFetching ? 'در حال بررسی...' : 'بررسی مجدد ورود'}
                </button>
                {isNotLoggedIn ? (
                  <Link
                    href="/?auth_open=true"
                    className="flex h-10 items-center justify-center rounded-xl bg-cs-dark-blue px-4 text-xs font-bold text-white transition-colors hover:bg-zinc-800 whitespace-nowrap"
                  >
                    ورود به حساب کاربری
                  </Link>
                ) : null}
                <Link
                  href="/"
                  className="flex h-10 items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100/60 whitespace-nowrap"
                >
                  بازگشت به خانه
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* چیدمان دو ستونه: فضای اصلی فرم + ستون پیش‌نمایش زنده */}
      <fieldset
        disabled={isLocked}
        aria-disabled={isLocked}
        className={`m-0 w-full min-w-0 border-0 p-0 transition-opacity ${
          isLocked ? 'pointer-events-none select-none opacity-55' : ''
        }`}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_21.5rem] lg:items-start">
          {/* ستون اصلی: انتخاب هتل و فرم مرحله‌ای */}
          <div className="min-w-0 space-y-6">
            {/* باکس انتخاب هتل */}
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-black text-zinc-900 lg:text-base">
                    ۱. انتخاب هتل هدف
                  </h2>
                  <p className="mt-0.5 text-xs font-medium text-zinc-500">
                    نام هتل یا شهر را جستجو و انتخاب نمایید
                  </p>
                </div>
                {selectedHotel ? (
                  <button
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      setSelectedHotel(null);
                      setIsDropdownOpen(true);
                    }}
                    className="flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-100 whitespace-nowrap shrink-0"
                  >
                    تغییر هتل
                  </button>
                ) : null}
              </div>

              {!selectedHotel ? (
                <div ref={searchBoxRef} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      disabled={isLocked}
                      value={searchQuery}
                      onFocus={() => !isLocked && setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      placeholder={
                        isLocked
                          ? 'فرم قفل است — ابتدا با حساب ادمین وارد شوید'
                          : 'نام هتل یا شهر را بنویسید (مثلاً: درویشی، مشهد، اسپیناس)...'
                      }
                      className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/70 pl-11 pr-4 text-xs font-semibold text-zinc-900 outline-none transition-colors focus:border-cs-dark-blue focus:bg-white disabled:cursor-not-allowed disabled:bg-zinc-100 lg:text-sm"
                    />
                    {searchQuery && !isLocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setDebouncedQuery('');
                        }}
                        aria-label="پاک کردن جستجو"
                        className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200/70 hover:text-zinc-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                        <Search className="h-4 w-4" />
                      </span>
                    )}
                  </div>

                  {!isLocked && isDropdownOpen && (
                    <div className="absolute inset-x-0 top-14 z-30 max-h-80 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg">
                      {isSearchingHotels ? (
                        <div className="py-8 text-center text-xs font-semibold text-zinc-500">
                          در حال جستجوی هتل‌ها...
                        </div>
                      ) : hotelList.length === 0 ? (
                        <div className="py-8 text-center text-xs font-semibold text-zinc-400">
                          هتلی با این مشخصات یافت نشد.
                        </div>
                      ) : (
                        <div className="divide-y divide-zinc-100">
                          {hotelList.map((hotel) => (
                            <button
                              key={hotel.id}
                              type="button"
                              onClick={() => {
                                setSelectedHotel(hotel);
                                setIsDropdownOpen(false);
                              }}
                              className="flex w-full items-center gap-3.5 rounded-xl p-2.5 text-right transition-colors hover:bg-zinc-50"
                            >
                              <HotelThumb
                                src={hotel.main_image}
                                alt={hotel.name}
                                className="h-12 w-16"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="truncate text-xs font-extrabold text-zinc-900 lg:text-sm">
                                    {hotel.name}
                                  </span>
                                  {hotel.status !== 'published' ? (
                                    <span className="shrink-0 text-[11px] font-bold text-amber-600">
                                      · پیش‌نویس
                                    </span>
                                  ) : null}
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-500 tabular-nums">
                                  {hotel.city_name ? (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                                      {hotel.city_name}
                                    </span>
                                  ) : null}
                                  {hotel.city_name && hotel.stars ? (
                                    <span aria-hidden="true">·</span>
                                  ) : null}
                                  {hotel.stars ? (
                                    <span className="font-semibold text-amber-600">
                                      {toPersianDigits(hotel.stars)} ستاره
                                    </span>
                                  ) : null}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-4 rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3.5">
                    <HotelThumb
                      src={selectedHotel.main_image}
                      alt={selectedHotel.name}
                      className="h-16 w-24"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-black text-zinc-900 lg:text-base">
                        {selectedHotel.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-500 tabular-nums">
                        {selectedHotel.city_name ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                            {selectedHotel.city_name}
                          </span>
                        ) : null}
                        {selectedHotel.city_name && selectedHotel.stars ? (
                          <span aria-hidden="true">·</span>
                        ) : null}
                        {selectedHotel.stars ? (
                          <span className="text-amber-600">
                            {toPersianDigits(selectedHotel.stars)} ستاره
                          </span>
                        ) : null}
                        {selectedHotel.status !== 'published' ? (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-600">پیش‌نویس</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-emerald-700 shrink-0">
                    آماده ثبت دیدگاه
                  </div>
                </div>
              )}
            </section>

            {/* بخش اصلی مراحل فرم */}
            <section className="rounded-2xl border border-zinc-200/80 bg-white p-5 lg:p-7">
              {/* نوار تب‌های مراحل */}
              <div
                role="tablist"
                aria-label="مراحل ثبت دیدگاه"
                className="mb-6 grid grid-cols-3 gap-1.5 rounded-xl bg-zinc-100 p-1.5 lg:mb-7"
              >
                {stepTabs.map((item) => {
                  const isActive = step === item.num;
                  const isDone = step > item.num;
                  return (
                    <button
                      key={item.num}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      disabled={isLocked}
                      onClick={() => !isLocked && setStep(item.num)}
                      className={`flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[11px] font-bold transition-colors sm:gap-2 sm:text-xs whitespace-nowrap ${
                        isActive
                          ? 'bg-white text-zinc-900 shadow-sm'
                          : isDone
                            ? 'text-emerald-700 hover:bg-white/60'
                            : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      <span
                        className={`hidden tabular-nums sm:inline ${
                          isActive
                            ? 'text-cs-red font-black'
                            : isDone
                              ? 'text-emerald-600'
                              : 'text-zinc-400'
                        }`}
                      >
                        {isDone ? <Check className="h-3.5 w-3.5" /> : `${item.code}.`}
                      </span>
                      <span className="truncate sm:hidden">{item.mobileLabel}</span>
                      <span className="hidden truncate sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                {/* ================= استپ ۱ ================= */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/50 p-4 text-center sm:p-6">
                      <h2 className="text-base font-black text-zinc-900 lg:text-lg">
                        امتیاز کلی این دیدگاه چند ستاره است؟
                      </h2>
                      <p className="mt-1 text-xs font-medium text-zinc-500">
                        روی ستاره‌ها کلیک کنید تا امتیاز نهایی نظر ثبت شود
                      </p>

                      <div
                        className="mt-5 inline-flex max-w-full items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 sm:gap-2 sm:px-5 sm:py-3"
                        dir="ltr"
                      >
                        {[1, 2, 3, 4, 5].map((s) => {
                          const filled = s <= (hoverStar || stars);
                          return (
                            <button
                              key={s}
                              type="button"
                              disabled={isLocked}
                              onMouseEnter={() => !isLocked && setHoverStar(s)}
                              onMouseLeave={() => !isLocked && setHoverStar(0)}
                              onClick={() => handleSelectStars(s)}
                              aria-label={`${s} ستاره`}
                              className="p-1.5 transition-transform duration-150 hover:scale-110 active:scale-95"
                            >
                              <Star
                                className={`h-6 w-6 sm:h-7 sm:w-7 ${
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

                    {suggestedItems.length > 0 && (
                      <div className="border-t border-zinc-100 pt-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-sm font-extrabold text-zinc-900">
                            امتیازدهی به بخش‌های مختلف هتل
                          </h3>
                          <span className="text-xs font-medium text-zinc-400 tabular-nums">
                            {toPersianDigits(suggestedItems.length)} شاخص
                          </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {suggestedItems.map((item) => {
                            const currentVal = suggestedRatings[item.id] ?? 5;
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between gap-2 rounded-xl border border-zinc-200/80 bg-white px-4 py-3"
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
                                          disabled={isLocked}
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
                        disabled={isLocked}
                        onClick={() => setStep(2)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cs-dark-blue px-6 text-xs font-bold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed sm:w-auto whitespace-nowrap"
                      >
                        <span>مرحله بعد: نقاط قوت و ضعف</span>
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ================= استپ ۲ ================= */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-7"
                  >
                    {positiveItems.length > 0 && (
                      <div>
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-700">
                            <ThumbsUp className="h-4 w-4" />
                            <span>نقاط قوت هتل</span>
                          </div>
                          <span className="text-xs font-semibold text-zinc-500 tabular-nums">
                            {toPersianDigits(selectedStrengths.length)} مورد انتخاب شده
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {positiveItems.map((item) => {
                            const sel = selectedStrengths.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                disabled={isLocked}
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
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 text-sm font-extrabold text-rose-700">
                            <ThumbsDown className="h-4 w-4" />
                            <span>نقاط ضعف هتل (در صورت وجود)</span>
                          </div>
                          <span className="text-xs font-semibold text-zinc-500 tabular-nums">
                            {toPersianDigits(selectedWeaknesses.length)} مورد انتخاب شده
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {negativeItems.map((item) => {
                            const sel = selectedWeaknesses.includes(item.id);
                            return (
                              <button
                                key={item.id}
                                type="button"
                                disabled={isLocked}
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
                        disabled={isLocked}
                        onClick={() => setStep(1)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto whitespace-nowrap"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span>مرحله قبل</span>
                      </button>

                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => setStep(3)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-cs-dark-blue px-6 text-xs font-bold text-white transition-colors hover:bg-zinc-800 sm:w-auto whitespace-nowrap"
                      >
                        <span>مرحله بعد: متن و انتشار</span>
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ================= استپ ۳ ================= */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="mb-3 block text-xs font-extrabold text-zinc-900">
                        حالت ایموجی نمایشی کنار نام مسافر
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
                              disabled={isLocked}
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="admin-review-guest-name"
                          className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-900"
                        >
                          <User className="h-4 w-4 text-zinc-500" />
                          <span>نام نمایشی مسافر در سایت</span>
                        </label>
                        <input
                          id="admin-review-guest-name"
                          type="text"
                          disabled={isLocked}
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="مثلاً: سارا محمدی"
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 text-xs font-semibold text-zinc-900 outline-none transition-colors focus:border-cs-dark-blue focus:bg-white disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="admin-review-jalali-date"
                          className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-900"
                        >
                          <Calendar className="h-4 w-4 text-zinc-500" />
                          <span>تاریخ و ساعت شمسی (اختیاری)</span>
                        </label>
                        <input
                          id="admin-review-jalali-date"
                          type="text"
                          dir="ltr"
                          disabled={isLocked}
                          value={createdJalali}
                          onChange={(e) => setCreatedJalali(e.target.value)}
                          placeholder="1405/08/29 14:30"
                          className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 text-center font-mono text-xs font-semibold text-zinc-900 tabular-nums outline-none transition-colors focus:border-cs-dark-blue focus:bg-white disabled:cursor-not-allowed"
                        />
                        <p className="mt-1.5 text-[11px] font-medium text-zinc-400">
                          در صورت خالی گذاشتن، تاریخ و ساعت همین لحظه ثبت می‌شود
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <label
                          htmlFor="admin-review-text"
                          className="flex items-center gap-2 text-xs font-extrabold text-zinc-900"
                        >
                          <MessageSquareText className="h-4 w-4 text-zinc-500" />
                          <span>متن دیدگاه</span>
                        </label>
                        <span className="text-[11px] font-medium text-zinc-400 tabular-nums">
                          {toPersianDigits(text.trim().length)} کاراکتر
                        </span>
                      </div>
                      <textarea
                        id="admin-review-text"
                        rows={5}
                        disabled={isLocked}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="تجربه اقامت، کیفیت اتاق‌ها، برخورد پرسنل، نظافت و موقعیت مکانی هتل را بنویسید..."
                        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 text-xs font-medium leading-7 text-zinc-900 outline-none transition-colors focus:border-cs-dark-blue focus:bg-white disabled:cursor-not-allowed lg:text-sm"
                      />
                    </div>

                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/70 px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          disabled={isLocked}
                          checked={isApproved}
                          onChange={(e) => setIsApproved(e.target.checked)}
                          className="h-4 w-4 rounded accent-emerald-600"
                        />
                        <span className="text-xs font-bold text-zinc-800">
                          تایید شده (انتشار فوری در صفحه هتل)
                        </span>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isApproved ? 'text-emerald-700' : 'text-amber-600'
                        }`}
                      >
                        {isApproved ? 'انتشار عمومی' : 'ذخیره به عنوان پیش‌نویس'}
                      </span>
                    </label>

                    {!selectedHotel && !isLocked ? (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-800">
                        لطفاً ابتدا از کادر بالای فرم یک هتل انتخاب کنید تا دکمه ثبت
                        نهایی فعال شود.
                      </div>
                    ) : null}

                    <div className="flex flex-col-reverse gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="button"
                        disabled={isLocked}
                        onClick={() => setStep(2)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 text-xs font-bold text-zinc-700 transition-colors hover:bg-zinc-50 sm:w-auto whitespace-nowrap"
                      >
                        <ArrowRight className="h-4 w-4" />
                        <span>مرحله قبل</span>
                      </button>

                      <button
                        type="button"
                        disabled={!canSubmit}
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

          {/* ستون کناری: پیش‌نمایش زنده و چک‌لیست ارسال */}
          <aside className="rounded-2xl border border-zinc-200/80 bg-white p-5 lg:sticky lg:top-24 lg:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-100 pb-3.5">
              <h2 className="text-sm font-black text-zinc-900">پیش‌نمایش دیدگاه</h2>
              <span
                className={`text-xs font-bold ${
                  isApproved ? 'text-emerald-700' : 'text-amber-600'
                }`}
              >
                {isApproved ? 'انتشار فوری' : 'در انتظار تایید'}
              </span>
            </div>

            {/* پروفایل مسافر در پیش‌نمایش */}
            <div className="flex items-center gap-3">
              <span
                style={{ backgroundColor: activeEmoji.bg }}
                className="flex size-11 shrink-0 items-center justify-center rounded-full"
              >
                <span className="block translate-y-[1px] text-[22px] leading-none">
                  {activeEmoji.emoji}
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-extrabold text-zinc-900">
                  {guestName.trim() || 'مسافر زروان تریپ'}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-500 tabular-nums">
                  <span>{createdJalali.trim() || 'ثبت با زمان فعلی'}</span>
                  <span aria-hidden="true">·</span>
                  <span className={STAR_LABELS[stars].tone}>
                    {toPersianDigits(stars)} از ۵
                  </span>
                </div>
              </div>
            </div>

            {/* هتل انتخاب‌شده */}
            <div className="mt-4 border-t border-zinc-100 pt-4">
              <div className="text-[11px] font-semibold text-zinc-400">هتل مقصد</div>
              <div className="mt-1 truncate text-xs font-extrabold text-zinc-800">
                {selectedHotel ? selectedHotel.name : 'هنوز هتلی انتخاب نشده است'}
              </div>
              {selectedHotel?.city_name ? (
                <div className="mt-0.5 text-[11px] font-medium text-zinc-500">
                  {selectedHotel.city_name}
                </div>
              ) : null}
            </div>

            {/* پیش‌نمایش متن دیدگاه */}
            <div className="mt-4 border-t border-zinc-100 pt-4">
              <div className="text-[11px] font-semibold text-zinc-400">متن نظر</div>
              <p className="mt-1.5 line-clamp-4 text-xs font-medium leading-6 text-zinc-600">
                {text.trim()
                  ? text.trim()
                  : 'پس از نوشتن متن دیدگاه در مرحله سوم، خلاصه آن در این بخش نمایش داده می‌شود.'}
              </p>
            </div>

            {/* خلاصه نقاط قوت و ضعف و چک‌لیست */}
            <div className="mt-4 space-y-2.5 border-t border-zinc-100 pt-4 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span>نقاط قوت انتخاب‌شده</span>
                <span className="font-bold text-emerald-700 tabular-nums">
                  {toPersianDigits(selectedStrengths.length)} مورد
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>نقاط ضعف انتخاب‌شده</span>
                <span className="font-bold text-rose-700 tabular-nums">
                  {toPersianDigits(selectedWeaknesses.length)} مورد
                </span>
              </div>
              <div className="flex items-center justify-between text-zinc-600">
                <span>وضعیت آمادگی ثبت</span>
                <span
                  className={`font-bold ${
                    selectedHotel && text.trim() ? 'text-emerald-700' : 'text-zinc-500'
                  }`}
                >
                  {selectedHotel && text.trim()
                    ? 'تکمیل و آماده ارسال'
                    : !selectedHotel
                      ? 'نیاز به انتخاب هتل'
                      : 'نیاز به متن دیدگاه'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </fieldset>
    </main>
  );
}