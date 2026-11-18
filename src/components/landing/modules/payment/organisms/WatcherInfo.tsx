'use client';

import Link from 'next/link';
import { payment } from '../helpers/constant';
import { axiosInstance } from '@/utils/axios';
import loader from '@/styles/loader.module.css';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { TickCircle, CloseCircle } from 'iconsax-react';

type ApiResponse = {
  payment_status: 'unpaid' | 'paid' | 'pending';
  hotel_image?: string;
  hotel_slug?: string;
  hotel_name?: string;
};

type HotelImageResponse = {
  hotel_image: string;
  hotel_slug: string;
  hotel_name?: string;
};

// ------------------------------

export function WatcherInfo() {
  const searchParams = useSearchParams();
  const trackingCode =
    searchParams.get(payment.reservationId) ||
    searchParams.get('tracking-code') ||
    searchParams.get('tracking_code');

  const { data, status } = useQuery<ApiResponse>({
    queryKey: ['payment-status', trackingCode],
    enabled: Boolean(trackingCode),
    queryFn: () =>
      axiosInstance(`/payment/payment-status/${trackingCode}/`).then(
        (res) => res?.data?.data || res?.data,
      ),
  });

  const { data: hotelData } = useQuery<HotelImageResponse>({
    queryKey: ['reservation-hotel-image', trackingCode],
    enabled: Boolean(trackingCode),
    queryFn: () =>
      axiosInstance(`/hotel/reservation/hotel-slug/${trackingCode}/`).then(
        (res) => res?.data?.data || res?.data,
      ),
  });

  const paymentStatus = data?.payment_status;
  const hotelImage = data?.hotel_image || hotelData?.hotel_image;
  const hotelSlug = data?.hotel_slug || hotelData?.hotel_slug;
  const hotelName = data?.hotel_name || hotelData?.hotel_name;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      {/* عکس تمیز هتل (بدون نوشته روی عکس، یکسان در موبایل و دسکتاپ) */}
      {hotelImage ? (
        <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
          {hotelSlug ? (
            <Link
              href={`/hotel/${hotelSlug}`}
              className="group block h-44 w-full overflow-hidden md:h-52"
            >
              <img
                src={hotelImage}
                alt={hotelName || 'تصویر هتل'}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
          ) : (
            <div className="h-44 w-full overflow-hidden md:h-52">
              <img
                src={hotelImage}
                alt={hotelName || 'تصویر هتل'}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      ) : null}

      {/* کارت وضعیت پرداخت (ریسپانسیو در موبایل و دسکتاپ) */}
      <div className="rounded-2xl border border-zinc-100 bg-white p-6 text-cs08/6 font-semibold shadow-sm md:p-8">
        {status === 'pending' ? (
          <div className="flex-center h-32">
            <div className={loader.dots} />
          </div>
        ) : (
          <>
            {paymentStatus === 'paid' ? (
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <TickCircle
                    size={36}
                    variant="Bold"
                    className="text-green-600"
                  />
                </div>
                <h2 className="mb-2 text-lg font-black text-green-700 md:text-xl">
                  پرداخت صورت‌حساب با موفقیت انجام شد
                </h2>
                <p className="mb-8 max-w-md text-sm leading-7 text-zinc-600">
                  مشتری گرامی، سپاس از اعتماد شما به مجموعه زروان تریپ. خرید شما
                  با موفقیت قطعی شد و واچر اقامت صادر گردید.
                </p>

                <div className="flex w-full flex-col items-center justify-center gap-3 md:flex-row">
                  <Link
                    href={`/voucher/${trackingCode}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 active:scale-95 md:w-auto md:py-2.5"
                  >
                    <span>مشاهده و دانلود واچر</span>
                  </Link>

                  <Link
                    href={`/dashboard/reservations/${trackingCode}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-100 px-6 py-3 text-sm font-bold text-zinc-700 transition-all hover:bg-zinc-200 active:scale-95 md:w-auto md:py-2.5"
                  >
                    <span>پنل کاربری</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                  <CloseCircle
                    size={36}
                    variant="Bold"
                    className="text-cs-red"
                  />
                </div>
                <h2 className="mb-2 text-lg font-black text-cs-red md:text-xl">
                  پرداخت صورت‌حساب ناموفق بود
                </h2>
                <p className="mb-8 max-w-md text-sm leading-7 text-zinc-600">
                  به دلیل لغو تراکنش یا مشکل در درگاه بانکی، رزرو شما قطعی نشد.
                  در صورت کسر وجه از حساب شما، مبلغ طی ۷۲ ساعت توسط بانک بازگشت
                  داده می‌شود.
                </p>

                <Link
                  href={hotelSlug ? `/hotel/${hotelSlug}` : '/hotel'}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-zinc-800 active:scale-95 md:w-auto md:py-2.5"
                >
                  <span>تلاش مجدد و ثبت رزرو جدید</span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}