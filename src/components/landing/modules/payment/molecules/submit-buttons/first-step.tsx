'use client';

import { CSSVars } from '@/types/landing';
import { ArrowLeft } from 'iconsax-react';

import { usePaymentLoading } from '@/context';
import loader from '@/styles/loader.module.css';
import { useSearchParams } from 'next/navigation';
import { payment } from '../../helpers/constant';
import { useReservationStatus } from '../../helpers/useReservationStatus';

// ------------------------------

export function FirstStepSubmitButton() {
  const { isLoading } = usePaymentLoading();
  const searchParams = useSearchParams();
  const trackingCode = searchParams.get(payment.reservationId);
  const { status: capacityStatus } = useReservationStatus(trackingCode);

  const isDisabled = isLoading || capacityStatus !== 'confirmed';

  return (
    <button
      type="submit"
      disabled={isDisabled}
      form="passengers-form"
      className="w-full h-12 bg-cs-dark-blue rounded-cs-10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <div className="full-size flex-center">
          <div
            className={loader.dots}
            style={{ '--dots-color': '#fff' } as CSSVars}
          />
        </div>
      ) : (
        <span className="text-zinc-100 text-cs85 font-semibold flex-center gap-2">
          تایید و ادامه فرآیند
          <ArrowLeft size={18} color="#fff" />
        </span>
      )}
    </button>
  );
}
