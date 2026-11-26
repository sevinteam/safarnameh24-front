import {
  NoteBookItem,
  PassengersNotebookList,
  PassengersNotebookHeader,
  PassengersNotebookTrigger,
} from '../../atoms/reservation-form';

import { useMemo, useState } from 'react';
import { Person } from '../../helpers/type';
import { filterPassengers } from '../../utils';

import { useCheckAuth } from '@/hooks';
import { useUserAccountContext } from '@/context/UserAccountContext';
import { axiosInstance } from '@/utils/axios';
import { useQuery } from '@tanstack/react-query';
import { Sheet, SheetContent } from '@/components/ui/sheet';

type ApiPassenger = {
  id?: number;
  last_name?: string;
  first_name?: string;
  phone_number?: string;
  identification_code?: string;
  national_code?: string;
};

type Props = {
  idx: number;
  fillPassenger: (idx: number, passengerData: Person) => void;
};

const INITIAL_VISIBLE_COUNT = 4;

// ------------------------------

export function PassengersNoteBook(props: Props) {
  const { idx, fillPassenger } = props;

  const { isAuthenticated, loading: authLoading } = useCheckAuth();
  const { toggle: openLoginModal } = useUserAccountContext();

  const [sheetIsOpen, setSheetOpen] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const isUserLoggedIn = !authLoading && isAuthenticated;

  const handleCloseSheet = () => setSheetOpen(false);

  const handleOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      setSearchedValue('');
      setVisibleCount(INITIAL_VISIBLE_COUNT);
    }
  };

  const handleOpenLogin = () => {
    setSheetOpen(false);
    openLoginModal();
  };

  const { data: apiPassengers, status } = useQuery<Person[]>({
    enabled: sheetIsOpen && !authLoading && isUserLoggedIn,
    staleTime: 1000 * 30,
    refetchOnMount: 'always',
    retry: false,
    queryKey: ['passengers-notebook', isUserLoggedIn],
    queryFn: async () => {
      const extractList = (raw: any): ApiPassenger[] =>
        Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.results)
            ? raw.results
            : Array.isArray(raw?.data)
              ? raw.data
              : [];

      let list: ApiPassenger[] = [];

      try {
        const firstPageRes = await axiosInstance('/hotel/passengers/', {
          params: { p: 1 },
        });
        const firstRaw = firstPageRes.data;
        list = extractList(firstRaw);

        const totalPages = Number(firstRaw?.total_pages || 1);
        if (totalPages > 1) {
          const maxPages = Math.min(totalPages, 10);
          const remainingResponses = await Promise.all(
            Array.from({ length: maxPages - 1 }, (_, i) =>
              axiosInstance('/hotel/passengers/', { params: { p: i + 2 } }),
            ),
          );
          for (const res of remainingResponses) {
            list = list.concat(extractList(res.data));
          }
        }
      } catch {
        // Fallback to reservation passengers endpoint below
      }

      if (list.length === 0) {
        try {
          const fallbackRes = await axiosInstance('hotel/reservation/passengers/');
          list = extractList(fallbackRes.data);
        } catch {
          // Return empty list if fallback also fails
        }
      }

      return list.map((passenger) => ({
        first_name: passenger.first_name || '',
        last_name: passenger.last_name || '',
        phone_number: passenger.phone_number || '',
        national_code:
          passenger.national_code || passenger.identification_code || '',
      }));
    },
  });

  const allPassengers = useMemo(
    () => (isUserLoggedIn && Array.isArray(apiPassengers) ? apiPassengers : []),
    [isUserLoggedIn, apiPassengers],
  );

  const filteredPassengers = useMemo(
    () =>
      filterPassengers({
        passengers: allPassengers,
        searchedValue,
      }),
    [allPassengers, searchedValue],
  );

  const visiblePassengers = filteredPassengers.slice(0, visibleCount);
  const hasMore = visiblePassengers.length < filteredPassengers.length;

  return (
    <Sheet open={sheetIsOpen} onOpenChange={handleOpenChange}>
      <PassengersNotebookTrigger />

      <SheetContent
        side="right"
        dir="rtl"
        className="w-[88vw] sm:w-[400px] sm:max-w-[400px] border-l-0 bg-white p-6 flex flex-col gap-0 shadow-2xl data-[state=closed]:duration-300 data-[state=open]:duration-300"
      >
        {/* === Header */}
        <PassengersNotebookHeader />

        {/* === Search Input */}
        {isUserLoggedIn && (
          <div className="mt-7">
            <div className="rounded-xl border border-zinc-200/80 bg-white px-4 py-3 shadow-[0_6px_24px_rgba(0,0,0,0.04)]">
              <input
                type="text"
                value={searchedValue}
                placeholder="جستجوی مسافر..."
                onChange={(e) => {
                  setSearchedValue(e.target.value);
                  setVisibleCount(INITIAL_VISIBLE_COUNT);
                }}
                className="w-full bg-transparent text-xs font-semibold text-zinc-800 outline-none placeholder:text-zinc-400"
              />
            </div>
          </div>
        )}

        {/* === Section Title */}
        <div className="mt-7">
          <span className="block text-xs font-extrabold text-zinc-900">
            لیست مسافران
          </span>
          <div className="mt-3.5 border-t border-dashed border-zinc-200" />
        </div>

        {/* === List */}
        <PassengersNotebookList
          status={authLoading ? 'pending' : status}
          isAuthenticated={isUserLoggedIn}
          onOpenLogin={handleOpenLogin}
          isEmpty={filteredPassengers.length === 0}
          hasSearchQuery={Boolean(searchedValue.trim())}
          hasMore={hasMore}
          onLoadMore={() =>
            setVisibleCount((prev) => prev + INITIAL_VISIBLE_COUNT)
          }
        >
          {visiblePassengers.map((passenger, index) => (
            <NoteBookItem
              idx={idx}
              key={`${passenger.first_name}-${passenger.last_name}-${passenger.national_code}-${index}`}
              fillPassenger={fillPassenger}
              handleCloseSheet={handleCloseSheet}
              passenger={passenger}
            />
          ))}
        </PassengersNotebookList>
      </SheetContent>
    </Sheet>
  );
}
