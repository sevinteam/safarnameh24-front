'use client';

import { useEffect, useMemo, useState } from 'react';
import RoomsArea from './RoomsArea';
import { TopBarConfig } from '@/components/landing/shared';
import { DDatePicker } from '@/components/landing/shared/search/date-picker';
import NumberOfNights from '@/components/landing/shared/search/NumberOfNights';
// import Passengers from '@/components/landing/shared/search/passengers/Passengers';

type Props = {
  data?: any;
  status: 'success' | 'pending' | 'error';
};

// تبدیل اعداد انگلیسی به فارسی
const toPersianDigits = (val: number | string) =>
  String(val)
    .padStart(2, '0')
    .replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

// ------------------------------

export function RoomsContent(props: Props) {
  const { data, status } = props;

  // ۱. بررسی وضعیت لحظه آخری (اگر حداقل یک اتاق لحظه آخری باشد بنر بالا روشن می‌شود)
  const lastMinuteInfo = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { active: false, maxDiscount: 0, minTimerSeconds: 0 };
    }

    let maxDiscount = 0;
    let minTimer = Infinity;
    let hasAnyLastMinute = false;

    for (const item of data) {
      const roomObj = item?.pack_rooms ? item.pack_rooms[0] : item;
      const isRoomLM = Boolean(
        roomObj?.is_last_minute || roomObj?.price?.is_last_minute,
      );
      const discountPct = Number(roomObj?.price?.discount_percentage || 0);
      const timerSec = Number(
        roomObj?.last_minute_timer || roomObj?.price?.last_minute_timer || 0,
      );

      if (isRoomLM && discountPct > 0 && timerSec > 0) {
        hasAnyLastMinute = true;
        maxDiscount = Math.max(maxDiscount, discountPct);
        minTimer = Math.min(minTimer, timerSec);
      }
    }

    if (hasAnyLastMinute && minTimer !== Infinity) {
      return {
        active: true,
        maxDiscount,
        minTimerSeconds: minTimer,
      };
    }

    return { active: false, maxDiscount: 0, minTimerSeconds: 0 };
  }, [data]);

  const [secondsLeft, setSecondsLeft] = useState<number>(0);

  useEffect(() => {
    setSecondsLeft(lastMinuteInfo.minTimerSeconds);
  }, [lastMinuteInfo.minTimerSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const isLastMinuteCurrentlyValid =
    lastMinuteInfo.active && secondsLeft > 0;

  // ۲. نرمال‌سازی دیتا به تفکیک هر اتاق (حفظ قیمت اصلی برای خط‌خوردگی و قیمت نهایی)
  const normalizedData = useMemo(() => {
    if (!Array.isArray(data)) return data;

    const processRoom = (r: any) => {
      if (!r?.price) return r;
      const isThisRoomLM = Boolean(
        r?.is_last_minute || r?.price?.is_last_minute,
      );

      // اگر تایمر لحظه آخری تمام شد، تخفیف لحظه آخری در فرانت ریست شود
      if (isThisRoomLM && !isLastMinuteCurrentlyValid) {
        return {
          ...r,
          is_last_minute: false,
          last_minute_timer: 0,
          price: {
            ...r.price,
            total_price: r.price.total_price,
            total_price_discount: r.price.total_price,
            discount_percentage: null,
            discount_amount: 0,
            discount_date: null,
          },
        };
      }

      return {
        ...r,
        is_last_minute: isThisRoomLM && isLastMinuteCurrentlyValid,
        price: {
          ...r.price,
          // قیمت اصلی خط‌خورده
          total_price: r.price.total_price,
          // قیمت نهایی پس از تخفیف
          total_price_discount:
            r.price.total_price_discount && r.price.total_price_discount > 0
              ? r.price.total_price_discount
              : r.price.total_price,
          // خالی کردن discount_date در حالت لحظه آخری برای حذف باکس‌های ۴ تایی داخل کارت
          discount_date: isThisRoomLM ? null : r.price.discount_date,
        },
      };
    };

    return data.map((item: any) => {
      if (item?.pack_rooms && Array.isArray(item.pack_rooms)) {
        return {
          ...item,
          pack_rooms: item.pack_rooms.map(processRoom),
        };
      }
      return processRoom(item);
    });
  }, [data, isLastMinuteCurrentlyValid]);

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <>
      <div className="flex justify-between items-center">
        <TopBarConfig title={{ type: 'single', text: 'اتاق‌ها' }} />

        {status !== 'pending' && (
          <div className="h-10 px-4 text-cs08 font-semibold bg-cs-dark-blue text-zinc-100 flex-center gap-1 rounded-lg lg:w-28 lg:h-12 lg:rounded-[10px] lg:hidden">
            <span>{data?.length}</span>
            {data?.[0]?.room_count && data?.[0]?.pack_rooms ? (
              <span>نتیجه</span>
            ) : (
              <span>اتاق</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4 lg:space-y-8">
        <div className="hidden lg:grid text-cs08 font-bold items-end grid-cols-[65%_auto] gap-4">
          {/* دو ستونه شدن نوار ورودی با حذف مسافران */}
          <div className="grid grid-cols-[1.6fr_1fr] gap-4">
            <DDatePicker sideOffset={15} triggerType="else" />
            <NumberOfNights type="else" />
            {/* <Passengers sideOffset={15} triggerType="else" /> */}
          </div>

          <div className="flex gap-4 mr-auto">
            {status !== 'pending' && (
              <div className="h-10 px-4 text-cs08 font-semibold bg-cs-dark-blue text-zinc-100 flex-center gap-1 rounded-lg lg:w-28 lg:h-12 lg:rounded-[10px]">
                <span>{data?.length}</span>
                {data?.[0]?.room_count && data?.[0]?.pack_rooms ? (
                  <span>نتیجه</span>
                ) : (
                  <span>اتاق</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* بنر و تایمر معکوس پیشنهاد لحظه آخری */}
        {status === 'success' && isLastMinuteCurrentlyValid && (
          <div
            dir="rtl"
            className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#e11d48] via-[#f43f5e] to-[#fb7185] px-4 py-3.5 text-white shadow-md transition-all duration-300 lg:px-6 lg:py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* عنوان و درصد تخفیف */}
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm shadow-inner">
                  <span className="text-lg font-black text-white">%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold tracking-tight lg:text-base">
                    پیشنهاد لحظه آخری
                  </span>
                  <span className="rounded-lg bg-white px-2.5 py-0.5 text-xs font-black text-[#e11d48] shadow-sm lg:text-sm">
                    تا {toPersianDigits(lastMinuteInfo.maxDiscount)}٪ تخفیف ویژه
                  </span>
                </div>
              </div>

              {/* باکس‌های شمارش معکوس */}
              <div className="flex items-center gap-1.5" dir="ltr">
                {days > 0 && (
                  <>
                    <div className="flex h-8 min-w-[36px] items-center justify-center rounded-lg bg-white px-2 text-xs font-extrabold text-zinc-800 shadow-sm lg:h-9 lg:min-w-[40px] lg:text-sm">
                      {toPersianDigits(days)}
                    </div>
                    <span className="text-sm font-black text-white/90">:</span>
                  </>
                )}
                <div className="flex h-8 min-w-[36px] items-center justify-center rounded-lg bg-white px-2 text-xs font-extrabold text-zinc-800 shadow-sm lg:h-9 lg:min-w-[40px] lg:text-sm">
                  {toPersianDigits(hours)}
                </div>
                <span className="text-sm font-black text-white/90">:</span>
                <div className="flex h-8 min-w-[36px] items-center justify-center rounded-lg bg-white px-2 text-xs font-extrabold text-zinc-800 shadow-sm lg:h-9 lg:min-w-[40px] lg:text-sm">
                  {toPersianDigits(minutes)}
                </div>
                <span className="text-sm font-black text-white/90">:</span>
                <div className="flex h-8 min-w-[36px] items-center justify-center rounded-lg bg-white px-2 text-xs font-extrabold text-[#e11d48] shadow-sm lg:h-9 lg:min-w-[40px] lg:text-sm">
                  {toPersianDigits(seconds)}
                </div>
              </div>
            </div>
          </div>
        )}

        <RoomsArea data={normalizedData} status={status} />
      </div>
    </>
  );
}