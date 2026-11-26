// Forcing next.js to render this component as client side component
'use client';

// Importing part
import IconsaxIcons from '@/components/icons/iconsaxIcons';
import SubscriptionChart from './subscriptionChart';
import { ReactNode, useState } from 'react';
import moment from 'jalali-moment';
import { numberSeparation } from '@/utils';
import { SubscriptionComponentPropsType } from '@/types/dashboard/component';
import { ICChartDown } from '@/components/icons/ICChartDown';
import { cn } from '@/utils/utils';
import { isNearISO } from '@/utils/date';
import RenewSubscriptionDialog from '../dialog/renewSubscription';
import Tooltip from '../../ui/tooltip';
import SubscriptionDetailsDialog from '../dialog/subscriptionDetailDialog';
import { useApiQuery } from '@/hooks/dashboard/useApiQuery';
import { GETCurrentSubscription, GETSubscriptionChart } from '@/types/dashboard/api/get';
import { Skeleton } from '@/components/ui/skeleton';

// Creating and exporting Subscription component as default
export default function Subscription({
  className,
}: SubscriptionComponentPropsType): ReactNode {
  // Defining hooks
  const [renewalDialogOpened, setRenewalDialogOpened] = useState<boolean>(false);
  const [detailsDialogOpened, setDetailsDialogOpened] = useState<boolean>(false);
  const getData = useApiQuery<GETCurrentSubscription>({
    url: "/subscription/subscription-info/",
    queryKey: ["current-subscription"],
    options: {
      refetchInterval: Infinity,
      staleTime: Infinity
    }
  });

  const chartsData = useApiQuery<GETSubscriptionChart>({
    url: "/subscription/daily-purchases/",
    queryKey: ["subscription-chart"],
    options: {
      enabled: !getData.isLoading,
      refetchInterval: Infinity,
      staleTime: Infinity
    }
  });

  // Defining varaiables
  const loading = [getData.isLoading, chartsData.isLoading].some(item => item === true);
  const chartItems = Array.isArray(chartsData.data) ? chartsData.data : [];

  const hasActiveSubscription = Boolean(getData.data?.expiration_date);
  const formatSubscriptionType = (type?: string) => {
    if (!type) return 'تعیین نشده';
    if (type === 'auto') return 'تمدید خودکار';
    if (type === 'manual') return 'دستی';
    if (type === 'ارتقا') return 'ارتقا بر اساس خرید';
    return type;
  };
  const isRenewalCostAvailable =
    getData.data?.renewal_cost !== null &&
    getData.data?.renewal_cost !== undefined;
  const amountLabel = isRenewalCostAvailable ? 'هزینه تمدید :' : 'مجموع خرید :';
  const amountValue = isRenewalCostAvailable
    ? `${numberSeparation(Number(getData.data?.renewal_cost))} تومان`
    : getData.data?.purchased_amount !== null &&
        getData.data?.purchased_amount !== undefined
      ? `${numberSeparation(Number(getData.data?.purchased_amount))} تومان`
      : 'تعیین نشده';
  const hasProgress = Boolean(getData.data?.progress);

  // Returning JSX
  return (
    <div
      className={cn(
        'bg-white border border-black/10 lg:rounded-lg rounded-[14px] overflow-hidden flex flex-col justify-between items-center',
        className,
      )}
    >
      {
        !loading && !getData.isError && getData.data?.progress && (
          <SubscriptionDetailsDialog
            data={getData.data.progress}
            open={detailsDialogOpened}
            onOpenChange={setDetailsDialogOpened}
          />
        )
      }
      <div className="lg:p-4 p-[14px] flex items-center justify-between border-b border-b-black/10 gap-3 shrink-0 w-full">
        <div className='flex items-center justify-start gap-3 flex-1 overflow-hidden'>
          <div className="shrink-0 size-[45px] rounded-md flex items-center justify-center border border-black/10 text-black">
            <IconsaxIcons
              name="Flash"
              className="w-[20px] h-[20px]"
              color="currentColor"
            />
          </div>
          <div className="overflow-hidden w-full">
            <span className="lg:text-cs75 text-[12px] font-semibold text-black truncate block text-right mb-1">
              کارت ویژه
            </span>
            <p className="text-right truncate text-black/50 lg:text-cs75 text-[10px] lg:font-semibold font-bold">
کد تحفیف اختصاصی کارت اشتراکی
            </p>
          </div>
          <RenewSubscriptionDialog open={renewalDialogOpened} onOpenChange={setRenewalDialogOpened} />
          <Tooltip content='تمدید اشتراک'>
            <button onClick={() => setRenewalDialogOpened(true)} className="size-[45px] shrink-0 flex items-center justify-center rounded-md text-black  transition-all duration-500 bg-[#f2f2f2]">
              <IconsaxIcons
                name="Add"
                className="w-[20px] h-[20px]"
                color="currentColor"
              />
            </button>
          </Tooltip>
          {
            loading
              ? <Skeleton className='size-[45px] shrink-0 rounded-md' />
              : getData.isError
                ? false
                : !loading && !getData.isError && getData.data
                  ? getData.data.expiration_date && isNearISO(getData.data.expiration_date) && (
                    <Tooltip content='تمدید اشتراک'>
                      <button onClick={() => setRenewalDialogOpened(true)} className="size-[45px] shrink-0 flex items-center justify-center rounded-md text-white  transition-all duration-500 bg-black">
                        <IconsaxIcons
                          name="Repeat"
                          className="w-[20px] h-[20px]"
                          color="currentColor"
                        />
                      </button>
                    </Tooltip>
                  )
                  : false
          }
        </div>
      </div>
      <div className="flex lg:flex-row flex-col items-center gap-3 w-full h-full lg:p-4 p-[14px] overflow-auto scrollbar-hide">
        {
          loading
            ? <Skeleton className='lg:w-[125px] w-full lg:h-full h-[145px] bg-gray-100 border-[1.5px] border-black/10 lg:rounded-lg rounded-[10px] shrink-0' />
            : chartsData.isError || chartItems.length === 0
              ? (
                <div className="lg:w-[125px] w-full lg:h-full h-[145px] bg-gray-100 border-[1.5px] border-black/10 lg:rounded-lg rounded-[10px] shrink-0 overflow-auto scrollbar-hide flex items-center flex-col justify-center">
                  <ICChartDown
                    className="lg:w-[60px] w-[40px] aspect-square block lg:mb-3 mb-2"
                    fill="currentColor"
                  />
                  <span className="lg:text-cs75 text-[14px] block text-center mx-auto truncate font-normal text-current">
                    مبلغ چارت نامعلوم
                  </span>
                </div>
              ) : (
                <div className="lg:w-[125px] w-full lg:h-full h-[145px] bg-gray-100 border-[1.5px] border-black/10 lg:rounded-lg rounded-[10px] shrink-0 overflow-auto scrollbar-hide flex items-end justify-start">
                  <SubscriptionChart chart={chartItems} />
                </div>
              )
        }
        <div className="w-full h-full flex flex-col justify-center lg:gap-5 gap-[10px] items-start">
          <span className="block text-right font-semibold text-black lg:text-cs75 text-[10px] truncate w-full">
            {loading ? 'در حال بررسی...' : hasActiveSubscription ? 'کارت اشتراک فعال' : 'کارت اشتراک ندارید!'}
          </span>
          <div className="flex items-center justify-between gap-3 w-full">
            <span className="block text-right font-medium text-black lg:text-cs07 text-[10px] truncate">
              تاریخ انقضا :
            </span>
            {
              loading
                ? <Skeleton className='h-[18px] rounded-md w-full' />
                : getData.isError
                  ? (
                    <span className="block text-left font-medium text-black lg:text-cs07 text-[10px] truncate">
                       خطا !
                    </span>
                  ) : !loading && !getData.isError && getData.data ? (
                    <span className="block text-left font-medium text-black lg:text-cs07 text-[10px] truncate">
                      {getData.data.expiration_date ? moment(getData.data.expiration_date).format('jYYYY/jMM/jDD') : "تعیین نشده"}
                    </span>
                  ) : false
            }
          </div>
          <div className="flex items-center justify-between gap-3 w-full">
            <span className="block text-right font-medium text-black lg:text-cs07 text-[10px] truncate">
              نوع :
            </span>
            {
              loading
                ? <Skeleton className='h-[18px] rounded-md w-full' />
                : getData.isError
                  ? (
                    <span className="block text-left font-medium text-black lg:text-cs07 text-[10px] truncate">
                       خطا
                    </span>
                  ) : !loading && !getData.isError && getData.data ? (
                    <span className="block text-left font-medium text-black lg:text-cs07 text-[10px] truncate">
                      {formatSubscriptionType(getData.data.subscription_type)}
                    </span>
                  ) : false
            }
          </div>
          <div className="flex items-center justify-between gap-3 w-full">
            <span className="block text-right font-medium text-black lg:text-cs07 text-[10px] truncate">
              {amountLabel}
            </span>
            <span className="block text-left font-medium text-black lg:text-cs07 text-[10px] truncate">
              {
                loading
                  ? <Skeleton className='h-[18px] rounded-md w-full' />
                  : getData.isError
                    ? (
                      <span className="block text-left font-medium text-black lg:text-cs07 text-[10px] truncate">
                        خطا !
                      </span>
                    ) : !loading && !getData.isError && getData.data ? (
                      <span className="block text-left font-medium text-black lg:text-cs07 text-[10px] truncate">
                        {amountValue}
                      </span>
                    ) : false
              }
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4 shrink-0 w-full">
        <button
          disabled={loading || getData.isError || !getData.data || !hasProgress}
          className="bg-black rounded-lg items-center justify-center flex text-white w-full px-3 h-[40px] text-cs07 border border-black font-semibold transition-all duration-500 disabled:bg-white disabled:text-black/40 disabled:border-black/10"
          onClick={() => setDetailsDialogOpened(true)}
        >
          {hasProgress ? 'جزییات استفاده کارت اشتراکی' : 'جزییات ارتقا (تکمیل شده)'}
        </button>
      </div>
    </div>
  );
}
