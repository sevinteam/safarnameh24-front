import Link from 'next/link';
import Image from 'next/image';

import { MapPin, Percent, Star } from 'lucide-react';

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

  const formattedInfo = {
    name: `هتل ${name} ${city}`,
    address: `${city}, ${address}`,
    price: formatNumber(price),
    originalPrice: formatNumber(originalPrice),
    discountExists: discountPercentage && discountPercentage > 0,
    hotelLink: `/hotel/${country_slug}/${city_slug}/${hotel_slug}`,
  };

  const { label, badgeClass } = getRatingTier(rating);

  return (
    <Link
      href={formattedInfo.hotelLink}
      className={cn(
        'bg-card flex h-94 flex-col overflow-hidden rounded-2xl border',
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden border-b">
        {/* Placeholders */}
        <div className="absolute inset-3 z-20">
          {formattedInfo.discountExists && (
            <div className="flex-center w-fit gap-1 rounded-md bg-red-500 px-2 py-1 text-white">
              <Percent className="size-3.5 stroke-3" />
              <span className="text-xs font-semibold">تخفیف</span>
            </div>
          )}
        </div>

        {/* Hotel-Image */}
        <Image
          fill
          src={hotel_image}
          alt={formattedInfo.name}
          className="z-10 object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* Hotel-Name */}
        <p
          title={formattedInfo.name}
          className="text-95 line-clamp-1 font-bold"
        >
          {formattedInfo.name}
        </p>

        <div className="flex-between my-4 items-center">
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

        {/* Address */}
        <div
          title={formattedInfo.address}
          className="text-muted-foreground flex items-center gap-1"
        >
          <MapPin className="size-4 shrink-0" />
          <p className="text-08 line-clamp-1 font-medium">
            {formattedInfo.address}
          </p>
        </div>

        {/* Price */}
        <div className="flex-between text-muted-foreground text-08 relative mt-auto items-center border-t border-dashed pt-6 font-semibold">
          <span>شروع قیمت :</span>

          {formattedInfo.discountExists && (
            <div className="bg-card absolute -top-2.5 left-0 flex items-center gap-3 ps-2">
              <span className="text-muted-foreground text-08 line-through">
                {formattedInfo.originalPrice}
              </span>

              <span className="rounded-sm bg-red-500 px-2 py-0.5 text-xs text-white">
                %{discountPercentage}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <span className="text-primary text-95 font-bold">
              {formattedInfo.price}
            </span>

            <span className="text-primary">تومان</span>
            <span>/ 1 شب</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
