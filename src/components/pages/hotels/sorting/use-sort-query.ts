'use client';

import { useCallback } from 'react';
import { useQueryState } from 'nuqs';

import { SORT_QUERY_KEY } from './constants';
import { sortParser } from './utils';
import { SortValue } from './types';

interface UseSortQueryOptions {
  onSortChange?: (nextSort: SortValue) => void;
}

// ------------------------------

export const useSortQuery = ({ onSortChange }: UseSortQueryOptions = {}) => {
  // Shallow update is enabled by default -> instant client URL sync with zero tab flicker
  const [activeSort, setActiveSort] = useQueryState(
    SORT_QUERY_KEY,
    sortParser.withOptions({
      shallow: true,
      history: 'replace',
      scroll: false,
      clearOnDefault: true,
    }),
  );

  const setSort = useCallback(
    (nextSort: SortValue) => {
      if (nextSort === activeSort) return;

      void setActiveSort(nextSort);
      onSortChange?.(nextSort);
    },
    [activeSort, onSortChange, setActiveSort],
  );

  return {
    activeSort,
    setSort,
  };
};
