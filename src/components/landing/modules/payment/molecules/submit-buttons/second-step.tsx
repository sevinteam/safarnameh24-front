'use client';

import { ArrowLeft } from 'iconsax-react';
import { payment } from '../../helpers/constant';

import { useRouter, useSearchParams } from 'next/navigation';
import { useReservationStatus } from '../../helpers/useReservationStatus';

// ------------------------------

export function SecondStepSubmitButton() {
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get(payment.reservationId);

  const router = useRouter();
  const { status } = useReservationStatus(trackingCode);

  const isConfirmed = status === 'confirmed';
  const isRejected = status === 'rejected';

  function handleContinue() {
    if (!isConfirmed) return;
    const target = trackingCode
      ? `/payment/complete-passengers-information?${payment.reservationId}=${trackingCode}`
      : '/payment/complete-passengers-information';
    router.push(target, { scroll: false });
  }

  return (
    <button
      type="button"
      onClick={handleContinue}
      disabled={!isConfirmed}
      className="h-12 w-full rounded-cs-10 bg-cs-dark-blue disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex-center gap-2 text-cs85 font-semibold text-zinc-100">
        {isConfirmed
          ? 'تکمیل مشخصات مسافران'
          : isRejected
            ? 'ظرفیت اتاق تایید نشد'
            : 'در انتظار تایید ظرفیت اتاق...'}
        {isConfirmed && <ArrowLeft size={18} color="#fff" />}
      </span>
    </button>
  );
}