// Forcing next.js to render this component as client side component
'use client';

// Importing part
import { FinancialSubscriptionsDashboardTablePropsType } from '@/types/dashboard/component';
import { ReactNode } from 'react';
import { cn } from '@/utils/utils';
import CustomPagination from '@/components/dashboard/ui/customPagination';
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { handleZeroBeforeNumber } from '@/utils/string';
import IconsaxIcons from '@/components/icons/iconsaxIcons';
import { numberSeparation } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import moment from 'jalali-moment';
import EmptyTable from '@/components/dashboard/api/emptyTable';

function getStatusMeta(status: string, statusDisplay?: string) {
  const normalized = status?.toLowerCase();
  if (normalized === 'successful' || normalized === 'successfull') {
    return {
      label: statusDisplay || 'موفقیت‌آمیز',
      className: 'border-emerald-500/30 bg-emerald-50 text-emerald-700',
    };
  }
  if (normalized === 'failed' || normalized === 'unsucessfull') {
    return {
      label: statusDisplay || 'ناموفق',
      className: 'border-red-500/30 bg-red-50 text-red-600',
    };
  }
  return {
    label: statusDisplay || 'در حال بررسی',
    className: 'border-amber-500/30 bg-amber-50 text-amber-700',
  };
}

// Creating and exporting SubscriptionTable component as default
export default function SubscriptionTable({
  className,
  data,
  loading, paginationActiveIndex, setPaginationActiveIndex, paginationCount
}: FinancialSubscriptionsDashboardTablePropsType): ReactNode {
  // Conditional rendering
  if (loading) {
    return (
      <section
        className={cn(
          'lg:bg-white bg-transparent overflow-hidden lg:rounded-lg lg:border border-black/10',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-3 py-5 px-3">
          <span className="block truncate text-right w-full font-bold lg:text-cs85 text-black">
            مشتری گرامی در این لیست شما دسترسی به تمام ریز گزارشات دارید.
          </span>
          <CustomPagination
            className='lg:flex hidden'
            count={12}
            loading
          />
        </div>
        <Table dir="rtl" className="border-none lg:table hidden">
          <TableHeader className="bg-gray-100 border-y border-y-black/10">
            <TableRow className="border-none">
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">ردیف </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                نام
              </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                تاریخ انقضا
              </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                تاریخ فعال سازی
              </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                مبلغ
              </TableHead>
              <TableHead className='w-[40%]' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...new Array(10)].map((_, index) => (
              <TableRow
                key={index}
                className={cn(
                  'bg-white hover:bg-white',
                  index + 1 !== data.length
                    ? 'border-b border-b-black/10'
                    : 'border-b-0',
                )}
              >
                <TableCell className="p-[20px] w-[30px]">
                  <Skeleton className="rounded-[5px] w-[30px] h-[40px] " />
                </TableCell>
                <TableCell className="p-3">
                  <Skeleton className="rounded-[5px] w-full h-[20px]" />
                </TableCell>
                <TableCell className="p-3">
                  <Skeleton className="rounded-[5px] w-full h-[20px]" />
                </TableCell>
                <TableCell className="p-3">
                  <Skeleton className="rounded-[5px] w-full h-[20px]" />
                </TableCell>
                <TableCell className="p-3">
                  <Skeleton className="rounded-[5px] w-full h-[20px]" />
                </TableCell>
                <TableCell className="p-3 flex items-center justify-end gap-3">
                  <Skeleton className="rounded-[5px] w-[150px] h-[40px]" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="lg:hidden block mt-5">
          <div className="flex flex-col">
            {[...new Array(10)].map((_, index) => (
              <div
                key={index}
                className={
                  'bg-transparent hover:bg-transparent border-b-[1.5px] border-b-black/10 py-3 mb-3'
                }
              >
                <div className="flex items-center justify-between gap-3 mb-[20px]">
                  <div className="flex items-center justify-start gap-[10px]">
                    <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                      <IconsaxIcons
                        name="DocumentText"
                        className="w-[20px] h-[20px] text-black"
                      />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                        نام :
                      </span>
                      <Skeleton className="rounded-[5px] w-[100px] h-[20px]" />
                    </div>
                  </div>
                  <Skeleton className="rounded-[5px] w-[150px] h-[40px]" />
                </div>
                <div className="flex items-center justify-start gap-[10px] mb-[25px]">
                  <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                    <IconsaxIcons
                      name="CalendarRemove"
                      className="w-[20px] h-[20px] text-black"
                    />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                      تاریخ انقضا :
                    </span>
                    <Skeleton className="rounded-[5px] w-[100px] h-[20px]" />
                  </div>
                </div>
                <div className="flex items-center justify-start gap-[10px] mb-[25px]">
                  <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                    <IconsaxIcons
                      name="CalendarTick"
                      className="w-[20px] h-[20px] text-black"
                    />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                      تاریخ فعال سازی :
                    </span>
                    <Skeleton className="rounded-[5px] w-[100px] h-[20px]" />
                  </div>
                </div>
                <div className="flex items-center justify-start gap-[10px] mb-[25px]">
                  <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                    <IconsaxIcons
                      name="Moneys"
                      className="w-[20px] h-[20px] text-black"
                    />
                  </div>
                  <div>
                    <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                      مبلغ :
                    </span>
                    <Skeleton className="rounded-[5px] w-[100px] h-[20px]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <CustomPagination count={12} loading />
        </div>
      </section>
    );
  } else if (data.length === 0) {
    return (
      <EmptyTable
        className={cn('lg:h-auto lg:py-12', className)}
        title="هیچ فاکتور اشتراکی ندارید!"
        description="مشتری گرامی هنوز هیچ فاکتور خرید یا تمدید اشتراکی برای شما ثبت نشده است."
      />
    );
  } else {
    return (
      <section
        className={cn(
          'lg:bg-white bg-transparent overflow-hidden lg:rounded-lg lg:border border-black/10',
          className,
        )}
      >
        <div className="lg:flex hidden items-center justify-between gap-3 py-5 px-3">
          <span className="block truncate text-right w-full font-bold lg:text-cs85 text-black">
            مشتری گرامی در این لیست شما دسترسی به تمام فاکتور ها دارید.
          </span>
          <CustomPagination
            count={paginationCount ?? 0}
            activeIndex={paginationActiveIndex}
            setActiveIndex={setPaginationActiveIndex}
          />
        </div>
        <Table dir="rtl" className="border-none lg:table hidden">
          <TableHeader className="bg-gray-100 border-y border-y-black/10">
            <TableRow className="border-none">
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                ردیف
              </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                نام
              </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                تاریخ انقضا
              </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                تاریخ فعال سازی
              </TableHead>
              <TableHead className="text-right p-3 w-8 truncate text-xs font-medium text-gray-400">
                مبلغ
              </TableHead>
              <TableHead className='w-[40%]' />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => {
              const statusMeta = getStatusMeta(item.status, item.statusDisplay);
              const rowNumber = (paginationActiveIndex ?? 0) * 18 + index + 1;
              return (
                <TableRow
                  key={item.id ?? index}
                  className={cn(
                    'bg-white hover:bg-white',
                    index + 1 !== data.length
                      ? 'border-b border-b-black/10'
                      : 'border-b-0',
                  )}
                >
                  <TableCell className="p-3">
                    <div className="rounded-[5px] bg-gray-100 flex items-center justify-center h-[40px] w-[30px]">
                      <span className="font-normal text-[12px] text-black block text-num-en">
                        {handleZeroBeforeNumber(rowNumber)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <span className="text-xs font-medium text-gray-600 truncate block text-right">
                      {item.name}
                    </span>
                  </TableCell>
                  <TableCell className="p-3">
                    <span className="text-xs font-medium text-gray-600 truncate block text-right">
                      {item.expireDate
                        ? moment(item.expireDate).format('jYYYY/jMM/jDD HH:mm')
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="p-3">
                    <span className="text-xs font-medium text-gray-600 truncate block text-right">
                      {item.createdAt
                        ? moment(item.createdAt).format('jYYYY/jMM/jDD HH:mm')
                        : '-'}
                    </span>
                  </TableCell>
                  <TableCell className="p-3">
                    <span className="text-xs font-medium text-gray-600 truncate block text-right">
                      {`${numberSeparation(item.price)} تومان`}
                    </span>
                  </TableCell>
                  <TableCell className="p-3 flex items-center justify-end gap-3">
                    <div
                      className={cn(
                        'w-[150px] h-[40px] flex gap-2 items-center justify-center transition-all duration-500 border rounded-md',
                        statusMeta.className,
                      )}
                    >
                      <span className="text-xs text-current font-medium">
                        {statusMeta.label}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="lg:hidden block mt-5">
          <div className="flex flex-col">
            {data.map((item, index) => {
              const statusMeta = getStatusMeta(item.status, item.statusDisplay);
              return (
                <div
                  key={item.id ?? index}
                  className={
                    'bg-transparent hover:bg-transparent border-b-[1.5px] border-b-black/10 py-3 mb-3'
                  }
                >
                  <div className="flex items-center justify-between gap-3 mb-[20px]">
                    <div className="flex items-center justify-start gap-[10px]">
                      <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                        <IconsaxIcons
                          name="DocumentText"
                          className="w-[20px] h-[20px] text-black"
                        />
                      </div>
                      <div>
                        <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                          نام :
                        </span>
                        <span className="text-[10px] font-medium text-gray-600 truncate block text-right">
                          {item.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-[10px]">
                      <div
                        className={cn(
                          'h-[40px] flex items-center justify-center border rounded-[7px] px-[20px]',
                          statusMeta.className,
                        )}
                      >
                        <span className="text-[10px] text-current font-medium w-full text-right block truncate">
                          {statusMeta.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px] mb-[25px]">
                    <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                      <IconsaxIcons
                        name="CalendarRemove"
                        className="w-[20px] h-[20px] text-black"
                      />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                        تاریخ انقضا
                      </span>
                      <span className="text-[10px] font-medium text-gray-600 truncate block text-right">
                        {item.expireDate
                          ? moment(item.expireDate).format('jYYYY/jMM/jDD HH:mm')
                          : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px] mb-[25px]">
                    <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                      <IconsaxIcons
                        name="CalendarTick"
                        className="w-[20px] h-[20px] text-black"
                      />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                        تاریخ فعال سازی :
                      </span>
                      <span className="text-[10px] font-medium text-gray-600 truncate block text-right">
                        {item.createdAt
                          ? moment(item.createdAt).format('jYYYY/jMM/jDD HH:mm')
                          : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-[10px] mb-[25px]">
                    <div className="h-[43px] w-[43px] rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                      <IconsaxIcons
                        name="Moneys"
                        className="w-[20px] h-[20px] text-black"
                      />
                    </div>
                    <div>
                      <span className="text-[12px] font-bold text-black truncate block text-right mb-1">
                        مبلغ :
                      </span>
                      <span className="text-[10px] font-medium text-gray-600 truncate block text-right">
                        {`${numberSeparation(item.price)} تومان`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <CustomPagination
            count={paginationCount ?? 0}
            activeIndex={paginationActiveIndex}
            setActiveIndex={setPaginationActiveIndex}
          />
        </div>
      </section>
    );
  }
}
