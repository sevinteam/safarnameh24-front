'use client';

import moment from 'jalali-moment';
import { InfoCircle } from 'iconsax-react';

import { numberSeparation } from '@/utils';
import { Room } from '@/types/landing';
import { SecondaryInfo } from './atoms/SecondaryInfo';

import ReserveButton from './atoms/ReserveButton';
import { DeadlineTimer } from './atoms/DeadlineTimer';
import NormalPrimaryInfo from './atoms/NormalPrimaryInfo';
import { useState } from 'react';
import RoomNumber from './atoms/RoomNumber';

type Props = {
  room: Room & {
    can_book?: boolean;
    is_available?: boolean;
    availability_status?: 'open' | 'close';
    is_last_minute?: boolean;
    price?: any;
  };
  checkAuth: () => boolean;
};

export const MIN = 1;
export const MAX = 10;

// -------------------------------------

export default function NormalRoom(props: Props) {
  const {
    room: {
      hotel,
      id,
      name,
      price,
      capacity,
      room_number,
      descriptions,
      room_services,
      extra_capacity,
      customer_club_points,
      can_book,
      is_available,
    },
    checkAuth,
  } = props;

  // بررسی وضعیت لحظه آخری بودن اتاق
  const isLastMinute = Boolean(
    props.room?.is_last_minute || (price as any)?.is_last_minute,
  );

  // محاسبه قیمت اصلی و قیمت پس از تخفیف برای نمایش صحیح
  const discountPct = Number(price?.discount_percentage || 0);
  const rawTotalPrice = Number(price?.total_price || 0);
  const rawDiscountedPrice = Number(price?.total_price_discount || 0);

  const hasDiscount = Boolean(
    discountPct > 0 &&
      rawDiscountedPrice > 0 &&
      rawTotalPrice > rawDiscountedPrice,
  );

  const finalPayablePrice = hasDiscount ? rawDiscountedPrice : rawTotalPrice;
  const originalStrikethroughPrice = rawTotalPrice;

  // آماده‌سازی دیتای اصلاح‌شده برای پاس دادن به NormalPrimaryInfo
  const modifiedRoom = {
    ...props.room,
    price: {
      ...price,
      total_price: finalPayablePrice,
      original_total_price: originalStrikethroughPrice,
      original_price: originalStrikethroughPrice,
      total_price_discount: finalPayablePrice,
      discount_amount: hasDiscount ? originalStrikethroughPrice - finalPayablePrice : 0,
    },
  };

  const canBook = can_book !== false && is_available !== false;
  const [counter, setCounter] = useState(1);

  const formattedDeadline = price?.discount_date
    ? moment.from(price.discount_date, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD')
    : null;

  function handleChangeCounter(type: 'inc' | 'dec') {
    if (!canBook) return;

    if (type === 'inc') {
      counter < MAX && setCounter((prev) => prev + 1);
    } else {
      counter > MIN && setCounter((prev) => prev - 1);
    }
  }

  return (
    <div
      className={`grid overflow-hidden rounded-xl border transition-all duration-300 lg:grid-cols-[1fr_17rem] lg:rounded-2xl ${
        isLastMinute
          ? 'border-2 border-rose-300 bg-gradient-to-l from-rose-50/40 via-white to-white shadow-[0_0.5rem_1.5rem_rgba(225,29,72,0.06)]'
          : 'border-zinc-200 bg-white shadow-[0_0.5rem_1.5rem_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="relative gap-3 overflow-hidden p-4 text-[clamp(0.8rem,3vw,0.85rem)] font-semibold text-zinc-800 lg:flex lg:border-l lg:p-5">
        <div className="lg:mt-0 lg:flex lg:flex-1 lg:flex-col">
          
          {/* نشان لحظه آخری: بدون بک‌گراند، بدون بج درصد، فقط چراغ چشمک‌زن و متن */}
          {isLastMinute ? (
            <div className="mb-2.5 flex items-center gap-2 text-xs font-black text-[#e11d48]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#e11d48] animate-pulse" />
              <span>پیشنهاد لحظه آخری</span>
            </div>
          ) : null}

          {/* نام اتاق */}
          <div className="text-[clamp(0.85rem,3vw,0.95rem)] font-extrabold text-zinc-900">
            {name}
          </div>

          {/* توضیحات اتاق با فاصله استاندارد */}
          {descriptions ? (
            <div className="mt-3 text-cs08 text-zinc-500 leading-relaxed lg:line-clamp-2">
              {descriptions}
            </div>
          ) : null}

          <div className="mt-4 flex items-end gap-4 lg:mt-auto">
            <SecondaryInfo
              info={{
                capacity,
                services: room_services,
                extraCapacity: extra_capacity,
                customerClub: customer_club_points,
              }}
            />

            <div className="mr-auto hidden lg:block">
              <RoomNumber
                counter={counter}
                handleChangeCounter={handleChangeCounter}
                disabled={{
                  increase:
                    !canBook ||
                    (room_number < MAX ? counter >= room_number : counter >= MAX),
                  decrease: !canBook || counter <= MIN,
                }}
              />
            </div>
          </div>

          {/* باکس تخفیف ثابت و تایمر بازه (در صورت لحظه آخری، تایمر ۴ تایی خاکستری حذف می‌شود) */}
          {canBook && (price?.is_fixed_discount_one_time || (!isLastMinute && price?.discount_date)) ? (
            <div className="absolute left-5 top-5 hidden h-10 xl:flex">
              {price?.is_fixed_discount_one_time ? (
                <div className="text-zinc-800 flex-center gap-1 rounded-lg bg-zinc-100 px-4 text-cs08 font-bold">
                  <button className="group relative ml-1 rounded-full" type="button">
                    <InfoCircle size={16} color="#666" />
                    <span className="invisible absolute -right-4 top-8 w-60 rounded-cs-10 bg-cs-dark-blue px-3 py-2 text-right text-cs75/5 font-medium text-zinc-100 opacity-0 transition-all ease-in-out group-hover:visible group-hover:top-9 group-hover:opacity-100 lg:w-52">
                      این مبلغ در مرحله پرداخت از مجموع قیمت فاکتور شما کسر میگردد
                    </span>
                  </button>
                  <span>{numberSeparation(price.discount_amount)}</span>
                  <span>تومن تخفیف هنگام خرید</span>
                </div>
              ) : null}

              {!isLastMinute && price?.discount_percentage && formattedDeadline ? (
                <div className="grid w-48">
                  <DeadlineTimer date={formattedDeadline} />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <NormalPrimaryInfo
        room={modifiedRoom}
        counter={counter}
        handleChangeCounter={handleChangeCounter}
        canBook={canBook}
      >
        {/* دکمه رزرو: برای لحظه آخری قرمز جذاب و برای عادی مشکی می‌ماند */}
        <div
          className={
            isLastMinute
              ? 'contents [&_button]:!bg-[#e11d48] [&_button]:!text-white hover:[&_button]:!bg-[#be123c] [&_button]:!shadow-md [&_button]:!shadow-rose-500/30'
              : 'contents'
          }
        >
          <ReserveButton
            roomId={id}
            hotelId={hotel}
            roomNumber={counter}
            canBook={canBook}
            checkAuth={checkAuth}
          />
        </div>
      </NormalPrimaryInfo>
    </div>
  );
}