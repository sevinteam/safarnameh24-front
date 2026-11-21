'use client';

import {
  LogIn,
  MoveLeft,
  ArrowLeft,
  ChevronLeft,
  Menu as MenuIcon,
  ClipboardCheck,
  Headphones,
} from 'lucide-react';

import {
  Sheet,
  SheetClose,
  SheetTitle,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet';

import Link from 'next/link';
import Brand from '@/components/common/brand';

import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '../../model/constants';

import { ThemeSwitcher } from '@/components/common/theme-switcher';
import { LoginTrigger } from './login-trigger';

// ------------------------------

export default function Menu() {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="link" size={'icon-lg'} className={'lg:hidden'} />
        }
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>

      <SheetContent
        side="left"
        showCloseButton={false}
        className={'w-full! gap-0 rounded-none'}
      >
        <SheetHeader className="h-20 flex-row items-center gap-2 border-b">
          <SheetClose nativeButton={false} render={<Brand showTitle />} />
          <ThemeSwitcher className="mr-auto" />

          <SheetClose
            render={
              <Button variant={'link'} size={'icon-lg'}>
                <ArrowLeft />
              </Button>
            }
          />

          <SheetTitle className={'hidden'}></SheetTitle>
          <SheetDescription className={'hidden'}></SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-auto p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <SheetClose
                key={item.id}
                render={
                  <Button
                    nativeButton={false}
                    variant={item.href === pathname ? 'secondary' : 'link'}
                    className={
                      'h-14 w-full justify-start gap-2.5 font-semibold'
                    }
                    render={
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>

                        <ChevronLeft className="mr-auto" />
                      </Link>
                    }
                  />
                }
              />
            );
          })}
        </div>

        {/* <div className="grid grid-cols-2 gap-3 border-t p-4">
          <div className="hidden lg:block">
            <ThemeSwitcher />
          </div>

          <Button variant={'secondary'} className={'h-12 font-semibold'}>
            <ClipboardCheck />
            <span>پیگیری رزرو</span>
          </Button>

          <Button variant={'secondary'} className={'h-12 font-semibold'}>
            <Headphones />
            <span>پشتیبانی</span>
          </Button>

          <LoginTrigger
            variant="full-width"
            className="col-span-2 h-12 justify-start gap-2.5 px-5"
          />
        </div> */}
      </SheetContent>
    </Sheet>
  );
}
