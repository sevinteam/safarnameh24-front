'use client';

import { useState } from 'react';
import {
  HiStar,
  HiPlusCircle,
  HiMinusCircle,
  HiCheckCircle,
} from 'react-icons/hi2';
import { HotelCustomerReview } from '@/types';

type Props = {
  reviews: HotelCustomerReview[];
};

function getEmojiConfig(
  stars: number,
  id: number,
  moreWeaknesses: boolean,
): { emoji: string; bg: string } {
  const idx = (id || 1) % 2;
  if (stars >= 5) {
    return idx === 0
      ? { emoji: '😍', bg: 'bg-rose-100' }
      : { emoji: '❤️', bg: 'bg-red-100' };
  }
  if (stars === 4) {
    return idx === 0
      ? { emoji: '☺️', bg: 'bg-emerald-100' }
      : { emoji: '👍', bg: 'bg-sky-100' };
  }
  if (stars === 3) {
    return moreWeaknesses
      ? { emoji: '😕', bg: 'bg-amber-100' }
      : { emoji: '☺️', bg: 'bg-yellow-100' };
  }
  return { emoji: '😕', bg: 'bg-slate-200' };
}

function ReviewAvatar({ review }: { review: any }) {
  const [imgError, setImgError] = useState(false);

  const stars = Number(review?.stars ?? 5);
  const strengthsCount = Array.isArray(review?.strengths)
    ? review.strengths.length
    : 0;
  const weaknessesCount = Array.isArray(review?.weaknesses)
    ? review.weaknesses.length
    : 0;

  const { emoji, bg } = getEmojiConfig(
    stars,
    Number(review?.id ?? 1),
    weaknessesCount > strengthsCount,
  );

  const showImage = Boolean(review?.user_image) && !imgError;

  return (
    <div className="relative shrink-0">
      {showImage ? (
        <img
          src={review.user_image}
          alt="avatar"
          onError={() => setImgError(true)}
          className="size-12 rounded-full border border-gray-100 object-cover"
        />
      ) : (
        <div
          className={`flex size-12 items-center justify-center rounded-full border border-white text-2xl shadow-xs ${bg}`}
        >
          <span role="img" aria-label="avatar">
            {emoji}
          </span>
        </div>
      )}

      {/* تیک سبز تایید کنار آواتار مثل طرح نمونه */}
      <HiCheckCircle className="absolute -bottom-0.5 -left-0.5 size-4 rounded-full bg-white text-emerald-500" />
    </div>
  );
}

export default function Reviews({ reviews }: Props) {
  return (
    <div className="relative flex max-h-[30rem] flex-col gap-4 overflow-y-auto pl-2 lg:h-[30rem] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1.5">
      {reviews.map((item: any) => {
        const fullName =
          `${item?.first_name || ''} ${item?.last_name || ''}`.trim() ||
          'مسافر زروان تریپ';
        const strengths = Array.isArray(item?.strengths) ? item.strengths : [];
        const weaknesses = Array.isArray(item?.weaknesses)
          ? item.weaknesses
          : [];

        return (
          <div
            key={item.id}
            className="shrink-0 rounded-2xl border border-gray-200/80 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            {/* هدر کارت نظر */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* سمت راست: آواتار + نام + تاریخ */}
              <div className="flex items-center gap-3">
                <ReviewAvatar review={item} />

                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-gray-800 lg:text-base">
                    {fullName}
                  </span>
                  {item?.created_date && (
                    <span className="text-xs text-gray-400">
                      تاریخ نظر دهی : {item.created_date}
                    </span>
                  )}
                </div>
              </div>

              {/* سمت چپ: ساعت + امتیاز */}
              <div className="flex items-center gap-2">
                {item?.created_time && (
                  <span className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white">
                    ساعت {item.created_time}
                  </span>
                )}

                <span className="flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white">
                  <HiStar className="size-3.5" />
                  <span>{item?.stars ?? 5}</span>
                </span>
              </div>
            </div>

            {/* متن نظر */}
            {item?.text && (
              <p className="mt-4 text-sm leading-7 text-gray-600">
                {item.text}
              </p>
            )}

            {/* نقاط قوت و ضعف */}
            {(strengths.length > 0 || weaknesses.length > 0) && (
              <div className="mt-4 flex flex-col gap-2 border-t border-dashed border-gray-100 pt-3">
                {strengths.map((s: any, idx: number) => (
                  <div
                    key={s?.id ?? `str-${idx}`}
                    className="flex items-center gap-2 text-xs font-medium text-gray-700 lg:text-sm"
                  >
                    <HiPlusCircle className="size-4 shrink-0 text-emerald-500" />
                    <span>{typeof s === 'string' ? s : s?.title}</span>
                  </div>
                ))}

                {weaknesses.map((w: any, idx: number) => (
                  <div
                    key={w?.id ?? `weak-${idx}`}
                    className="flex items-center gap-2 text-xs font-medium text-gray-700 lg:text-sm"
                  >
                    <HiMinusCircle className="size-4 shrink-0 text-rose-500" />
                    <span>{typeof w === 'string' ? w : w?.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}