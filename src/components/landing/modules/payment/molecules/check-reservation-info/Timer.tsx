'use client';

import { useMemo } from 'react';
import Countdown from 'react-countdown';

type Props = {
  seconds: number | null;
};

// ------------------------------

export function TimerDisplay(props: Props) {
  const { seconds } = props;

  const endTime = useMemo(() => {
    if (seconds === null || seconds === undefined || seconds < 0) return null;
    return Date.now() + seconds * 1000;
  }, [seconds]);

  if (endTime === null) return null;

  return (
    <Countdown
      key={endTime}
      date={endTime}
      renderer={({ minutes, seconds: remainingSeconds }) => {
        return (
          <div className="flex-between items-center">
            <span>زمان باقی مانده :</span>

            <div className="flex h-9 items-center gap-2 font-bold">
              <span className="flex-center aspect-square h-full rounded-md border">
                {String(remainingSeconds).padStart(2, '0')}
              </span>

              <span>:</span>

              <span className="flex-center aspect-square h-full rounded-md border">
                {String(minutes).padStart(2, '0')}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
