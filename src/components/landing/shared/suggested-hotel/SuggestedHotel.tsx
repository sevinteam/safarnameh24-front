'use client';

import Link from 'next/link';
import Image from 'next/image';
import moment from 'jalali-moment';
import { usePathname } from 'next/navigation';

import { Hotel } from '@/types';
import { numberSeparation } from '@/utils';
import DiscountPercentage from './DiscountPercentage';
import { DynamicSuggestedHotelTimer } from './SuggestedHotelTimer';
import { useState } from 'react';

type Props = {
  hotel: Hotel & {
    price_info?: {
      total_price?: number;
      original_total_price?: number;
      discount_value?: number;
      discount_date?: string;
      discount_type?: string;
    };
  };
  showTimer?: boolean;
  showDiscount?: boolean;
  bestType?: 'suggested' | 'amazing';
};

// -----------------------------------------------

export function SuggestedHotel(props: Props) {
  const {
    hotel,
    bestType,
    showTimer = true,
    showDiscount = true,
  } = props;

  const {
    city,
    name,
    slug,
    stars,
    rating,
    main_image,
    average_score,
  } = hotel;

  // تشخیص اینکه آیا هتل تخفیف لحظه آخری دارد یا خیر
  const isLastMinute = Boolean(
    (hotel as any)?.is_last_minute_active ||
      (hotel as any)?.has_last_minute ||
      (hotel as any)?.is_last_minute ||
      (hotel as any)?.has_hotel_last_minute ||
      Number((hotel as any)?.last_minute_discount_percent ?? 0) > 0 ||
      Number((hotel as any)?.last_minute_discount ?? 0) > 0
  );

  // قیمت نهایی بعد از تخفیف
  const finalPrice =
    hotel.price_info?.total_price ??
    (hotel as any).total_price ??
    (hotel as any).min_price ??
    0;

  // درصد تخفیف
  const effectiveDiscountPercentage =
    hotel.price_info?.discount_value ??
    (hotel as any).discount_percentage ??
    0;

  // تاریخ انقضای تخفیف برای تایمر
  const effectiveDiscountExpiry =
    hotel.price_info?.discount_date ??
    (hotel as any).discount_expiry;

  const [isClicked, setClicked] = useState(false);

  const pathname = usePathname();
  const formattedDeadline =
    effectiveDiscountExpiry &&
    moment.from(effectiveDiscountExpiry, 'fa', 'jYYYY/jMM/jDD').format('YYYY-MM-DD');

  return (
    <div className="rounded-xl bg-white p-2 shadow-[0_0.5rem_1rem_rgba(0,0,0,0.02)]">
      {/* Image | Discount-Percentage | Timer */}
      <div className="relative h-44 overflow-hidden rounded-cs-10 bg-zinc-100">
        {main_image && (
          <Image
            alt="hotel"
            width={300}
            height={300}
            src={main_image}
            className="full-size object-cover"
          />
        )}

        {pathname === '/hotel' && (
          <div className="absolute left-2.5 top-2.5 rounded-md bg-cs-blue px-3 py-1 text-cs07/5 font-medium text-white">
            {bestType === 'suggested' ? 'پیشنهادی' : 'شگفت انگیز'}
          </div>
        )}

        {/* 
            اگر تخفیف لحظه آخری باشد (isLastMinute)، درصد تخفیف مخفی می‌شود
            و درصد فقط برای تخفیف‌های درصدی معمولی یا تایمردار نمایش داده می‌شود 
        */}
        {showDiscount && !isLastMinute && effectiveDiscountPercentage > 0 && (
          <DiscountPercentage discountPercentage={effectiveDiscountPercentage} />
        )}

        {/* تایمر تخفیف (در صورت وجود تاریخ انقضا و اگر نیاز باشد) */}
        {showTimer && formattedDeadline && !isLastMinute && (
          <DynamicSuggestedHotelTimer timer={formattedDeadline} />
        )}
      </div>

      {/* Hotel-Information */}
      <div className="mt-2.5 flex flex-col gap-2 p-1.5 pb-1 text-cs08 font-bold text-zinc-800">
        {/* Hotel-Name */}
        <h3 className="mb-1 flex items-center gap-1 text-cs09 font-extrabold">
          <span>هتل</span>
          <span>{name}</span>
        </h3>

        {/* Province | City | Stars */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span>استان</span>

            <div className="flex-center gap-0.5">
              <span>{city?.province}</span>
              <span>,</span>
              <span>{city?.name}</span>
            </div>
          </div>

          <div className="h-3 w-[2px] rounded bg-zinc-500"></div>

          <div className="flex items-center gap-1">
            <span>{stars}</span>
            <span>ستاره</span>
          </div>
        </div>

        {/* Hotel-Rating */}
        <div className="flex-between items-center">
          <span>امتیاز هتل :</span>

          <div className="flex items-center gap-1 font-bold">
            {average_score > 1 ? average_score : rating}
            <span>امتیاز</span>
          </div>
        </div>

        {/* Hotel-Price */}
        <div className="flex-between items-center">
          <span>شروع قیمت اتاق :</span>

          <div className="flex items-center gap-1 font-bold">
            <span>{finalPrice ? numberSeparation(finalPrice) : 0}</span>
            <span>تومان</span>
          </div>
        </div>

        {/* Hotel-Reservation */}
        <Link
          href={`/hotel/${slug}`}
          onClick={() => setClicked(true)}
          className="flex-center mt-2 h-10 rounded-[11px] bg-cs-dark-blue text-zinc-100 transition-colors duration-200 ease-in-out hover:text-zinc-100"
        >
          {isClicked ? (
            <div className="loader-dots" />
          ) : (
            <span>مشاهده هتل</span>
          )}
        </Link>
      </div>
    </div>
  );
}