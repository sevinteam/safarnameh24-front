import { MOCK_HOTELS } from '@/lib/constants/hotel-card';
import HotelCard from '@/components/common/hotel-card/organisms/hotel-card.secondary';

// ------------------------------

export function HotelList() {
  return (
    <div className="space-y-8">
      {MOCK_HOTELS.map((item, i) => (
        <HotelCard key={String(item.id + i)} {...item} />
      ))}
    </div>
  );
}
