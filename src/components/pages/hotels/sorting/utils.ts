import { SortValue } from './types';

import { createLoader, parseAsStringLiteral } from 'nuqs/server';
import { SORT_VALUES, DEFAULT_SORT, SORT_QUERY_KEY } from './constants';

// ------------------------------

// Shared type-safe parser imported from `nuqs/server` (no 'use client' directive)
const sortParser = parseAsStringLiteral(SORT_VALUES).withDefault(DEFAULT_SORT);

const hotelSortSearchParams = {
  [SORT_QUERY_KEY]: sortParser,
};

// Optional: ready-to-use loader for reading ?sort= inside Next.js Server Components
const loadHotelSortParams = createLoader(hotelSortSearchParams);

// Type-guard for non-nuqs components (e.g. Base UI Select onValueChange)
const isValidSortValue = (value: string | null): value is SortValue => {
  if (!value) return false;
  return (SORT_VALUES as readonly string[]).includes(value);
};

// ------------------------------

export { sortParser, loadHotelSortParams, isValidSortValue };
