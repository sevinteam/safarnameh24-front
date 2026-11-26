'use client';

import { ArrowLeft } from 'iconsax-react';
import { CSSVars } from '@/types/landing';
import { usePaymentLoading } from '@/context';
import loader from '@/styles/loader.module.css';
import { payment } from '../../helpers/constant';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReservationStatus } from '../../helpers/useReservationStatus';
import { proceedToPaymentGateway } from '../../utils/handle-submission';

// ------------------------------

export function ThirdStepSubmitButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get(payment.reservationId);

  const { isLoading, handleToggleLoading } = usePaymentLoading();
  const { status: capacityStatus } = useReservationStatus(trackingCode);

  const isDisabled =
    isLoading || !trackingCode || capacityStatus !== 'confirmed';

  async function handleConfirmAndPay() {
    if (isDisabled) return;
    await proceedToPaymentGateway(
      trackingCode,
      (url) => router.push(url, { scroll: false }),
      handleToggleLoading,
    );
  }

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleConfirmAndPay}
      className="h-12 w-full rounded-cs-10 bg-cs-dark-blue transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <div className="full-size flex-center">
          <div
            className={loader.dots}
            style={{ '--dots-color': '#fff' } as CSSVars}
          />
        </div>
      ) : (
        <span className="flex-center gap-2 text-cs85 font-semibold text-zinc-100">
          تایید اطلاعات و پرداخت صورتحساب
          <ArrowLeft size={18} color="#fff" />
        </span>
      )}
    </button>
  );
}
