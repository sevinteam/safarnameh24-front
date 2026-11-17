'use client';

import { useCallback } from 'react';
import { useQueryState } from 'nuqs';

import { viewModeParser } from './utils';
import { ViewMode } from './types';
import { VIEW_MODE_QUERY_KEY } from './constants';

type UseViewModeQueryOptions = {
  onViewChange?: (nextView: ViewMode) => void;
};

// ------------------------------

export const useViewModeQuery = ({
  onViewChange,
}: UseViewModeQueryOptions = {}) => {
  // Shallow update keeps UI transitions instant without hitting the server
  const [viewMode, setViewModeState] = useQueryState(
    VIEW_MODE_QUERY_KEY,
    viewModeParser.withOptions({
      shallow: true,
      history: 'replace',
      scroll: false,
      clearOnDefault: true,
    }),
  );

  const setViewMode = useCallback(
    (nextView: ViewMode) => {
      if (nextView === viewMode) return;

      void setViewModeState(nextView);
      onViewChange?.(nextView);
    },
    [onViewChange, setViewModeState, viewMode],
  );

  return {
    viewMode,
    setViewMode,
    isGrid: viewMode === 'grid',
    isList: viewMode === 'list',
  };
};
