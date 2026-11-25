'use client';

import {
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/ui/accordion';

import SwitchCase from './SwitchCase';

// --------------------------

export function OtherFilters() {
  return (
    <AccordionItem value="other-filters" className="px-5">
      <AccordionTrigger className="text-[0.9rem] font-bold text-zinc-900">
        سایر فیلتر ها
      </AccordionTrigger>

      <AccordionContent className="space-y-4 pb-4">
        <SwitchCase id="suggested-hotels" title="هتل های پیشنهادی" />
        <SwitchCase id="amazing-hotels" title="هتل های شگفت انگیز" />
        <SwitchCase
          id="last-minute"
          title="هتل های لحظه آخری"
          labelClassName="text-red-600"
        />
      </AccordionContent>
    </AccordionItem>
  );
}
