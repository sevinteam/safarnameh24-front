'use client';

import { useEffect, useState } from 'react';
import { payment } from '../helpers/constant';
import { axiosInstance } from '@/utils/axios';

import loader from '@/styles/loader.module.css';
import { useQuery } from '@tanstack/react-query';

import { usePathname, useSearchParams } from 'next/navigation';
import { useReservationStatus } from '../helpers/useReservationStatus';

type ApiResponse = { data: { description: string } };

// ------------------------------

export function Description() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [value, setValue] = useState('');
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  const trackingCode = searchParams.get(payment.reservationId);
  const { status: capacityStatus } = useReservationStatus(trackingCode);
  const isLocked =
    pathname !== '/payment/complete-passengers-information' ||
    capacityStatus !== 'confirmed';

  const { data, status } = useQuery<ApiResponse>({
    queryKey: ['reservation-description', trackingCode],
    enabled: Boolean(trackingCode),
    queryFn: () =>
      axiosInstance(`/hotel/reservation/description/${trackingCode}/`),
  });

  // === Restore from Session-Storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem(payment.descriptionKey);
      if (saved) setValue(saved);
      setHasLoadedStorage(true);
    }
  }, []);

  // === Updating Value based-on server data
  useEffect(() => {
    const description = data?.data.description;
    if (description) setValue(description);
  }, [data]);

  // === Persist to Session-Storage only after initial restore
  useEffect(() => {
    if (typeof window !== 'undefined' && hasLoadedStorage) {
      sessionStorage.setItem(payment.descriptionKey, value);
    }
  }, [value, hasLoadedStorage]);

  return (
    <div className="relative grid gap-3 overflow-hidden rounded-xl border bg-white p-5 pt-4">
      <div className="flex items-center gap-2">
        <span className="text-cs85 font-bold">توضیحات :</span>
        <span className="rounded-md bg-zinc-100 px-2 py-0.5 pt-1 text-cs07 font-semibold text-zinc-500">
          * اختیاری
        </span>
      </div>

      {status === 'pending' && (
        <div className="flex-center absolute left-0.5 top-0.5">
          <span className={loader.spinner} style={{ scale: '0.35' }} />
        </div>
      )}

      <textarea
        value={value}
        name="description"
        onChange={(e) => setValue(e.target.value)}
        placeholder="توضیحات تکمیلی خود را وارد نمایید ..."
        readOnly={isLocked}
        disabled={isLocked}
        className="custom-scrollbar h-14 resize-none text-cs08/5 font-semibold text-zinc-500 outline-none disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}
