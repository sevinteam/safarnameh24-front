import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useDestination } from '../../model/destination-search-context';

// ------------------------------

export function SearchInput() {
  const {
    search: { searchTerm, inputRef, setSearchTerm, handleClearInput },
  } = useDestination();

  return (
    <div className="relative flex w-full items-center">
      <Search className="text-muted-foreground pointer-events-none absolute right-4 size-5" />

      <Input
        type="text"
        ref={inputRef}
        value={searchTerm}
        className="ps-12"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={'شهر یا هتل مقصد (داخلی و خارجی)'}
      />

      {searchTerm && (
        <Button
          type="button"
          size={'icon-sm'}
          variant={'ghost'}
          aria-label="پاک کردن متن"
          onClick={handleClearInput}
          className="absolute left-2 rounded-lg"
        >
          <Plus className="rotate-45" />
        </Button>
      )}
    </div>
  );
}
