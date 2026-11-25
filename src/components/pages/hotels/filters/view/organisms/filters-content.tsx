import { useHotelFiltersQuery } from '../../use-hotel-filters-query';
import { Amenities } from '../molecules/amenities';
import { GuestRating } from '../molecules/guest-rating';
import { HotelSearch } from '../molecules/hotel-search';
import { PriceRange } from '../molecules/price-range';
import { PropertyType } from '../molecules/property-type';
import { QuickToggle } from '../molecules/quick-toggle';
import { StarRating } from '../molecules/star-rating';

// ------------------------------

export function FiltersContent() {
  const { filters, updateFilters } = useHotelFiltersQuery();
  console.log('filters', filters);

  return (
    <>
      <HotelSearch value={filters.q} onChange={(q) => updateFilters({ q })} />

      <QuickToggle
        values={{
          discount: filters.discount,
          availableOnly: filters.availableOnly,
          freeCancellation: filters.freeCancellation,
        }}
        onChange={(key, checked) => updateFilters({ [key]: checked })}
      />

      <PriceRange
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onCommit={(minPrice, maxPrice) => updateFilters({ minPrice, maxPrice })}
      />

      <StarRating
        selectedStars={filters.stars}
        onChange={(stars) => updateFilters({ stars })}
      />

      <GuestRating
        value={filters.rating}
        onChange={(rating) => updateFilters({ rating })}
      />

      <Amenities
        selectedAmenities={filters.amenities}
        onChange={(amenities) => updateFilters({ amenities })}
      />

      <PropertyType
        selectedTypes={filters.types}
        onChange={(types) => updateFilters({ types })}
      />
    </>
  );
}
