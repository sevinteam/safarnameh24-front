// Forcning Next.js to render this component as client side component
'use client';

// Importing part
import IconsaxIcons from '@/components/icons/iconsaxIcons';
import { SubscriptionPickerPropsType } from '@/types/dashboard/component';
import { cn } from '@/utils/utils';
import { JSX, useState } from 'react';
import { addCommas } from '@persian-tools/persian-tools';
import { Award, CheckCircle2, Crown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import BuySubscriptionDialog from './dialog/buySubscriptionDialog';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useApiQuery } from '@/hooks/dashboard/useApiQuery';
import useUserInfo from '@/hooks/dashboard/useUserInfo';
import {
  GETCurrentSubscription,
  GETSubscriptionPackages,
  GETUserLevels,
} from '@/types/dashboard/api/get';
import { Skeleton } from '@/components/ui/skeleton';

const FALLBACK_LEVEL_ORDER = ['میهمان', 'نقره ای', 'طلایی'];

const normalizeLevelName = (value?: string | null): string =>
  (value || '')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[\u200c\u200f\s]+/g, '')
    .trim();

// Creating and exporting SubscriptionPicker component as default
export default function SubscriptionPicker({
  className,
  disabled = false,
}: SubscriptionPickerPropsType): JSX.Element {
  // Defininig hooks
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [activeSwiperSlideIndex, setActiveSwiperSlideIndex] =
    useState<number>(0);
  const { level_name } = useUserInfo();

  const getData = useApiQuery<GETSubscriptionPackages[]>({
    url: '/subscription/packages/',
    queryKey: ['subscription-packages'],
    options: {
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    },
  });

  const levelsFetch = useApiQuery<GETUserLevels>({
    url: '/config/user-levels/',
    queryKey: ['user-levels'],
    options: {
      staleTime: 60 * 1000,
    },
  });

  const currentSubFetch = useApiQuery<GETCurrentSubscription>({
    url: '/subscription/subscription-info/',
    queryKey: ['current-subscription'],
    options: {
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    },
  });

  const rawPackages = getData.data as
    | GETSubscriptionPackages[]
    | { data?: GETSubscriptionPackages[]; results?: GETSubscriptionPackages[] }
    | undefined;
  const allPackages: GETSubscriptionPackages[] = Array.isArray(rawPackages)
    ? rawPackages
    : rawPackages &&
        typeof rawPackages === 'object' &&
        'data' in rawPackages &&
        Array.isArray(rawPackages.data)
      ? rawPackages.data
      : rawPackages &&
          typeof rawPackages === 'object' &&
          'results' in rawPackages &&
          Array.isArray(rawPackages.results)
        ? rawPackages.results
        : [];

  const apiLevelTitles = (levelsFetch.data?.data ?? [])
    .map((item) => normalizeLevelName(item.title))
    .filter(Boolean);
  const levelOrder =
    apiLevelTitles.length > 0
      ? apiLevelTitles
      : FALLBACK_LEVEL_ORDER.map(normalizeLevelName);

  const normalizedUserLevel = normalizeLevelName(level_name);
  const currentLevelIndex = normalizedUserLevel
    ? levelOrder.indexOf(normalizedUserLevel)
    : 0;

  const currentSub = currentSubFetch.data;
  const hasActiveSubscription = Boolean(currentSub?.expiration_date);
  const activeRenewalCost =
    currentSub?.renewal_cost !== null && currentSub?.renewal_cost !== undefined
      ? Number(currentSub.renewal_cost)
      : null;

  const activePackageLevelIndex = (() => {
    if (
      !hasActiveSubscription ||
      activeRenewalCost === null ||
      !Number.isFinite(activeRenewalCost)
    ) {
      return -1;
    }
    const matchedPkg = allPackages.find(
      (pkg) => Number(pkg.monthly_cost) === activeRenewalCost,
    );
    if (!matchedPkg) return -1;
    return levelOrder.indexOf(normalizeLevelName(matchedPkg.upgrade_to_level));
  })();

  const effectiveLevelIndex = Math.max(
    currentLevelIndex,
    activePackageLevelIndex,
  );

  const packages = allPackages.filter((pkg) => {
    if (
      hasActiveSubscription &&
      activeRenewalCost !== null &&
      Number.isFinite(activeRenewalCost) &&
      Number(pkg.monthly_cost) === activeRenewalCost
    ) {
      return false;
    }
    if (effectiveLevelIndex === -1) return true;
    const targetLevelIndex = levelOrder.indexOf(
      normalizeLevelName(pkg.upgrade_to_level),
    );
    if (targetLevelIndex === -1) return true;
    return targetLevelIndex > effectiveLevelIndex;
  });

  const isLoading =
    getData.isLoading || levelsFetch.isLoading || currentSubFetch.isLoading;

  const goldLevelIndex = levelOrder.indexOf(normalizeLevelName('طلایی'));
  const maxLevelIndex = levelOrder.length > 0 ? levelOrder.length - 1 : -1;
  const isGoldLevel =
    !isLoading &&
    !disabled &&
    effectiveLevelIndex !== -1 &&
    (goldLevelIndex !== -1
      ? effectiveLevelIndex >= goldLevelIndex
      : maxLevelIndex !== -1 && effectiveLevelIndex >= maxLevelIndex);

  const safeSlideIndex =
    packages.length > 0
      ? Math.min(Math.max(activeSwiperSlideIndex, 0), packages.length - 1)
      : 0;
  const activePackage = packages[safeSlideIndex];

  // Returning JSX
  return (
    <div
      id="subscription-picker"
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border bg-white',
        isGoldLevel
          ? 'border-[#ECC312]/50 shadow-[0_8px_30px_rgba(236,195,18,0.08)]'
          : 'border-black/10',
        disabled && 'pointer-events-none select-none opacity-50',
        className,
      )}
    >
      {!isLoading && !getData.isError && activePackage && (
        <BuySubscriptionDialog
          id={activePackage.id}
          open={modalOpened}
          onOpenChange={setModalOpened}
        />
      )}
      <div
        className={cn(
          'flex items-center justify-between gap-3 border-b p-[14px] lg:p-4',
          isGoldLevel
            ? 'border-b-[#ECC312]/25 bg-gradient-to-l from-[#FFFDF2] via-white to-[#FFF9DB]/50'
            : 'border-b-black/10',
        )}
      >
        <div className="flex flex-1 items-center justify-start gap-3 overflow-hidden">
          <div
            className={cn(
              'flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px] border lg:rounded-md',
              isGoldLevel
                ? 'border-[#ECC312]/45 bg-gradient-to-br from-[#FFF7CC] to-[#F7D756]/50 text-[#8F6800]'
                : 'border-black/10 text-black',
            )}
          >
            {isGoldLevel ? (
              <Crown className="h-[20px] w-[20px]" />
            ) : (
              <IconsaxIcons
                name="Crown1"
                className="h-[20px] w-[20px]"
                color="currentColor"
              />
            )}
          </div>
          <div className="w-full overflow-hidden">
            <span className="mb-1 block truncate text-right text-[12px] font-semibold text-black lg:text-cs75">
              {isGoldLevel
                ? 'مشتری پرمیوم زروان تریپ (سطح طلایی)'
                : 'مدیریت و تمدید اشتراک'}
            </span>
            <p className="truncate text-right text-[10px] font-bold text-black/50 lg:text-cs75 lg:font-semibold">
              {isGoldLevel
                ? 'تبریک! شما به بالاترین سطح کاربری و امتیازات ویژه رسیده‌اید.'
                : 'جهت خرید یا تمدید دوره‌ی اشتراک خود، از این بخش استفاده کنید.'}
            </p>
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-[38px] w-[200px] lg:h-[45px] lg:w-[125px]" />
        ) : isGoldLevel ? (
          <div className="flex h-[38px] w-fit shrink-0 items-center justify-center gap-1.5 rounded-md border border-[#ECC312]/50 bg-gradient-to-l from-[#FFF6CC] to-[#FCE588]/60 px-3 text-xs font-bold text-[#7A5800] lg:h-[45px] lg:px-4 lg:text-sm">
            <Sparkles className="h-4 w-4 shrink-0 text-[#B8860B]" />
            <span className="truncate">سطح نهایی (طلایی)</span>
          </div>
        ) : (
          <button
            type="button"
            className="flex h-[38px] w-fit shrink-0 items-center justify-center truncate rounded-md border border-green-500 bg-green-500 px-3 text-cs75 text-xs font-medium text-white transition-all duration-500 hover:bg-green-600 disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-gray-50 disabled:text-black/40 lg:h-[45px] lg:w-[125px] lg:px-6 lg:text-sm"
            disabled={disabled || getData.isError || !activePackage}
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && activePackage && setModalOpened(true)}
          >
            خرید اشتراک
          </button>
        )}
      </div>
      {isGoldLevel ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="grid flex-1 gap-4 p-[14px] lg:grid-cols-9 lg:p-4"
        >
          <div className="relative flex h-[190px] flex-col justify-between overflow-hidden rounded-xl border border-[#ECC312]/40 bg-gradient-to-br from-[#1C1810] via-[#3B2E12] to-[#9E7614] p-5 text-white shadow-inner lg:col-span-4 lg:h-[230px]">
            <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#ECC312]/25 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-[#FFD95A]/15 blur-2xl" />
            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#ECC312]/40 bg-white/10 backdrop-blur-sm">
                  <Crown className="h-5 w-5 text-[#FFD95A]" />
                </div>
                <div className="text-right">
                  <span className="block text-[11px] font-bold text-[#FCE588]">
                    کارت طلایی VIP
                  </span>
                  <span className="block text-[10px] text-white/70">
                    زروان تریپ
                  </span>
                </div>
              </div>
              <span className="rounded-md border border-[#ECC312]/40 bg-[#ECC312]/15 px-2.5 py-1 text-[10px] font-bold text-[#FFE58F]">
                مشتری پرمیوم
              </span>
            </div>

            <div className="relative space-y-1.5 text-right">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#FCE588]/90">
                <Award className="h-3.5 w-3.5 shrink-0" />
                <span>سطح نهایی عضویت</span>
              </div>
              <p className="text-base font-extrabold tracking-tight text-white lg:text-lg">
                اشتراک طلایی فعال است
              </p>
              <p className="truncate text-[11px] text-white/75">
                بالاترین امتیاز و تخفیف اختصاصی برای شما فعال شد
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#ECC312]/25 bg-gradient-to-bl from-[#FFFDF4] via-white to-[#FFF7D6]/40 p-4 lg:col-span-5 lg:h-[230px]">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-[#ECC312]/40 bg-[#FFF6CC] px-2.5 py-1 text-[10px] font-bold text-[#8A6400]">
                  <Sparkles className="h-3 w-3" />
                  مرحله آخر
                </span>
                <span className="text-[11px] font-semibold text-black/50">
                  تمامی سطوح تکمیل شده است
                </span>
              </div>
              <h3 className="text-right text-sm font-extrabold text-black lg:text-base">
                تو به مرحله آخر رسیدی و مشتری پرمیوم مایی!
              </h3>
              <p className="text-right text-[11px] font-medium leading-6 text-black/65 lg:text-xs">
                با رسیدن به اشتراک طلایی، به بالاترین سطح باشگاه مشتریان زروان
                تریپ دست پیدا کرده‌اید و بسته بالاتری برای ارتقا وجود ندارد.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-2.5 py-2 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B8860B]" />
                <span className="truncate text-[11px] font-semibold text-black/80">
                  حداکثر تخفیف رزرو
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-2.5 py-2 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B8860B]" />
                <span className="truncate text-[11px] font-semibold text-black/80">
                  پشتیبانی ویژه VIP
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-black/5 bg-white px-2.5 py-2 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[#B8860B]" />
                <span className="truncate text-[11px] font-semibold text-black/80">
                  مزایای سطح نهایی
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="grid gap-4 p-[14px] lg:grid-cols-9 lg:p-4">
        <div className="flex h-[190px] items-center justify-center overflow-hidden rounded-xl bg-gray-200 px-8 lg:col-span-4 lg:h-[230px]">
          {isLoading ? (
            <Skeleton className="h-[175px] w-full bg-black/50" />
          ) : disabled || getData.isError || packages.length === 0 ? (
            <div className="flex h-[175px] w-full flex-col items-center justify-between gap-3 rounded-xl bg-gray-300 bg-gradient-to-bl from-transparent to-cs-red p-4 text-white">
              <div className="w-full">
                <span className="block flex-1 truncate text-left text-cs75 font-semibold text-white">
                  اشتراک زروان تریپ
                </span>
              </div>
              <div className="w-full">
                <span className="mb-1.5 block truncate text-left text-cs95 font-medium text-white">
                  {getData.isError
                    ? 'خطا در دریافت بسته ها'
                    : allPackages.length > 0
                      ? 'بسته ارتقای بالاتری موجود نیست'
                      : 'بسته ای یافت نشد'}
                </span>
                <span className="block truncate text-left text-cs85 font-semibold text-white">
                  {!getData.isError && hasActiveSubscription && allPackages.length > 0
                    ? 'تمدید ماهانه از کارت ویژه'
                    : '_'}
                </span>
              </div>
            </div>
          ) : (
            <Swiper
              key={packages.map((p) => p.id).join(',') || 'empty'}
              className="h-[175px] w-full !overflow-visible"
              spaceBetween={20}
              enabled={!disabled}
              onSlideChange={(swiper) => {
                const activeIndex = swiper.activeIndex;
                setActiveSwiperSlideIndex(activeIndex);
              }}
            >
              {packages.map((item, index) => (
                <SwiperSlide key={item.id ?? index}>
                  <div
                    style={{
                      background: item.color,
                      backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0, 0.5) , ${item.color})`,
                    }}
                    className="flex h-full w-full flex-col items-center justify-between gap-3 rounded-xl bg-gray-300 bg-gradient-to-bl from-transparent p-4 text-white"
                  >
                    <div className="w-full">
                      <span className="block flex-1 truncate text-left text-cs75 font-semibold text-white">
                        اشتراک زروان تریپ
                      </span>
                    </div>
                    <div className="w-full">
                      <span className="mb-1.5 block truncate text-left text-cs95 font-medium text-white">
                        {item.name}
                      </span>
                      <span className="block truncate text-left text-cs85 font-semibold text-white">
                        {`${addCommas(Number(item.monthly_cost || 0))} تومان`}
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
        <div className="grid gap-4 lg:col-span-5 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center justify-start gap-3">
              <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px] border border-black/10 text-black lg:rounded-md">
                <IconsaxIcons
                  name="Tag"
                  className="h-[20px] w-[20px]"
                  color="currentColor"
                />
              </div>
              <div className="w-full overflow-hidden">
                <span className="mb-1 block truncate text-right text-[12px] font-semibold text-black lg:text-cs75">
                  نام
                </span>
                {isLoading ? (
                  <Skeleton className="h-[18px] w-full" />
                ) : (
                  <span className="truncate text-right text-[10px] font-bold text-black/50 lg:text-cs75 lg:font-semibold">
                    {!getData.isError && activePackage?.name
                      ? activePackage.name
                      : '-'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px] border border-black/10 text-black lg:rounded-md">
                <IconsaxIcons
                  name="InfoCircle"
                  className="h-[20px] w-[20px]"
                  color="currentColor"
                />
              </div>
              <div className="w-full overflow-hidden">
                <span className="mb-1 block truncate text-right text-[12px] font-semibold text-black lg:text-cs75">
                  توضیحات
                </span>
                {isLoading ? (
                  <Skeleton className="h-[18px] w-full" />
                ) : (
                  <span className="truncate text-right text-[10px] font-bold text-black/50 lg:text-cs75 lg:font-semibold">
                    {!getData.isError && activePackage?.short_description
                      ? activePackage.short_description
                      : '-'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px] border border-black/10 text-black lg:rounded-md">
                <IconsaxIcons
                  name="Money"
                  className="h-[20px] w-[20px]"
                  color="currentColor"
                />
              </div>
              <div className="w-full overflow-hidden">
                <span className="mb-1 block truncate text-right text-[12px] font-semibold text-black lg:text-cs75">
                  هزینه ماهانه
                </span>
                {isLoading ? (
                  <Skeleton className="h-[18px] w-full" />
                ) : (
                  <span className="truncate text-right text-[10px] font-bold text-black/50 lg:text-cs75 lg:font-semibold">
                    {!getData.isError && activePackage?.monthly_cost !== undefined
                      ? `${addCommas(Number(activePackage.monthly_cost))} تومان`
                      : '-'}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-start gap-3">
              <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px] border border-black/10 text-black lg:rounded-md">
                <IconsaxIcons
                  name="Crown1"
                  className="h-[20px] w-[20px]"
                  color="currentColor"
                />
              </div>
              <div className="w-full overflow-hidden">
                <span className="mb-1 block truncate text-right text-[12px] font-semibold text-black lg:text-cs75">
                  ارتقا به سطح کاربری
                </span>
                {isLoading ? (
                  <Skeleton className="h-[18px] w-full" />
                ) : (
                  <span className="truncate text-right text-[10px] font-bold text-black/50 lg:text-cs75 lg:font-semibold">
                    {!getData.isError && activePackage?.upgrade_to_level
                      ? activePackage.upgrade_to_level
                      : '-'}
                  </span>
                )}
              </div>
            </div>
            {activePackage?.period_fk && (
              <div className="flex items-center justify-start gap-3">
                <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px] border border-black/10 text-black lg:rounded-md">
                  <IconsaxIcons
                    name="Calendar"
                    className="h-[20px] w-[20px]"
                    color="currentColor"
                  />
                </div>
                <div className="w-full overflow-hidden">
                  <span className="mb-1 block truncate text-right text-[12px] font-semibold text-black lg:text-cs75">
                    دوره پرداخت
                  </span>
                  <span className="truncate text-right text-[10px] font-bold text-black/50 lg:text-cs75 lg:font-semibold">
                    {activePackage.period_fk}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-between space-y-4 lg:h-[230px]">
            <div className="flex w-full items-center justify-start gap-3">
              <div className="flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[10px] border border-black/10 text-black lg:rounded-md">
                <IconsaxIcons
                  name="Grid1"
                  className="h-[20px] w-[20px]"
                  color="currentColor"
                />
              </div>
              <span className="block truncate text-right text-[12px] font-semibold text-black lg:text-cs75">
                اپشن ها
              </span>
            </div>
            {isLoading ? (
              <div className="custom-scrollbar w-full list-inside list-disc space-y-4 overflow-auto lg:h-full">
                {[...new Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-[18px] w-full" />
                ))}
              </div>
            ) : !getData.isError && activePackage?.options?.length ? (
              <ul className="custom-scrollbar w-full list-inside list-disc space-y-4 overflow-auto lg:h-full">
                {activePackage.options.map((item, index) => (
                  <li
                    className="truncate text-right text-[12px] font-bold text-black/75 lg:text-cs75 lg:font-semibold"
                    key={index}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="w-full text-right text-[12px] font-medium text-black/50 lg:h-full">
                -
              </span>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
