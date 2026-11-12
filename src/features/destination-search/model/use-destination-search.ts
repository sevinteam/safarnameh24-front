import { useState, useRef, useMemo, useEffect } from 'react';
import { Destination } from './types';
import { MOCK_GLOBAL_DESTINATIONS } from './constants';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface UseDestinationSearchCoreProps {
  onSelect: (item: Destination) => void;
}

export const useDestinationSearch = ({
  onSelect,
}: UseDestinationSearchCoreProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebounce(searchTerm, 500);
  const isSearching = searchTerm.trim().length > 0;

  // Filter list across domestic and international cities and hotels
  const filteredList = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    if (!query) return MOCK_GLOBAL_DESTINATIONS;

    return MOCK_GLOBAL_DESTINATIONS.filter((item) => {
      const matchName = item.name.toLowerCase().includes(query);
      const matchCountry = item.country.toLowerCase().includes(query);

      if (item.type === 'city') {
        const matchProvince =
          item.province?.toLowerCase().includes(query) || false;
        return matchName || matchCountry || matchProvince;
      } else {
        const matchCity = item.city.toLowerCase().includes(query);
        return matchName || matchCountry || matchCity;
      }
    });
  }, [debouncedSearch]);

  // Suggested default items when input is empty
  const defaultPopularCities = useMemo(() => {
    return MOCK_GLOBAL_DESTINATIONS.filter((item) => item.type === 'city');
  }, []);

  // Final display items
  const displayItems = isSearching ? filteredList : defaultPopularCities;

  const handleClearInput = () => {
    setSearchTerm('');
    inputRef.current?.focus();
  };

  const handleSelectItem = (item: Destination) => {
    onSelect(item);
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    isSearching,
    inputRef,
    displayItems,
    hasResults: displayItems.length > 0,
    handleClearInput,
    handleSelectItem,
  };
};
