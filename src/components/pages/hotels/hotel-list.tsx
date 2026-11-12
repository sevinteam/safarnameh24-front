import HotelCard from '@/components/common/hotel-card/organisms/hotel-card.secondary';
import React from 'react';

export default function HotelList() {
  return (
    <div className="bg-sidebar h-[300vh]">
      {Array.from({ length: 2 }).map((_, i) => (
        <HotelCard />
      ))}
    </div>
  );
}
