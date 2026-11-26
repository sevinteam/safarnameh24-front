'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

type ReservationStatus = {
  timer: number | null;
  capacity_status: 'pending' | 'confirmed' | 'rejected' | 'initial';
};

const INITIAL_STATUS: ReservationStatus = {
  timer: null,
  capacity_status: 'initial',
};

export function useReservationStatus(trackingCode: string | null) {
  const queryClient = useQueryClient();

  const { data } = useQuery<ReservationStatus>({
    queryKey: ['reservation-status', trackingCode],
    queryFn: () =>
      queryClient.getQueryData<ReservationStatus>([
        'reservation-status',
        trackingCode,
      ]) ?? INITIAL_STATUS,
    initialData: INITIAL_STATUS,
    enabled: false,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    status: data.capacity_status,
    timer: data.timer,
  };
}
