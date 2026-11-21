'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useSortQuery } from './use-sort-query';
import { SortValue } from './types';
import { SORT_OPTIONS } from './constants';
import { isValidSortValue } from './utils';
import { ArrowUpDown } from 'lucide-react';

type Props = {
  className?: string;
  onSortChange?: (sort: SortValue) => void;
};

// ------------------------------

export default function SortWrapper(props: Props) {
  const { className, onSortChange } = props;

  const { activeSort, setSort } = useSortQuery({ onSortChange });
  const activeOption = SORT_OPTIONS.find((opt) => opt.value === activeSort);

  const handleSelectChange = (value: string | null) => {
    if (!isValidSortValue(value)) return;
    setSort(value);
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger
          render={<Button variant="link" className={'lg:hidden'} />}
        >
          <ArrowUpDown />

          {activeSort && activeSort !== 'recommended' ? (
            <span>{activeOption?.label}</span>
          ) : (
            <span>مرتب سازی</span>
          )}
        </DrawerTrigger>

        <DrawerContent>
          <DrawerHeader className="space-y-2">
            <DrawerTitle>مرتب‌سازی نتایج</DrawerTitle>

            <DrawerDescription>
              ترتیب نمایش هتل‌ها را انتخاب کنید
            </DrawerDescription>
          </DrawerHeader>

          <div className="mt-4 border-t border-dashed p-4">
            <RadioGroup
              value={activeSort}
              className={'gap-0'}
              defaultValue="option-one"
              onValueChange={handleSelectChange}
            >
              {SORT_OPTIONS.map((option) => {
                const Icon = option?.icon;

                return (
                  <DrawerClose
                    key={option.value}
                    className="flex h-10 items-center gap-2.5"
                  >
                    {Icon && <Icon className="size-5 shrink-0" />}
                    <Label
                      htmlFor={option.value}
                      className="flex-1 font-semibold"
                    >
                      {option.label}
                    </Label>

                    <RadioGroupItem value={option.value} id={option.value} />
                  </DrawerClose>
                );
              })}
            </RadioGroup>
          </div>
        </DrawerContent>
      </Drawer>

      <Select items={SORT_OPTIONS} onValueChange={handleSelectChange}>
        {/* <DrawerTrigger
          render={<Button variant="link" className={'lg:hidden'} />}
        >
          <ArrowUpDown />

          {activeSort && activeSort !== 'recommended' ? (
            <span>{activeOption?.label}</span>
          ) : (
            <span>مرتب سازی</span>
          )}
        </DrawerTrigger> */}

        <SelectTrigger
          render={
            <Button
              variant="link"
              className={'hidden! h-12! min-w-44 rounded-xl! px-4! lg:flex'}
            ></Button>
          }
        >
          {/* <ArrowUpDown /> */}

          {activeSort && activeSort !== 'recommended' ? (
            <span>{activeOption?.label}</span>
          ) : (
            <span>مرتب سازی</span>
          )}
          {/* <SelectValue placeholder="سایر موارد" className="text-start" /> */}
        </SelectTrigger>

        <SelectContent
          align="start"
          className="min-w-44"
          alignItemWithTrigger={false}
        >
          <SelectGroup>
            {SORT_OPTIONS.map((option) => {
              const Icon = option?.icon;

              return (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center gap-2">
                    {Icon && <Icon className="size-4.5" />}
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
