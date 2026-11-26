import Link from 'next/link';
import Image from 'next/image';
import { Hotel } from '@/types';
import { numberSeparation } from '@/utils';

type Props = { hotel: Hotel & { reservation_count: number } };

// -----------------------------------------------

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

export default function BestSellingHotelB(props: Props) {
  const {
    hotel: {
      city,
      name,
      slug,
      stars,
      main_image,
      total_price,
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
      className="relative bg-white h-[21rem] p-3 flex flex-col gap-3 rounded-2xl shadow-[0_0.5rem_1rem_rgba(0,0,0,0.02)]"
    >
      {/* Image */}
      <div className="relative bg-zinc-100 h-[11.5rem] overflow-hidden rounded-xl">
        {main_image && (
          <Image
            src={main_image}
            width={400}
            height={200}
            alt={'hotel-picture'}
            className="full-size object-cover"
          />
        )}

        {isLastMinute && (
          <div className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-red-600 px-3 py-1 text-xs font-black text-white shadow-lg shadow-rose-600/35 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-80" />
              <span className="relative inline-flex size-2 rounded-full bg-white" />
            </span>
            <span>لحظه آخری</span>
          </div>
        )}
      </div>

      {/* Hotel-Details */}
      <div className="text-zinc-800 text-cs85 font-bold p-1 px-2 flex-1 flex flex-col gap-2">
        {/* Hotel-Name */}
        <h3 className="text-cs95 font-extrabold flex items-center gap-1">
          <span>هتل</span>
          <span className="truncate">{name}</span>
        </h3>

        {/* Province | City | Stars */}
        <div className="text-zinc-500 flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span>استان</span>

            <div className="flex-center gap-0.5">
              <span className="max-w-28 truncate">{city.province}</span>
              <span>,</span>
              <span className="max-w-28 truncate">{city.name}</span>
            </div>
          </div>

          <div className="bg-zinc-300 w-[2px] h-3 rounded"></div>

          <div className="flex items-center gap-1">
            <span>{stars}</span>
            <span>ستاره</span>
          </div>
        </div>

        {/* Hotel-Price */}
        <div className="relative flex-between items-center gap-2 mt-auto">
          {Number(reservation_count) > 0 && (
            <div className="absolute -top-6 left-0 text-cs07 text-zinc-500 font-bold flex-center gap-1">
              <span>بیش از</span>
              <span>{reservation_count}</span>
              <span>رزرو</span>
            </div>
          )}

          <span>شروع قیمت اتاق :</span>

          <div className="text-cs09 font-extrabold flex items-center gap-1">
            <span>{numberSeparation(total_price)}</span>
            <span>تومان</span>
          </div>
        </div>
      </div>
    </Link>
  );
}