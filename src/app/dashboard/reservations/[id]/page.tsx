// Forcing next.js to render this component as client side component
'use client';

// Importing part
import { ReactNode, use, useEffect } from 'react';
import HotelAcceptSection from '@/components/dashboard/reservationFactor/hotelAcceptSection';
import RoomsSection from '@/components/dashboard/reservationFactor/roomsSection';
import RulesSection from '@/components/dashboard/reservationFactor/rulesSection';
import Header from '@/components/dashboard/reservationFactor/header';
import IconsaxIcons from '@/components/icons/iconsaxIcons';
import { useApiQuery } from '@/hooks/dashboard/useApiQuery';
import {
  GETReservationFactor,
  GETReservationFactorSettings,
} from '@/types/dashboard/api/get';
import Loading from '@/components/dashboard/ui/loading';
import ErrorTable from '@/components/dashboard/api/errorTable';
import Image from 'next/image';
import Link from 'next/link';

const VOUCHER_LETTERHEAD_SRC =
  '/assets/aistudio/IMAGE_2026-11-27_15_56_11_2f17a96e.jpg';

// Creating and exporting ReservationFactor page as default
export default function ReservationFactorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): ReactNode {
  // Defining hooks
  const { id } = use(params);
  const factorData = useApiQuery<GETReservationFactor>({
    url: `/hotel/reservation/invoices/${id}/`,
    queryKey: [`reservation-factor-${id}`],
    options: {
      refetchInterval: Infinity,
      staleTime: Infinity,
    },
  });

  const settingsData = useApiQuery<GETReservationFactorSettings>({
    url: '/hotel/reservation/factor/signator/',
    queryKey: [`reservation-factor-settings`],
    options: {
      enabled: !factorData.isLoading,
      refetchInterval: Infinity,
      staleTime: Infinity,
    },
  });

  useEffect(() => {
    const img = new window.Image();
    img.src = VOUCHER_LETTERHEAD_SRC;
  }, []);

  const handleDownloadVoucher = async () => {
    try {
      const img = new window.Image();
      img.src = VOUCHER_LETTERHEAD_SRC;
      if (typeof img.decode === 'function') {
        await img.decode();
      }
    } catch {
      // Continue to print dialog even if decode fails
    }
    window.print();
  };

  // Conditional rendering
  if (
    factorData.isLoading ||
    factorData.isRefetching ||
    settingsData.isLoading ||
    settingsData.isRefetching
  ) {
    return (
      <main className="fixed left-0 top-0 flex h-dvh w-dvw items-center justify-center p-5">
        <Loading className="bg-cs-red" />
      </main>
    );
  } else if (factorData.isError || settingsData.isError) {
    return (
      <ErrorTable
        className="h-auto min-h-dvh bg-transparent p-5"
        refetch={factorData.refetch}
      />
    );
  } else if (
    !factorData.isLoading &&
    !factorData.isError &&
    factorData.data &&
    !settingsData.isLoading &&
    !settingsData.isError &&
    settingsData.data
  ) {
    // Defining variables
    const data = factorData.data.reservation;
    const settings = settingsData.data.invoice_settings;

    // Returning JSX
    return (
      <>
        <div className="relative hidden min-h-dvh w-dvw bg-white text-black print:block">
          <div className="pointer-events-none fixed inset-0 z-0 h-dvh w-dvw select-none">
            <Image
              alt="سربرگ واچر زروان تریپ"
              src={VOUCHER_LETTERHEAD_SRC}
              fill
              priority
              sizes="100vw"
              referrerPolicy="no-referrer"
              className="object-fill"
            />
          </div>

          <div className="relative z-10 w-full px-[12mm] pb-[32mm] pt-[46mm]">
            <div className="mb-4 flex items-center justify-between border-b border-black/10 pb-3">
              <div className="text-right">
                <h1 className="text-sm font-bold text-[#1e2756]">
                  واچر تاییدیه رزرواسیون هتل
                </h1>
                <p className="mt-1 text-[11px] font-medium text-black/60">
                  {`هتل ${data.hotel.name} - ${data.hotel.address}`}
                </p>
              </div>
              <div className="text-left text-[11px] font-semibold text-black/70">
                <span>شماره ثبت: 603443</span>
              </div>
            </div>

            <HotelAcceptSection
              className="relative z-10"
              hotelName={`${settings.title} - هتل ${data.hotel.name}`}
              noMq
              data={{
                codePeigiri: data.tracking_code,
                createdAt: data.created_at,
                enterAt: data.check_in_date,
                exitAt: data.check_out_date,
                phoneNumber: data.reserver_phone,
                reserver: data.reserver_name,
              }}
            />

            <RoomsSection
              className="relative z-10 mt-5 border-t border-t-black/20 pt-5"
              noMq
              data={data.rooms.map((item) => ({
                info: {
                  enteranceHalfCharge: item.half_day_in,
                  exitHalfCharge: item.half_day_out,
                  hotelName: item.room_name,
                  meals: item.services,
                  reserver: data.reserver_name,
                  timeSpan: item.nights,
                },
                passenger: data.passengers
                  .filter((passenger) => passenger.name !== data.reserver_name)
                  .map((passenger) => passenger.name),
              }))}
            />
          </div>

          <div
            className="fixed bottom-[4mm] left-0 right-0 z-20 px-[22%]"
            dir="ltr"
          >
            <div className="mb-1 flex items-center justify-center gap-6">
              <Link
                href={`tel:${settings.contact_number_1}`}
                className="flex items-center gap-1.5 text-[#1e2756]"
              >
                <IconsaxIcons
                  name="Call"
                  color="currentColor"
                  variant="Bold"
                  className="size-3.5"
                />
                <span className="text-[10px] font-medium text-black">
                  {settings.contact_number_1}
                </span>
              </Link>
              <Link
                href={`tel:${settings.contact_number_2}`}
                className="flex items-center gap-1.5 text-[#1e2756]"
              >
                <IconsaxIcons
                  name="Call"
                  color="currentColor"
                  variant="Bold"
                  className="size-3.5"
                />
                <span className="text-[10px] font-medium text-black">
                  {settings.contact_number_2}
                </span>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[#1e2756]">
              <span className="truncate text-center text-[10px] font-medium text-black">
                {settings.postal_address}
              </span>
              <IconsaxIcons
                name="Location"
                color="currentColor"
                className="size-3.5 shrink-0"
              />
            </div>
          </div>
        </div>
        <main className="flex flex-col gap-[25px] bg-white p-[24px] pb-[100px] pt-[calc(28px+24px)] lg:gap-8 lg:p-5 lg:pb-5 lg:pt-5 print:hidden">
          <Header />
          <HotelAcceptSection
            printFn={handleDownloadVoucher}
            hotelName={`${settings.title} - هتل ${data.hotel.name}`}
            data={{
              codePeigiri: data.tracking_code,
              createdAt: data.created_at,
              enterAt: data.check_in_date,
              exitAt: data.check_out_date,
              phoneNumber: data.reserver_phone,
              reserver: data.reserver_name,
            }}
          />
          <div className="hidden items-center justify-between gap-5 rounded-lg border border-black/10 bg-[#f8f8f8] p-3 lg:flex lg:h-16">
            <p className="block truncate text-right text-cs75 font-semibold text-[#2c2c2c]">{`هتل ${data.hotel.name} - ${data.hotel.address}`}</p>
          </div>
          <div className="block border-y-[1.5px] border-black/10 py-[20px] lg:hidden">
            <div className="flex items-start justify-start gap-[10px]">
              <div className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-[5px] bg-gray-100">
                <IconsaxIcons name="Location" className="h-[17px] w-[17px]" />
              </div>
              <div>
                <span className="mb-1 block truncate text-right text-[12px] font-bold text-black">
                  آدرس هتل
                </span>
                <p className="text-right text-[10px] font-medium text-gray-600">
                  {data.hotel.address}
                </p>
              </div>
            </div>
          </div>
          <RoomsSection
            data={data.rooms.map((item) => ({
              info: {
                enteranceHalfCharge: item.half_day_in,
                exitHalfCharge: item.half_day_out,
                hotelName: item.room_name,
                meals: item.services,
                reserver: data.reserver_name,
                timeSpan: item.nights,
              },
              passenger: data.passengers
                .filter((passenger) => passenger.name !== data.reserver_name)
                .map((passenger) => passenger.name),
            }))}
          />
          <RulesSection
            contactNumber={settings.contact_number_1}
            signatureImage={settings.signature_image}
            hotelName={data.hotel.name}
            rules={data.hotel_rules}
          />
        </main>
      </>
    );
  }
}
