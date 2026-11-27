import 'swiper/css';
import '@/styles/swiper.css';
import 'swiper/css/pagination';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { TickSquare } from 'iconsax-react';

import { useMediaQuery } from '@/hooks';
import SwitchCase from './molecules/SwitchCase';
import Navigation from './molecules/Navigation';

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

type Data = {
  name: string;
  facilities: Facility[];
  room_facilities: Facility[];
};

type Props = { facilities?: Data };
type FacilitiesType = 'hotel' | 'room';
type Facility = { title: string; icon: { link?: string; url?: string } | null };
type ChunkArrayProps = { array?: Facility[]; chunkSize?: number };

// ------------------------------

export function DFacilities(props: Props) {
  const { facilities } = props;

  const swiperRef = useRef<SwiperType>(null);
  const hasHotelFacilities = Boolean(facilities?.facilities?.length);
  const hasRoomFacilities = Boolean(facilities?.room_facilities?.length);
  const [facilitiesType, setFacilitiesType] = useState<FacilitiesType>(
    hasHotelFacilities || !hasRoomFacilities ? 'hotel' : 'room',
  );

  const isXl = useMediaQuery('(min-width: 1280px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  const chunkSize = isXl ? 18 : isLg ? 15 : 12;

  const handleSetFacilitiesType = (type: FacilitiesType) => {
    setFacilitiesType(type);
  };

  // === Making chunked array, by custom-size
  function chunkArray(props: ChunkArrayProps) {
    const { array, chunkSize = 18 } = props;
    if (!array) return [];
    const result = [];

    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }

    return result;
  }

  const facilitiesList = chunkArray({
    array: facilities?.facilities,
    chunkSize,
  });
  const roomFacilitiesList = chunkArray({
    array: facilities?.room_facilities,
    chunkSize,
  });

  const finalList =
    facilitiesType === 'hotel' ? facilitiesList : roomFacilitiesList;

  return (
    <div className="hidden md:block">
      <div className="absolute top-0 left-0 z-10">
        <SwitchCase
          facilitiesType={facilitiesType}
          setFacilitiesType={handleSetFacilitiesType}
        />
      </div>

      <div className="relative bg-white h-56 p-5 flex border overflow-hidden rounded-2xl lg:h-48">
        {/* === Content */}
        {finalList.length === 0 ? (
          <div className="w-full h-full flex-center text-zinc-500 text-cs08 font-semibold">
            موردی برای نمایش وجود ندارد.
          </div>
        ) : (
          <Swiper
            key={`${facilitiesType}-${chunkSize}`}
            spaceBetween={15}
            slidesPerView={1}
            direction="vertical"
            modules={[Pagination]}
            pagination={{
              enabled: true,
              clickable: true,
              dynamicBullets: true,
            }}
            className="facilities-swiper w-full h-full"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {finalList.map((item, index) => (
              <SwiperSlide
                key={index}
                className="h-full overflow-hidden select-none"
              >
                <div className="w-[calc(100%-3rem)] h-full grid grid-cols-4 grid-rows-3 gap-4 lg:grid-cols-5 xl:grid-cols-6">
                  {item.map((facility, facilityIndex) => {
                    const iconSrc = facility?.icon?.link || facility?.icon?.url;
                    return (
                      <div
                        key={facilityIndex}
                        className="flex items-center gap-2.5 min-w-0"
                      >
                        {iconSrc ? (
                          <Image
                            alt={facility.title || 'icon'}
                            width={24}
                            height={24}
                            src={iconSrc}
                            className="shrink-0 object-contain"
                          />
                        ) : (
                          <TickSquare
                            size={22}
                            color="#444"
                            className="shrink-0"
                          />
                        )}

                        <span
                          title={facility.title}
                          className="text-zinc-700 text-cs08 font-bold flex-1 truncate"
                        >
                          {facility.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {finalList.length > 1 && (
          <Navigation
            slidePrev={() => swiperRef.current?.slidePrev()}
            slideNext={() => swiperRef.current?.slideNext()}
          />
        )}
      </div>
    </div>
  );
}
