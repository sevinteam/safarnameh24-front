'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { payment } from '../helpers/constant';
import { axiosInstance } from '@/utils/axios';
import loader from '@/styles/loader.module.css';

import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCheckAuth } from '@/hooks';
import { useUserAccountContext } from '@/context/UserAccountContext';

type ApiResponse = { payment_status: 'unpaid' | 'paid' | 'pending' };

// ------------------------------

export function WatcherInfo() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingCode =
    searchParams.get(payment.reservationId) ||
    searchParams.get('tracking-code') ||
    searchParams.get('tracking_code');

  const { isAuthenticated } = useCheckAuth();
  const { toggle } = useUserAccountContext();
  const [waitingForLogin, setWaitingForLogin] = useState(false);

  const { data, status } = useQuery<ApiResponse>({
    queryKey: ['payment-status', trackingCode],
    enabled: Boolean(trackingCode),
    queryFn: () =>
      axiosInstance(`/payment/payment-status/${trackingCode}/`).then(
        (res) => res?.data?.data || res?.data,
      ),
  });

  const paymentStatus = data?.payment_status;

  // به محض اینکه کاربر از طریق پاپ‌آپ لاگین کرد، خودکار به صفحه واچر هدایت شود
  useEffect(() => {
    if (waitingForLogin && isAuthenticated && trackingCode) {
      setWaitingForLogin(false);
      router.push(`/dashboard/reservations/${trackingCode}`);
    }
  }, [waitingForLogin, isAuthenticated, trackingCode, router]);

  function handleVoucherClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!isAuthenticated) {
      e.preventDefault();
      setWaitingForLogin(true);
      toggle(); // باز کردن پاپ‌آپ لاگین
    }
  }

  return (
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
                مشتری گرامی سپاس از اعتماد شما نسبت به مجموعه سفرنامه ۲۴  , خرید
                شما با موفقیت انجام شد .
              </p>

              <Link
                href={`/dashboard/reservations/${trackingCode}`}
                onClick={handleVoucherClick}
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
  );
}