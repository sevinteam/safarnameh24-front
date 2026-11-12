import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Destination } from './types';
import {
  getStoredHistory,
  saveDestinationToStorage,
  clearStoredHistory,
  fetchDestinationBySlugApi,
} from './utils';
import { useDestinationSearch } from './use-destination-search';

interface DestinationContextType {
  // Main states
  destination: Destination | null;
  setDestination: (item: Destination | null) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openModal: () => void;
  closeModal: () => void;

  // URL Hydration state
  isLoadingUrlSlug: boolean;

  // History state & actions
  history: Destination[];
  saveToHistory: (targetDestination?: Destination | null) => void;
  clearHistory: () => void;

  // Search core properties (exposed for search UI)
  search: ReturnType<typeof useDestinationSearch>;
}

const DestinationContext = createContext<DestinationContextType | undefined>(
  undefined,
);

interface DestinationProviderProps {
  children: ReactNode;
  initialDestination?: Destination | null;
}

export const DestinationProvider: React.FC<DestinationProviderProps> = ({
  children,
  initialDestination = null,
}) => {
  const [destination, setDestination] = useState<Destination | null>(
    initialDestination,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingUrlSlug, setIsLoadingUrlSlug] = useState(false);
  const [history, setHistory] = useState<Destination[]>([]);

  // Load history from localStorage once on initial mount
  useEffect(() => {
    setHistory(getStoredHistory());
  }, []);

  // Modal open/close helpers
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  // Read city or hotel slug from URL on initial mount (Consumer only)
  useEffect(() => {
    if (typeof window === 'undefined' || destination !== null) return;

    // Support query parameter (e.g., ?city=mashhad) or pathname catch-all segments
    const searchParams = new URLSearchParams(window.location.search);
    const querySlug = searchParams.get('city') || searchParams.get('slug');

    // Or extract the last path segment from pathname (e.g., /hotels/turkey/istanbul -> istanbul)
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    const pathSlug =
      pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : null;

    const targetSlug = querySlug || pathSlug;
    if (!targetSlug) return;

    const currentHistory = getStoredHistory();
    const matchedInHistory = currentHistory.find(
      (item) => item.slug.toLowerCase() === targetSlug.toLowerCase(),
    );

    // 1. Fast path: Found in client localStorage history
    if (matchedInHistory) {
      setDestination(matchedInHistory);
      return;
    }

    // 2. Fallback path: Query backend API for slug details
    let isCancelled = false;
    setIsLoadingUrlSlug(true);

    fetchDestinationBySlugApi(targetSlug)
      .then((resolvedItem) => {
        if (!isCancelled && resolvedItem) {
          setDestination(resolvedItem);
          // Persist fetched destination into history for subsequent fast reads
          const updatedHistory = saveDestinationToStorage(resolvedItem);
          setHistory(updatedHistory);
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingUrlSlug(false);
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Selection handler: updates active destination and closes overlay without touching storage
  const handleSelect = useCallback(
    (selectedItem: Destination) => {
      setDestination(selectedItem);
      closeModal();
    },
    [closeModal],
  );

  // Search logic core hook instance
  const search = useDestinationSearch({ onSelect: handleSelect });

  // Explicit action called by the parent submit/search button
  const saveToHistory = useCallback(
    (targetDestination?: Destination | null) => {
      const itemToSave =
        targetDestination !== undefined ? targetDestination : destination;
      if (!itemToSave) return;

      const updatedHistory = saveDestinationToStorage(itemToSave);
      setHistory(updatedHistory);
    },
    [destination],
  );

  // Clear search history
  const clearHistory = useCallback(() => {
    clearStoredHistory();
    setHistory([]);
  }, []);

  return (
    <DestinationContext.Provider
      value={{
        destination,
        setDestination,
        isOpen,
        setIsOpen,
        openModal,
        closeModal,
        isLoadingUrlSlug,
        history,
        saveToHistory,
        clearHistory,
        search,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

// Custom hook for consuming destination context
export const useDestination = (): DestinationContextType => {
  const context = useContext(DestinationContext);
  if (!context) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
};
