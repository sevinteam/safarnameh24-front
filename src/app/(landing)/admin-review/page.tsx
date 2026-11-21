'use client';

import { useEffect, useRef, useState } from 'react';
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

type HotelOption = {
  id: number;
  name: string;
  slug: string;
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
  hotel_name: string;
  created_jalali: string;
};

function toPersianDigits(val: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (d) => persianDigits[Number(d)]);
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

  const errorStatus = (error as any)?.response?.status;
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
  }, [initData]);

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
        guest_name: guestName.trim() || 'مسافر سفرنامه ۲۴ ',
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
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
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
      <main className="container mx-auto max-w-2xl px-4 py-20" dir="rtl">
        <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border border-zinc-100 bg-white p-10 shadow-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cs-blue border-t-transparent" />
          <p className="text-sm font-bold text-zinc-600">در حال بررسی دسترسی و بارگذاری فرم...</p>
        </div>
      </main>
    );
  }

  if (submittedResult) {
    return (
      <main className="container mx-auto max-w-lg px-4 py-20" dir="rtl">
        <div className="rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-lg shadow-emerald-500/5">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
            <TickCircle size={36} variant="Bold" color="currentColor" />
          </div>
          <h1 className="mb-2 text-lg font-black text-emerald-800">
            نظر با موفقیت ثبت شد!
          </h1>
          <p className="mb-2 text-xs font-semibold leading-7 text-zinc-600">
            دیدگاه جدید برای هتل <strong>{submittedResult.hotel_name}</strong> ذخیره گردید.
          </p>
          {submittedResult.created_jalali ? (
            <p className="mb-7 text-[11px] font-bold text-zinc-400">
              تاریخ ثبت‌شده: {submittedResult.created_jalali}
            </p>
          ) : null}

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => resetForm(true)}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
            >
              ثبت نظر جدید برای همین هتل
            </button>
            <button
              type="button"
              onClick={() => resetForm(false)}
              className="rounded-xl bg-zinc-100 px-6 py-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
            >
              انتخاب هتل دیگر و ثبت نظر جدید
            </button>
            <Link
              href={`/hotel/${submittedResult.hotel_slug}#customer-reviews`}
              className="rounded-xl bg-cs-dark-blue px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-90"
            >
              مشاهده نظر در صفحه هتل
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const hotelList =
    debouncedQuery.length > 0
      ? searchedHotelsData?.hotels || []
      : initData?.hotels || [];

  const positiveItems = (initData?.comment_point_items || []).filter((i) => i.is_positive);
  const negativeItems = (initData?.comment_point_items || []).filter((i) => i.is_negative);
  const suggestedItems = initData?.suggested_comment_items || [];

  const alertTitle = isNotLoggedIn
    ? 'شما وارد حساب کاربری نشده‌اید!'
    : isForbidden
      ? 'دسترسی غیرمجاز (فقط مخصوص ادمین)'
      : 'امکان بارگذاری اطلاعات وجود ندارد';

  const alertDescription = isNotLoggedIn
    ? 'برای ثبت نظر هتل، ابتدا باید با حساب مدیریت (ادمین) وارد سایت شوید. تا زمان ورود، این فرم و تمامی فیلدها قفل هستند.'
    : isForbidden
      ? 'حساب کاربری فعلی شما دسترسی مدیریت (ادمین) ندارد. لطفاً با حساب ادمین وارد شوید تا فرم باز شود.'
      : (error as any)?.response?.data?.message ||
        (error as any)?.response?.data?.detail ||
        'ارتباط با سرور برقرار نشد. فرم تا زمان رفع خطا قفل است.';

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8 lg:py-12" dir="rtl">
      {/* ================= الرت بالای صفحه در حالت قفل / عدم ورود ================= */}
      {isLocked && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border-2 border-rose-200 bg-rose-50/90 p-5 shadow-sm"
        >
          <div className="flex items-start gap-3.5">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-black text-rose-800">{alertTitle}</h2>
              <p className="mt-1 text-xs font-semibold leading-6 text-rose-700/90">
                {alertDescription}
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={isFetching}
                  onClick={() => refetch()}
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
                >
                  {isFetching ? 'در حال بررسی...' : 'بررسی مجدد ورود'}
                </button>
                <Link
                  href="/"
                  className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-100/50"
                >
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= کل فرم (در حالت عدم لاگین کاملاً قفل و غیرفعال) ================= */}
      <fieldset
        disabled={isLocked}
        aria-disabled={isLocked}
        className={`min-w-0 w-full border-0 p-0 m-0 transition ${
          isLocked ? 'pointer-events-none select-none opacity-50 grayscale-[35%]' : ''
        }`}
      >
        {/* باکس جستجو و انتخاب هتل */}
        <div className="mb-6 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-cs-dark-blue">
                پنل اختصاصی ادمین (ثبت نظر بدون رزرو)
              </span>
              <h1 className="mt-1.5 text-sm font-black text-zinc-900 sm:text-base">
                انتخاب هتل برای ثبت دیدگاه
              </h1>
            </div>
            {selectedHotel ? (
              <button
                type="button"
                disabled={isLocked}
                onClick={() => {
                  setSelectedHotel(null);
                  setIsDropdownOpen(true);
                }}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-600 transition hover:bg-zinc-100"
              >
                تغییر هتل
              </button>
            ) : null}
          </div>

          {/* فیلد جستجوی هتل */}
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
                      : 'نام هتل یا شهر را جستجو کنید (مثلاً: درویشی، مشهد، اسپیناس)...'
                  }
                  className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-xs font-semibold text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white disabled:cursor-not-allowed disabled:bg-zinc-100"
                />
                {searchQuery && !isLocked ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setDebouncedQuery('');
                    }}
                    aria-label="پاک کردن جستجو"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"
                  >
                    ✕
                  </button>
                ) : (
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </span>
                )}
              </div>

              {!isLocked && isDropdownOpen && (
                <div className="absolute inset-x-0 top-14 z-30 max-h-80 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-2 shadow-xl">
                  {isSearchingHotels ? (
                    <div className="py-6 text-center text-xs font-bold text-zinc-500">
                      در حال جستجوی هتل‌ها...
                    </div>
                  ) : hotelList.length === 0 ? (
                    <div className="py-6 text-center text-xs font-bold text-zinc-400">
                      هتلی با این مشخصات یافت نشد.
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {hotelList.map((hotel) => (
                        <button
                          key={hotel.id}
                          type="button"
                          onClick={() => {
                            setSelectedHotel(hotel);
                            setIsDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl p-2 text-right transition hover:bg-blue-50/70"
                        >
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                            {hotel.main_image ? (
                              <img
                                src={hotel.main_image}
                                alt={hotel.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-400">
                                بدون عکس
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-xs font-black text-zinc-900">
                                {hotel.name}
                              </span>
                              {hotel.status !== 'published' ? (
                                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                  پیش‌نویس
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-1 flex items-center gap-3 text-[11px] font-semibold text-zinc-500">
                              {hotel.city_name ? (
                                <span className="flex items-center gap-1">
                                  <Location size={12} color="currentColor" />
                                  {hotel.city_name}
                                </span>
                              ) : null}
                              {hotel.stars ? (
                                <span className="text-amber-500">
                                  ★ {toPersianDigits(hotel.stars)} ستاره
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
            /* کارت هتل انتخاب‌شده */
            <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white">
              {selectedHotel.main_image ? (
                <div className="relative h-36 w-full sm:h-40">
                  <img
                    src={selectedHotel.main_image}
                    alt={selectedHotel.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-white">
                    <div>
                      <span className="rounded-lg bg-white/20 px-2 py-0.5 text-[10px] font-bold backdrop-blur-md">
                        {selectedHotel.stars
                          ? `${toPersianDigits(selectedHotel.stars)} ستاره`
                          : 'هتل انتخاب‌شده'}
                      </span>
                      <h2 className="mt-1 text-sm font-black sm:text-base">
                        {selectedHotel.name}
                      </h2>
                    </div>
                    {selectedHotel.city_name ? (
                      <div className="flex items-center gap-1 text-xs font-semibold text-zinc-200">
                        <Location size={14} color="currentColor" />
                        <span>{selectedHotel.city_name}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-zinc-50 px-4 py-3">
                  <span className="text-sm font-black text-zinc-900">
                    {selectedHotel.name}
                  </span>
                  {selectedHotel.city_name ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-zinc-500">
                      <Location size={14} color="currentColor" />
                      {selectedHotel.city_name}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          )}
        </div>

        {/* نوار مراحل استپی */}
        <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-200/80 bg-white p-2.5 shadow-sm">
          {[
            { num: 1, label: '۱. امتیاز کل و جزئیات' },
            { num: 2, label: '۲. نقاط قوت و ضعف' },
            { num: 3, label: '۳. ایموجی، تاریخ و متن' },
          ].map((item) => {
            const isActive = step === item.num;
            const isDone = step > item.num;
            return (
              <button
                key={item.num}
                type="button"
                disabled={isLocked}
                onClick={() => !isLocked && setStep(item.num as 1 | 2 | 3)}
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
                  امتیاز کلی این نظر به هتل چند ستاره است؟
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
                        disabled={isLocked}
                        onMouseEnter={() => !isLocked && setHoverStar(s)}
                        onMouseLeave={() => !isLocked && setHoverStar(0)}
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

              {suggestedItems.length > 0 && (
                <div className="border-t border-zinc-100 pt-6">
                  <h3 className="mb-4 text-xs font-extrabold text-zinc-700 lg:text-sm">
                    امتیازدهی به بخش‌های مختلف هتل:
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {suggestedItems.map((item) => {
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
                  disabled={isLocked}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-xl bg-cs-dark-blue px-6 py-3 text-xs font-bold text-white shadow-md transition hover:opacity-95 disabled:cursor-not-allowed"
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
                          disabled={isLocked}
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
                          disabled={isLocked}
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
                  disabled={isLocked}
                  onClick={() => setStep(1)}
                  className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
                >
                  <ArrowRight size={16} color="currentColor" />
                  <span>مرحله قبل</span>
                </button>

                <button
                  type="button"
                  disabled={isLocked}
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
              <div>
                <label className="mb-3 block text-xs font-extrabold text-zinc-800">
                  ایموجی نمایشی کنار نظر را انتخاب کنید
                </label>
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {EMOJI_OPTIONS.map((opt) => {
                    const isSelected = avatarStyle === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        disabled={isLocked}
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-800">
                    <User size={16} color="currentColor" className="text-cs-blue" />
                    <span>نام نمایشی مسافر در سایت</span>
                  </label>
                  <input
                    type="text"
                    disabled={isLocked}
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="مثلاً: سارا محمدی"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-xs font-semibold text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-800">
                    <Calendar size={16} color="currentColor" className="text-cs-blue" />
                    <span>تاریخ و ساعت شمسی (اختیاری)</span>
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    disabled={isLocked}
                    value={createdJalali}
                    onChange={(e) => setCreatedJalali(e.target.value)}
                    placeholder="1405/08/29 14:30"
                    className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-center font-mono text-xs font-semibold text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-[10px] font-semibold text-zinc-400">
                    خالی بگذارید = ثبت با تاریخ و ساعت همین لحظه
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-800">
                  <MessageText1 size={16} color="currentColor" className="text-cs-blue" />
                  <span>متن دیدگاه</span>
                </label>
                <textarea
                  rows={5}
                  disabled={isLocked}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="کیفیت اتاق‌ها، برخورد پرسنل، نظافت و موقعیت مکانی چطور بود؟"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-xs font-medium leading-7 text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white disabled:cursor-not-allowed"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-zinc-200/70 bg-zinc-50/80 px-4 py-3">
                <input
                  type="checkbox"
                  disabled={isLocked}
                  checked={isApproved}
                  onChange={(e) => setIsApproved(e.target.checked)}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="text-xs font-bold text-zinc-700">
                  تایید شده (انتشار فوری در صفحه هتل)
                </span>
              </label>

              {!selectedHotel && !isLocked ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold text-amber-700">
                  لطفاً ابتدا از کادر بالای صفحه یک هتل انتخاب کنید تا دکمه ثبت فعال شود.
                </div>
              ) : null}

              <div className="flex items-center justify-between border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  disabled={isLocked}
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-xs font-bold text-zinc-700 transition hover:bg-zinc-200"
                >
                  <ArrowRight size={16} color="currentColor" />
                  <span>مرحله قبل</span>
                </button>

                <button
                  type="button"
                  disabled={isLocked || submitMutation.isPending || !text.trim() || !selectedHotel}
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
      </fieldset>
    </main>
  );
}