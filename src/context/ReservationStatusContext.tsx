'use client';

import { axiosInstance } from '@/utils/axios';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useEffect, useState } from 'react';

type ReservationStatus = {
  timer?: number;
  capacity_status: 'pending' | 'confirmed' | 'rejected' | 'initial';
};

type ReservationStatusContextType = {
  ws: WebSocket | null;
};

const ReservationStatusContext = createContext<ReservationStatusContextType>({
  ws: null,
});

export function ReservationStatusProvider({
  trackingCode,
  children,
}: {
  trackingCode: string | null;
  children: React.ReactNode;
}) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!trackingCode) return;

    let isCancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;
    let activeSocket: WebSocket | null = null;

    axiosInstance(`/hotel/reservation/form/${trackingCode}/`)
      .then((res) => {
        if (isCancelled) return;
        const capStatus = res?.data?.capacity_status;
        if (
          capStatus === 'pending' ||
          capStatus === 'confirmed' ||
          capStatus === 'rejected'
        ) {
          queryClient.setQueryData<ReservationStatus>(
            ['reservation-status', trackingCode],
            (prev) => {
              if (prev && prev.capacity_status !== 'initial') return prev;
              return {
                timer: prev?.timer ?? res?.data?.timer,
                capacity_status: capStatus,
              };
            },
          );
        }
      })
      .catch(() => {
        // WebSocket provides live updates
      });

    const connect = () => {
      if (isCancelled) return;
      const socket = new WebSocket(
        `wss://cps.zarvantrip.com/ws/${trackingCode}/`,
      );
      activeSocket = socket;
      setWs(socket);

      socket.onopen = () => {
        reconnectAttempts = 0;
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as ReservationStatus;
          queryClient.setQueryData<ReservationStatus>(
            ['reservation-status', trackingCode],
            data,
          );
        } catch (err) {
          console.error('Error parsing WebSocket data:', err);
        }
      };

      socket.onclose = () => {
        if (isCancelled) return;
        if (reconnectAttempts < 10) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
          reconnectAttempts += 1;
          reconnectTimer = setTimeout(connect, delay);
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      isCancelled = true;
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
      if (activeSocket) {
        activeSocket.close(1000, 'Provider unmounted');
      }
    };
  }, [trackingCode, queryClient]);

  return (
    <ReservationStatusContext.Provider value={{ ws }}>
      {children}
    </ReservationStatusContext.Provider>
  );
}

export function useReservationSocket() {
  return useContext(ReservationStatusContext);
}
