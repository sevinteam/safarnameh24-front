import Link from 'next/link';
import Image from 'next/image';

import { hotelAmenities } from './constants';
import { MapPin, Percent, Star } from 'lucide-react';

import { cn, formatNumber, getRatingTier } from '@/utils';
import { HotelCard as HotelCardProps } from '@/types/hotel';
import hotel_image from '@/assets/images/background/hero-3.jpg';

type Props = {
  className?: string;
  showTags?: boolean;
  info: HotelCardProps;
  showAmenities?: boolean;
  showStarsLabel?: boolean;
};

// ------------------------------

export default function HotelCardTypeA(props: Props) {
  const {
    info: {
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
      discountPercentage,
      price,
    },
    showTags,
    className,
    showAmenities,
    showStarsLabel,
  } = props;

  const formattedInfo = {
    name: `هتل ${name} ${city}`,
    address: `${city}, ${address}`,
    price: formatNumber(price),
    originalPrice: formatNumber(originalPrice),
    discountExists: discountPercentage && discountPercentage > 0,
    hotelLink: `/hotel/${city_slug}/${hotel_slug}`,
  };

  const nightsCount = 3;
  const { label, badgeClass } = getRatingTier(rating);
  const tags = ['هتل لوکس', 'مرکز شهر', 'کنسلی بدون جریمه'];

  return (
    <Link
      href={formattedInfo.hotelLink}
      className={cn(
        'bg-card flex flex-col overflow-hidden rounded-2xl border p-2.5',
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden rounded-xl">
        {/* Image-Placeholders */}
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

      <div className="mt-4 flex flex-1 flex-col gap-4 p-1.5">
        {/* Hotel-Name */}
        <p
          title={formattedInfo.name}
          className="text-95 line-clamp-1 font-bold"
        >
          {formattedInfo.name}
        </p>

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

              {showStarsLabel && (
                <span className="mr-1.5 text-xs font-medium">{`${stars} ستاره`}</span>
              )}
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

        {/* Amenities */}
        {showAmenities && (
          <div className="flex flex-wrap gap-3">
            {hotelAmenities.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <item.icon className="size-4 shrink-0" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tags */}
        {showTags && (
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className="bg-secondary rounded-sm px-2 py-1 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="text-muted-foreground text-08 -mt-4 font-semibold">
          <div className="flex h-12 items-center gap-2.5">
            <div className="flex-1 border-t border-dashed" />

            {formattedInfo.discountExists && (
              <div className="flex items-center gap-2.5">
                <span className="text-muted-foreground text-08 line-through">
                  {formattedInfo.originalPrice}
                </span>

                <span className="rounded-sm bg-red-500 px-2 py-0.5 text-xs text-white">
                  %{discountPercentage}
                </span>
              </div>
            )}
          </div>

          <div className="flex-between items-center">
            <span>شروع قیمت :</span>

            <div className="flex items-center gap-1">
              <span className="text-primary text-95 font-bold">
                {formattedInfo.price}
              </span>

              <span className="text-primary">تومان</span>
              <span>/ 1 شب</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
