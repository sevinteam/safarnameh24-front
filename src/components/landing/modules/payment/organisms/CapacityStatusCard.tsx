'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { payment } from '../helpers/constant';
import { useReservationStatus } from '../helpers/useReservationStatus';

// ------------------------------

export function CapacityStatusCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get(payment.reservationId);
  const { status } = useReservationStatus(trackingCode);

  const isConfirmed = status === 'confirmed';
  const isRejected = status === 'rejected';

  const passengersHref = trackingCode
    ? `/payment/complete-passengers-information?${payment.reservationId}=${trackingCode}`
    : '/payment/complete-passengers-information';

  useEffect(() => {
    router.prefetch(passengersHref);
  }, [passengersHref, router]);

  useEffect(() => {
    if (isConfirmed) {
      router.replace(passengersHref, { scroll: false });
    }
  }, [isConfirmed, passengersHref, router]);

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-start gap-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
            isConfirmed
              ? 'bg-green-50 text-green-600'
              : isRejected
                ? 'bg-red-50 text-cs-red'
                : 'bg-zinc-100 text-zinc-700'
          }`}
        >
          {isConfirmed ? (
            <CheckCircle2 className="size-6" />
          ) : isRejected ? (
            <XCircle className="size-6" />
          ) : (
            <Clock className="size-6" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-zinc-900">
            {isConfirmed
              ? 'ظرفیت اتاق تایید شد'
              : isRejected
                ? 'ظرفیت اتاق تایید نشد'
                : 'در حال بررسی ظرفیت اتاق'}
          </h3>

          <p className="text-xs/6 font-semibold text-zinc-600">
            {isConfirmed
              ? 'ظرفیت اتاق تایید شد؛ در حال نمایش فرم مشخصات مسافران...'
              : isRejected
                ? 'متأسفانه امکان تایید ظرفیت برای این رزرو وجود ندارد. می‌توانید اتاق یا هتل دیگری را انتخاب نمایید.'
                : 'درخواست رزرو شما برای بررسی ظرفیت به تیم رزرواسیون ارسال شده است. بلافاصله پس از تایید، فرم مشخصات مسافران نمایش داده می‌شود.'}
          </p>

          {isRejected && (
            <div className="pt-2">
              <Link
                href="/hotel"
                className="inline-flex items-center justify-center rounded-cs-10 bg-zinc-100 px-6 py-2.5 text-xs font-bold text-zinc-800 transition hover:bg-zinc-200"
              >
                انتخاب هتل یا اتاق دیگر
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
