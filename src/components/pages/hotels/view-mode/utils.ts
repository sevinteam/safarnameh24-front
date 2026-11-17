import { createLoader, parseAsStringLiteral } from 'nuqs/server';

import {
  DEFAULT_VIEW_MODE,
  VIEW_MODE_QUERY_KEY,
  VIEW_MODE_VALUES,
} from './constants';

// Shared type-safe parser imported from `nuqs/server` (Server & Client safe)
export const viewModeParser =
  parseAsStringLiteral(VIEW_MODE_VALUES).withDefault(DEFAULT_VIEW_MODE);

export const hotelViewSearchParams = {
  [VIEW_MODE_QUERY_KEY]: viewModeParser,
};

// Optional: for reading ?view= directly inside Next.js Server Components
export const loadHotelViewParams = createLoader(hotelViewSearchParams);
