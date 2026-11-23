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
  discount: parseAsBoolean.withDefault(false),
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  stars: parseAsArrayOf(parseAsInteger).withDefault([]),
  rating: parseAsInteger,
  amenities: parseAsArrayOf(parseAsString).withDefault([]),
  types: parseAsArrayOf(parseAsString).withDefault([]),
  page: parseAsInteger.withDefault(1),
};

// Map internal code keys to custom URL query parameter names
export const hotelFiltersUrlKeys: UrlKeys<typeof hotelFiltersSearchParams> = {
  q: 'hotel-name', // URL: ?hotel-name=...  | Code: filters.q
  minPrice: 'min-price',
  maxPrice: 'max-price',
};

export const loadHotelFiltersParams = createLoader(hotelFiltersSearchParams, {
  urlKeys: hotelFiltersUrlKeys,
});
