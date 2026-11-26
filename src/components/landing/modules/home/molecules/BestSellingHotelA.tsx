import Image from 'next/image';
import { Hotel } from '@/types';
import { numberSeparation } from '@/utils';
import { ICStar } from '@/components/icons';
import Link from 'next/link';

type Props = { hotel: Hotel & { reservation_count: number } };

// -------------------------

function hasLastMinuteDiscount(hotel: Hotel): boolean {
  const h = hotel as any;
  return Boolean(
    h?.is_last_minute_active ||
      h?.has_last_minute ||
      h?.is_last_minute ||
      h?.has_hotel_last_minute ||
      Number(h?.last_minute_discount_percent ?? 0) > 0 ||
      Number(h?.last_minute_discount ?? 0) > 0,
  );
}

export default function BestSellingHotelA(props: Props) {
  const {
    hotel: {
      city,
      name,
      slug,
      stars,
      rating,
      main_image,
      total_price,
      average_score,
      reservation_count,
    },
  } = props;

  const citySlug =
    (city as { slug?: string } | undefined)?.slug ||
    (props.hotel as any)?.city_slug ||
    'iran';

  const isLastMinute = hasLastMinuteDiscount(props.hotel);

  return (
    <Link
      href={`/hotel/${encodeURIComponent(citySlug)}/${slug}`}
      className="relative bg-white p-5 flex gap-4 rounded-xl shadow-[0_0.5rem_1rem_rgba(0,0,0,0.02)] xl:p-4"
    >
      {/* Image */}
      <div className="bg-zinc-100 w-32 h-40 hidden overflow-hidden rounded-cs-10 xl:block xl:h-32 xl:rounded-xl">
        {main_image && (
          <Image
            width={300}
            height={300}
            src={main_image}
            alt={'hotel-picture'}
            className="full-size object-cover"
          />
        )}
      </div>

      {/* Hotel-Details */}
      <div className="text-zinc-800 text-cs08 font-bold flex-1 flex flex-col gap-2 overflow-hidden xl:pt-3 xl:pb-0 xl:pl-2">
        {/* Hotel-Name */}
        <h3 className="text-cs09 font-extrabold flex items-center gap-1">
          <span>هتل</span>
          <span className="truncate flex-1 xl:max-w-40">{name}</span>
        </h3>

        {/* Province | City | Stars */}
        <div className="text-zinc-500 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span>استان</span>

            <div className="flex-center gap-0.5">
              <span className="max-w-20 truncate">{city.province}</span>
              <span>,</span>
              <span className="max-w-20 truncate xl:max-w-16">{city.name}</span>
            </div>
          </div>

          <div className="bg-zinc-300 w-[2px] h-3 rounded"></div>

          <div className="flex items-center gap-1">
            <span>{stars}</span>
            <span>ستاره</span>
          </div>
        </div>

        {/* Hotel-Rating (Small-Device) */}
        <div className="w-max h-7 bg-[#4B5BCE]/10 text-[#4B5BCE] text-cs75 px-3 mt-1 mb-2 flex items-center gap-1.5 rounded-md xl:hidden">
          <ICStar className="w-3.5 h-3.5" fill="#4B5BCE" />
          <span className="font-bold pt-0.5">
            {average_score > 1 ? average_score : rating}
          </span>
        </div>

        {/* Hotel-Price */}
        <div className="relative flex-between items-center gap-2 mt-auto pt-4">
          {isLastMinute && (
            <div className="absolute -top-4 right-0 z-10 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-2.5 py-0.5 text-[11px] font-black text-white shadow-md shadow-rose-600/35 backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
                <span className="relative inline-flex size-2 rounded-full bg-white" />
              </span>
              <span>لحظه آخری</span>
            </div>
          )}

          {Number(reservation_count) > 0 && (
            <div className="absolute -top-4 left-0 text-cs07 text-zinc-500 font-bold flex-center gap-1">
              <span>بیش از</span>
              <span>{reservation_count}</span>
              <span>رزرو</span>
            </div>
          )}

          <span>شروع قیمت اتاق :</span>

          <div className="text-cs85 font-extrabold flex items-center gap-1">
            <span>{numberSeparation(total_price)}</span>
            <span>تومان</span>
          </div>
        </div>
      </div>

      {/* Hotel-Rating (Large-Device) */}
      <div className="absolute top-0 left-5 w-9 h-12 bg-[#4B5BCE] text-zinc-100 text-cs75 place-items-center hidden rounded-b-full xl:grid">
        <span className="font-bold">{rating}</span>
        <ICStar className="w-3.5 h-3.5 -mt-4" fill="#f4f4f5" />
      </div>
    </Link>
  );
}