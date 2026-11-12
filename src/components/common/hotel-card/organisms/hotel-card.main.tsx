import Link from 'next/link';
import Image from 'next/image';

import { MapPin, Star } from 'lucide-react';

import { cn, formatNumber, getRatingTier } from '@/lib/utils';
import hotel_image from '@/assets/images/background/hero-3.jpg';
import { HotelCard as HotelCardProps } from '@/lib/types/hotel';

type Props = HotelCardProps & {
  className?: string;
};

// ------------------------------

export function HotelCard(props: Props) {
  const {
    address,
    city,
    city_slug,
    country_slug,
    hotel_slug,
    originalPrice,
    image,
    name,
    rating,
    reviewCount,
    stars,
    className,
    discountPercentage,
    price,
  } = props;

  const { label, badgeClass } = getRatingTier(rating);

  return (
    <Link
      href={`/hotel/${country_slug}/${city_slug}/${hotel_slug}`}
      className={cn(
        'bg-card flex h-93 flex-col overflow-hidden rounded-2xl border',
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden border-b">
        {/* Hotel-Image */}
        <Image fill src={hotel_image} alt="" className="z-10 object-cover" />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Hotel-Name */}
        <p
          title={`هتل ${name} ${city}`}
          className="text-95 line-clamp-1 font-bold"
        >{`هتل ${name} ${city}`}</p>

        {/* Address */}
        <div
          title={`${city}, ${address}`}
          className="text-muted-foreground my-4 flex items-center gap-1"
        >
          <MapPin className="size-4 shrink-0" />
          <p className="text-08 line-clamp-1 font-medium">{`${city}, ${address}`}</p>
        </div>

        <div className="flex-between items-center">
          {/* Icon-Text / Rating / Review-Count */}
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className={cn('rounded-sm px-1.5 py-0.5', badgeClass)}>
              {label}
            </span>

            <span>10 / {rating}</span>

            <span className="text-muted-foreground">{`(${reviewCount} دیدگاه)`}</span>
          </div>

          {/* Stars */}
          {stars && stars > 0 && (
            <div className="flex items-center gap-0.5">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} className="size-3 fill-current text-amber-500" />
              ))}
            </div>
          )}
        </div>

        <div className="flex-between text-muted-foreground text-08 relative mt-auto items-center border-t border-dashed pt-5 font-semibold">
          <span>شروع قیمت :</span>

          {/* Original-Price (line-through) */}
          {discountPercentage && discountPercentage > 0 && (
            <div className="bg-card absolute -top-2.5 left-0 flex items-center gap-2 ps-2">
              <span className="text-muted-foreground text-08 line-through">
                {formatNumber(originalPrice)}
              </span>

              <span className="rounded-sm bg-red-500 px-1.5 py-0.5 text-xs text-white">
                %{discountPercentage}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-1">
            <span className="text-primary text-95 font-bold">
              {formatNumber(price)}
            </span>

            <span className="text-primary">تومان</span>
            <span>/ 1 شب</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
