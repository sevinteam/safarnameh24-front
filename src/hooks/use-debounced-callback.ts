'use client';

import { useCallback, useEffect, useRef } from 'react';

// ------------------------------

export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 350,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Always keep the latest callback reference without resetting the timer
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Cleanup pending timer on unmount
  useEffect(() => cancel, [cancel]);

  const debouncedFn = useCallback(
    (...args: TArgs) => {
      cancel();
      timerRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [cancel, delay],
  );

  return {
    debouncedFn,
    cancel,
  };
}
