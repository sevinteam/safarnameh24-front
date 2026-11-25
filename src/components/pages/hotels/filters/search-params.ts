import {
  createLoader,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  type UrlKeys,
} from 'nuqs/server';

export const hotelFiltersSearchParams = {
  q: parseAsString.withDefault(''),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  stars: parseAsArrayOf(parseAsInteger).withDefault([]),
  rating: parseAsInteger,
  amenities: parseAsArrayOf(parseAsInteger).withDefault([]),
  types: parseAsArrayOf(parseAsString).withDefault([]),
  discount: parseAsBoolean.withDefault(false),
  availableOnly: parseAsBoolean.withDefault(false),
  freeCancellation: parseAsBoolean.withDefault(false),
  page: parseAsInteger.withDefault(1),
};

// Map internal code keys to custom URL query parameter names
export const hotelFiltersUrlKeys: UrlKeys<typeof hotelFiltersSearchParams> = {
  q: 'hotel-name', // URL: ?hotel-name=...  | Code: filters.q
  minPrice: 'min-price',
  maxPrice: 'max-price',
  discount: 'discounted',
  availableOnly: 'available-only',
  freeCancellation: 'free-cancellation',
};

export const loadHotelFiltersParams = createLoader(hotelFiltersSearchParams, {
  urlKeys: hotelFiltersUrlKeys,
});
