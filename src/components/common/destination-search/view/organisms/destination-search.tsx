'use client';

import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';

import { ArrowRight } from 'lucide-react';

import { SearchInput } from '../molecules/search-input';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { DestinationList } from '../molecules/destination-list';

import { useDestination } from '../../model/destination-search-context';
import DestinationSearchTrigger from '../molecules/destination-search-trigger';

type Props = {};

// ------------------------------

export function DestinationSearch(props: Props) {
  const {} = props;

  const { isOpen, setIsOpen } = useDestination();
  const isDesktop = useMediaQuery('(min-width: 640px)');

  return (
    <>
      {!isDesktop ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger>
            <DestinationSearchTrigger />
          </SheetTrigger>

          <SheetContent className={'w-full! gap-0'} showCloseButton={false}>
            <SheetHeader className="flex-row gap-2.5 border-b px-4 py-6">
              <SheetClose className={'flex'}>
                <ArrowRight className="size-5" />
              </SheetClose>

              <SheetTitle>
                <span>انتخاب مقصد</span>
              </SheetTitle>

              <SheetDescription className={'hidden'} />
            </SheetHeader>

            <div className={'px-4 py-6'}>
              <SearchInput />
            </div>

            <DestinationList />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <DestinationSearchTrigger />
          </DialogTrigger>

          <DialogContent
            showCloseButton={false}
            className={'h-auto gap-0 overflow-hidden rounded-3xl p-0'}
          >
            <DialogHeader className="p-6">
              <DialogTitle className={'hidden'}></DialogTitle>
              <DialogDescription className={'hidden'}></DialogDescription>

              <SearchInput />
            </DialogHeader>

            <DestinationList />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
