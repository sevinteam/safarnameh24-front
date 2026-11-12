import React from 'react';
import { usePathname } from 'next/navigation';
import { DatePicker } from '../date-picker';
import SubmitButton from '@/components/pages/home/hero-section/submit-button';
import { Calendar, CalendarRange, Hotel, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SearchStickyBar: React.FC = () => {
  const pathname = usePathname();

  // if (pathname === '/') return null;

  return (
    <div className="flex-center h-18 w-full gap-6 py-4">
      <div className="flex items-center gap-2">
        <Hotel className="text-muted-foreground size-5" />
        <span className="text-sm font-semibold">هتل‌ های تهران</span>
      </div>

      <div className="flex items-center gap-2">
        <CalendarRange className="text-muted-foreground size-5" />
        <span className="text-sm font-semibold">18 تا 20 آبان</span>
      </div>

      <Button size={'icon'}>
        <Search />
      </Button>
    </div>
  );
};
