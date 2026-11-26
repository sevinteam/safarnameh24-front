'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { ClipboardCheck, Pencil } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import {
  Description,
  PaymentInvoice,
  WalletWithdraw,
  ReservationInfo,
  ApplyDiscountCode,
  CheckReservationInfo,
} from '@/components/landing/modules/payment/organisms';
import { ThirdStepSubmitButton as SubmitButton } from '@/components/landing/modules/payment/molecules/submit-buttons';
import { useMediaQuery } from '@/hooks';
import { payment } from '../helpers/constant';

// ------------------------------

export function ConfirmInformationWrapper() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get(payment.reservationId);

  const editHref = trackingCode
    ? `/payment/complete-passengers-information?${payment.reservationId}=${trackingCode}`
    : '/payment/complete-passengers-information';

  // === Scroll To Top On Mount
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const ReviewHeaderCard = (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cs-dark-blue/10 text-cs-dark-blue">
          <ClipboardCheck className="size-5" />
        </div>

        <div className="space-y-1">
          <h2 className="text-cs85 font-extrabold text-zinc-800">
            بررسی و تایید نهایی مشخصات مسافران
          </h2>
          <p className="text-cs08/5 font-semibold text-zinc-500">
            لطفاً اطلاعات واردشده مسافران و جزئیات صورتحساب را بررسی کنید و در صورت صحت، روی دکمه تایید و پرداخت کلیک نمایید.
          </p>
        </div>
      </div>

      <Link
        href={editHref}
        scroll={false}
        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2.5 text-cs08 font-bold text-zinc-700 transition-colors hover:bg-zinc-200/80"
      >
        <Pencil className="size-3.5" />
        <span>ویرایش اطلاعات مسافران</span>
      </Link>
    </div>
  );

  return (
    <>
      {/* === Small-Screen */}
      <div className="space-y-6 lg:hidden">
        {ReviewHeaderCard}
        <CheckReservationInfo />
        <ReservationInfo />
        {!isDesktop && <Description />}
        {!isDesktop && <ApplyDiscountCode />}
        {!isDesktop && <WalletWithdraw />}
        <PaymentInvoice />
        <SubmitButton />
      </div>

      {/* === Large-Screen */}
      <div className="hidden grid-cols-[1fr_2.8fr] items-start gap-x-6 lg:grid">
        {/* --- Right-Column */}
        <div className="sticky top-[6.4rem] space-y-6">
          <CheckReservationInfo />
          {isDesktop && <ApplyDiscountCode />}
          {isDesktop && <WalletWithdraw />}
          <PaymentInvoice />
          <SubmitButton />
        </div>

        {/* --- Left-Column */}
        <div className="space-y-6">
          {ReviewHeaderCard}
          <ReservationInfo />
          {isDesktop && <Description />}
        </div>
      </div>
    </>
  );
}
