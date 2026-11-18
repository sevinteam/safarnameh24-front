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
    stars: number;
    city_name: string;
    main_image: string;
  };
  comment_point_items: PointItem[];
  suggested_comment_items: SuggestedItem[];
};

const STAR_LABELS: Record<number, string> = {
  1: 'ضعیف',
  2: 'متوسط',
  3: 'خوب',
  4: 'خیلی خوب',
  5: 'عالی و فوق‌العاده',
};

export default function PostStayReviewPage({
  params,
}: {
  params: Promise<{ trackingCode: string }>;
}) {
  const { trackingCode } = use(params);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stars, setStars] = useState<number>(5);
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
        const payload = res?.data?.data || res?.data;
        return payload;
      }),
  });

  // مقداردهی اولیه نام مسافر و امتیازهای پیش‌فرض معیارها
  useEffect(() => {
    if (reviewData) {
      if (reviewData.guest_name && !guestName) {
        setGuestName(reviewData.guest_name);
      }
      if (reviewData.suggested_comment_items?.length && Object.keys(suggestedRatings).length === 0) {
        const initRatings: Record<number, number> = {};
        reviewData.suggested_comment_items.forEach((item) => {
          initRatings[item.id] = 5;
        });
        setSuggestedRatings(initRatings);
      }
    }
  }, [reviewData]);

  const submitMutation = useMutation({
    mutationFn: () => {
      const payload = {
        guest_name: guestName.trim(),
        stars,
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
      <main className="container mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-4 rounded-2xl border bg-white p-8 shadow-sm">
          <div className="h-44 w-full animate-pulse rounded-xl bg-zinc-100" />
          <div className="h-8 w-2/3 animate-pulse rounded-lg bg-zinc-100" />
          <div className="h-32 w-full animate-pulse rounded-xl bg-zinc-100" />
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
      <main className="container mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-lg font-black text-cs-red">امکان ثبت نظر وجود ندارد</h1>
          <p className="mb-6 text-sm font-medium text-zinc-600">{errMsg}</p>
          <Link
            href="/"
            className="inline-block rounded-xl bg-cs-dark-blue px-6 py-2.5 text-sm font-bold text-white"
          >
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </main>
    );
  }

  // حالت ثبت موفق یا نظر قبلاً ثبت‌شده
  if (submittedSuccess || reviewData.already_reviewed) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-16" dir="rtl">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <TickCircle size={36} variant="Bold" className="text-emerald-600" />
          </div>
          <h1 className="mb-2 text-xl font-black text-emerald-700">
            {submittedSuccess
              ? 'دیدگاه شما با موفقیت ثبت و منتشر شد!'
              : 'دیدگاه شما قبلاً برای این رزرو ثبت شده است'}
          </h1>
          <p className="mb-6 text-sm leading-7 text-zinc-600">
            تجربه اقامت شما در <strong>{reviewData.hotel.name}</strong> به سایر
            مسافران برای انتخاب بهتر کمک خواهد کرد.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href={`/hotel/${reviewData.hotel.slug}#customer-reviews`}
              className="rounded-xl bg-cs-dark-blue px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              مشاهده نظر در صفحه هتل
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-200"
            >
              صفحه اصلی
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const positiveItems = reviewData.comment_point_items.filter((i) => i.is_positive);
  const negativeItems = reviewData.comment_point_items.filter((i) => i.is_negative);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 lg:py-12" dir="rtl">
      {/* کارت خلاصه هتل و رزرو */}
      <div className="mb-6 flex flex-col gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        {reviewData.hotel.main_image ? (
          <img
            src={reviewData.hotel.main_image}
            alt={reviewData.hotel.name}
            className="h-32 w-full rounded-xl object-cover sm:h-28 sm:w-40"
          />
        ) : null}
        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-lg bg-cs-blue/10 px-2.5 py-0.5 text-xs font-bold text-cs-blue">
              کد پیگیری: {reviewData.tracking_code}
            </span>
            {reviewData.hotel.city_name ? (
              <span className="text-xs font-semibold text-zinc-500">
                {reviewData.hotel.city_name}
              </span>
            ) : null}
          </div>
          <h1 className="text-base font-black text-zinc-900 lg:text-lg">
            نظرسنجی اقامت در {reviewData.hotel.name}
          </h1>
          <p className="text-xs font-medium text-zinc-500">
            تاریخ اقامت: {reviewData.check_in_date} تا {reviewData.check_out_date}
          </p>
        </div>
      </div>

      {/* نوار پیشرفت استپی (۳ مرحله) */}
      <div className="mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm">
        {[
          { num: 1, label: '۱. امتیازدهی' },
          { num: 2, label: '۲. نقاط قوت و ضعف' },
          { num: 3, label: '۳. متن نظر و ثبت' },
        ].map((item) => {
          const isActive = step === item.num;
          const isDone = step > item.num;
          return (
            <button
              key={item.num}
              type="button"
              onClick={() => setStep(item.num as 1 | 2 | 3)}
              className={`rounded-xl py-2.5 text-xs font-extrabold transition lg:text-sm ${
                isActive
                  ? 'bg-cs-dark-blue text-white shadow-sm'
                  : isDone
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-zinc-50 text-zinc-500'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* بدنه فرم استپی */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:p-8">
        {/* ================= استپ ۱: امتیاز کلی و معیارها ================= */}
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="mb-2 text-base font-black text-zinc-900 lg:text-lg">
                امتیاز کلی شما به این هتل چقدر است؟
              </h2>
              <p className="mb-4 text-xs font-medium text-zinc-500">
                لطفاً تجربه اقامت خود را از ۱ تا ۵ ستاره انتخاب کنید
              </p>

              <div className="flex items-center justify-center gap-2" dir="ltr">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStars(s)}
                    className="rounded-xl p-1.5 transition hover:scale-110"
                  >
                    <Star1
                      size={36}
                      variant={s <= stars ? 'Bold' : 'Outline'}
                      className={s <= stars ? 'text-amber-400' : 'text-zinc-300'}
                    />
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm font-extrabold text-amber-600">
                {STAR_LABELS[stars]} ({stars} از ۵)
              </div>
            </div>

            {reviewData.suggested_comment_items.length > 0 && (
              <div className="border-t border-zinc-100 pt-6">
                <h3 className="mb-4 text-sm font-extrabold text-zinc-800">
                  امتیاز به جزئیات و معیارهای هتل:
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {reviewData.suggested_comment_items.map((item) => {
                    const currentVal = suggestedRatings[item.id] ?? 5;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/70 px-4 py-3"
                      >
                        <span className="text-xs font-bold text-zinc-800 lg:text-sm">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1" dir="ltr">
                          {[1, 2, 3, 4, 5].map((r) => (
                            <button
                              key={r}
                              type="button"
                              onClick={() =>
                                setSuggestedRatings((prev) => ({
                                  ...prev,
                                  [item.id]: r,
                                }))
                              }
                            >
                              <Star1
                                size={20}
                                variant={r <= currentVal ? 'Bold' : 'Outline'}
                                className={
                                  r <= currentVal ? 'text-amber-400' : 'text-zinc-300'
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-cs-dark-blue px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
              >
                <span>مرحله بعد</span>
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= استپ ۲: نقاط قوت و ضعف ================= */}
        {step === 2 && (
          <div className="space-y-8">
            {positiveItems.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-emerald-700">
                  <Like1 size={20} variant="Bold" />
                  <span>نقاط قوت هتل (انتخاب کنید)</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {positiveItems.map((item) => {
                    const selected = selectedStrengths.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleStrength(item.id)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition lg:text-sm ${
                          selected
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {negativeItems.length > 0 && (
              <div className="border-t border-zinc-100 pt-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-rose-600">
                  <Dislike size={20} variant="Bold" />
                  <span>نقاط ضعف هتل (در صورت وجود انتخاب کنید)</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {negativeItems.map((item) => {
                    const selected = selectedWeaknesses.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleWeakness(item.id)}
                        className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition lg:text-sm ${
                          selected
                            ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '}
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-200"
              >
                <ArrowRight size={18} />
                <span>مرحله قبل</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex items-center gap-2 rounded-xl bg-cs-dark-blue px-6 py-3 text-sm font-bold text-white transition hover:opacity-95"
              >
                <span>مرحله بعد</span>
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        )}

        {/* ================= استپ ۳: نام نمایشی و متن نظر ================= */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-800 lg:text-sm">
                <User size={18} className="text-cs-blue" />
                <span>نام نمایشی شما در بخش نظرات هتل</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثلاً: علیرضا آذرخش"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm font-semibold text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-extrabold text-zinc-800 lg:text-sm">
                <MessageText1 size={18} className="text-cs-blue" />
                <span>تجربه خود از اقامت در این هتل را بنویسید</span>
              </label>
              <textarea
                rows={5}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="کیفیت اتاق‌ها، برخورد پرسنل، صبحانه و موقعیت مکانی هتل چطور بود؟"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium leading-7 text-zinc-900 outline-none transition focus:border-cs-blue focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-200"
              >
                <ArrowRight size={18} />
                <span>مرحله قبل</span>
              </button>

              <button
                type="button"
                disabled={submitMutation.isPending || !text.trim()}
                onClick={() => submitMutation.mutate()}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3 text-sm font-black text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <TickCircle size={20} variant="Bold" />
                <span>
                  {submitMutation.isPending ? 'در حال ثبت نظر...' : 'ثبت نهایی نظر'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}