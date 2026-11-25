'use client';

import { useCallback, useMemo } from 'react';
import { useQueryStates } from 'nuqs';
import { hotelFiltersSearchParams, hotelFiltersUrlKeys } from './search-params';

import type { HotelFiltersState } from './types';

type FilterPatch = Partial<Omit<HotelFiltersState, 'page'>>;

// ------------------------------

export function useHotelFiltersQuery() {
  const [filters, setFilters] = useQueryStates(hotelFiltersSearchParams, {
    urlKeys: hotelFiltersUrlKeys,
    shallow: true,
    history: 'replace',
    scroll: false,
    clearOnDefault: true,
  });

  // Atomically update one or more filters and reset pagination back to page 1
  const updateFilters = useCallback(
    (patch: FilterPatch) => {
      void setFilters({
        ...patch,
        page: 1,
      });
    },
    [setFilters],
  );

  // Reset all filters in a single URL update
  const resetAllFilters = useCallback(() => {
    void setFilters({
      q: '',
      minPrice: null,
      maxPrice: null,
      stars: [],
      rating: null,
      amenities: [],
      types: [],
      discount: false,
      availableOnly: false,
      freeCancellation: false,
      page: 1,
    });
  }, [setFilters]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;

    if (filters.q.trim()) count += 1;
    if (filters.discount) count += 1;
    if (filters.availableOnly) count += 1;
    if (filters.freeCancellation) count += 1;
    if (filters.minPrice !== null || filters.maxPrice !== null) count += 1;
    if (filters.stars.length > 0) count += filters.stars.length;
    if (filters.rating !== null) count += 1;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.types.length > 0) count += filters.types.length;

    return count;
  }, [filters]);

  return {
    filters,
    updateFilters,
    resetAllFilters,
    activeFiltersCount,
    hasActiveFilters: activeFiltersCount > 0,
  };
}
