import { NON_STICKY_HEADER_PATTERNS } from './constants';

// ------------------------------

export const checkIsStickyHeader = (pathname: string): boolean => {
  return !NON_STICKY_HEADER_PATTERNS.some((pattern) => pattern.test(pathname));
};
