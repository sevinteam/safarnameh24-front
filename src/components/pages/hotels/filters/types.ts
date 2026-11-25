export type FilterOptionItem<T extends string | number = string> = {
  value: T;
  label: string;
  count?: number;
};

export type GuestRatingOption = {
  value: number;
  label: string;
  badge: string;
};

export type HotelFiltersState = {
  q: string;
  discount: boolean;
  minPrice: number | null;
  maxPrice: number | null;
  stars: number[];
  rating: number | null;
  amenities: number[];
  types: string[];
  page: number;
};
