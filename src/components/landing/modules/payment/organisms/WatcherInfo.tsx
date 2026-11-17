'use client';

import Link from 'next/link';
import { payment } from '../helpers/constant';
import { axiosInstance } from '@/utils/axios';
import loader from '@/styles/loader.module.css';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

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

  // دریافت عکس هتل مشابه استپ دوم (جهت اطمینان کامل)
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
    <div className="space-y-4">
      {/* کارت عکس هتل دقیقاً مشابه استپ دوم */}
      {hotelImage ? (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          {hotelSlug ? (
            <Link href={`/hotel/${hotelSlug}`} className="block group relative h-44 w-full overflow-hidden">
              <img
                src={hotelImage}
                alt={hotelName || 'تصویر هتل'}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {hotelName ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-2.5 text-xs font-bold text-white">
                  {hotelName}
                </div>
              ) : null}
            </Link>
          ) : (
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src={hotelImage}
                alt={hotelName || 'تصویر هتل'}
                className="h-full w-full object-cover"
              />
              {hotelName ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 py-2.5 text-xs font-bold text-white">
                  {hotelName}
                </div>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {/* کارت وضعیت پرداخت */}
      <div className="rounded-xl border bg-white p-5 text-cs08/6 font-semibold">
        {status === 'pending' ? (
          <div className="flex-center h-28">
            <div className={loader.dots} />
          </div>
        ) : (
          <>
            {paymentStatus === 'paid' ? (
              <div className="grid">
                <p className="border-b pb-3 text-cs85/5 font-bold text-green-600">
                  پرداخت صورتحساب با موفقیت انجام شد
                </p>

                <p className="mb-4 mt-3.5 text-zinc-600">
                  مشتری گرامی سپاس از اعتماد شما نسبت به مجموعه زروان تریپ , خرید
                  شما با موفقیت انجام شد .
                </p>

                <Link
                  href={`/dashboard/reservations/${trackingCode}`}
                  className="flex w-fit items-center gap-2 rounded-cs-10 bg-cs-blue/10 px-5 py-2 font-bold text-cs-blue"
                >
                  <div className="relative aspect-square w-2.5 rounded-full bg-cs-blue/90">
                    <span className="pointer-events-none absolute inset-0 animate-ping rounded-lg bg-cs-blue" />
                  </div>

                  <span>مشاهده واچر</span>
                </Link>
              </div>
            ) : (
              <div className="grid">
                <p className="border-b pb-3 text-cs85/5 font-bold text-cs-red">
                  پرداخت صورتحساب با خطا مواجه شد
                </p>

                <p className="mb-4 mt-3.5 text-zinc-600">
                  مشتری گرامی به دلیل مشکل فنی در سیستم درگاه پرداخت , رزرو شما
                  قابل پیگیری نمیباشد .
                  <br />
                  لطفا رزرو جدیدی را با استفاده از دکمه زیر ثبت نمایید .
                </p>

                <Link
                  href={'/hotel'}
                  className="w-fit rounded-cs-10 bg-zinc-100 px-5 py-2 text-zinc-800"
                >
                  ثبت رزرو جدید
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}