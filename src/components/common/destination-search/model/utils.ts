import { MOCK_GLOBAL_DESTINATIONS } from './constants';
import { Destination } from './types';

const STORAGE_KEY = 'app_recent_destinations';
const MAX_HISTORY_ITEMS = 5;

// Read history from localStorage safely
export const getStoredHistory = (): Destination[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Append an item to history storage (deduplicated, capped at max items)
export const saveDestinationToStorage = (item: Destination): Destination[] => {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getStoredHistory();
    const filtered = existing.filter((prev) => prev.slug !== item.slug);
    const updated = [item, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
};

// Clear history storage
export const clearStoredHistory = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};

// Simulate backend API fallback for looking up destination metadata by slug
export const fetchDestinationBySlugApi = async (
  slug: string,
): Promise<Destination | null> => {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 200));
  const found = MOCK_GLOBAL_DESTINATIONS.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase(),
  );
  return found || null;
};
