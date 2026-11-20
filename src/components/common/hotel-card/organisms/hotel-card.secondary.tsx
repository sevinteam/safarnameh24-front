import Link from 'next/link';
import Image from 'next/image';

import { DoorOpen, MapPin, Percent, Star, Utensils } from 'lucide-react';

import { cn, formatNumber, getRatingTier } from '@/utils';
import hotel_image from '@/assets/images/background/hero-2.jpg';
import { HotelCard as HotelCardProps } from '@/types/hotel';
import { Button } from '@/components/ui/button';
import { hotelAmenities } from './constants';

type Props = HotelCardProps & {
  className?: string;
};

// ------------------------------

export default function HotelCard(props: Props) {
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

  const nightsCount = 3;
  const { label, badgeClass } = getRatingTier(rating);
  const tags = ['هتل لوکس', 'مرکز شهر', 'کنسلی بدون جریمه'];

  return (
    <div
      className={cn(
        'bg-card flex flex-col overflow-hidden rounded-2xl border p-3',
        'lg:flex-row lg:p-5',
        className,
      )}
    >
      <div className="relative h-48 overflow-hidden rounded-xl lg:h-auto lg:min-h-52 lg:w-64">
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

      <div
        className={cn(
          'mt-4 flex flex-1 flex-col p-1',
          'lg:mt-0 lg:flex-row lg:p-0',
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-1 lg:px-5">
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
                  <Star
                    key={i}
                    className="size-3 fill-current text-amber-500"
                  />
                ))}

                <span className="mr-1.5 text-xs font-medium">{`${stars} ستاره`}</span>
              </div>
            )}
          </div>

          {/* Address */}
          <div
            title={formattedInfo.address}
            className="text-muted-foreground flex items-center gap-1"
          >
            <MapPin className="size-4 shrink-0" />
            <p className="text-08 line-clamp-1 font-medium lg:line-clamp-none lg:text-sm">
              {formattedInfo.address}
            </p>
          </div>

          {/* Facilities */}
          <div className="hidden flex-wrap gap-3 lg:mt-auto lg:flex">
            {hotelAmenities.slice(0, 5).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <item.icon className="size-4 shrink-0" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
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
        </div>

        <div className="flex flex-col border-dashed lg:w-56 lg:gap-4 lg:border-r lg:pr-5">
          {/* Tags */}
          {/* <div className="flex flex-wrap gap-2">
            {tags.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className="bg-secondary rounded-sm px-2 py-1 text-xs font-medium"
              >
                {item}
              </span>
            ))}
          </div> */}

          {/* Price */}
          <div
            className={cn(
              'text-muted-foreground relative my-6 flex items-center justify-between border-t border-dashed pt-6 text-[0.8rem]/5 font-semibold',
              'lg:my-0 lg:flex-1 lg:flex-col lg:justify-center lg:gap-4 lg:border-t-0 lg:pt-0 lg:text-sm',
            )}
          >
            <div className="flex items-center gap-2">
              {/* <DoorOpen className="size-5" /> */}
              <span>دو تخته دابل نرمال</span>
            </div>

            {formattedInfo.discountExists && (
              <div className="bg-card lg: absolute -top-2.5 left-0 flex items-center gap-2.5 ps-2 lg:static lg:bg-transparent">
                <span className="text-muted-foreground text-08 line-through lg:text-sm">
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
              <span>/ {nightsCount} شب</span>
            </div>
          </div>

          {/* Hotel-Link */}
          <Button
            nativeButton={false}
            className={'mt-auto'}
            render={
              <Link href={formattedInfo.hotelLink}>مشاهده اتاق ها و رزرو</Link>
            }
          ></Button>
        </div>
      </div>
    </div>
  );
}
