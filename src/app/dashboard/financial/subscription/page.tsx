// Forcning Next.js to render this component as client side component
'use client';

// Importing part
import AdminCreditCardInfo from '@/components/dashboard/financialCartToCart/adminCreditCardInfo';
import Subscription from '@/components/dashboard/financialCartToCart/subscription/subscription';
import SubscriptionPicker from '@/components/dashboard/financialSubscription/subscriptionPicker';
import SubscriptionDetails from '@/components/dashboard/financialSubscription/subscriptionsDetails';
import SubscriptionTable from '@/components/dashboard/financialSubscription/table';
import SubscriptionType from '@/components/dashboard/profile/subscriptionType';
import ErrorTable from '@/components/dashboard/api/errorTable';
import { useApiQuery } from '@/hooks/dashboard/useApiQuery';
import {
  GETSubscriptionInvoiceItem,
  GETSubscriptionInvoices,
} from '@/types/dashboard/api/get';
import { JSX, useState } from 'react';

// Creating and exporting Subscription financial page as default
export default function SubscriptionFinancialPage(): JSX.Element {
  // Defining hooks
  const [paginationNumber, setPaginationNumber] = useState<number>(0);

  const invoicesQuery = useApiQuery<
    GETSubscriptionInvoices | GETSubscriptionInvoiceItem[]
  >({
    url: `/subscription/invoices/?p=${paginationNumber + 1}`,
    queryKey: ['subscription-invoices', String(paginationNumber + 1)],
    options: {
      staleTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: true,
    },
  });

  const rawInvoices = invoicesQuery.data;
  const invoiceResults = Array.isArray(rawInvoices)
    ? rawInvoices
    : (rawInvoices?.results ?? []);
  const invoiceCount = Array.isArray(rawInvoices)
    ? rawInvoices.length
    : (rawInvoices?.count ?? invoiceResults.length);

  const mappedInvoices = invoiceResults.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: item.created_at,
    expireDate: item.expire_date,
    price: Number(item.price || 0),
    status: item.status,
    statusDisplay: item.status_display,
  }));

  // Returning JSX
  return (
    <main className="lg:p-5 p-0 lg:pb-[50px] flex flex-col lg:gap-5 gap-0">
      <div className='grid lg:grid-cols-6 lg:gap-4 gap-[14px] lg:p-0 p-5'>
        <div className={'bg-white border rounded-xl border-black/10 lg:p-4 p-[14px] flex lg:flex-row flex-col items-center justify-between gap-3 lg:col-span-4'}>
          <div className="overflow-hidden flex-1 lg:w-auto w-full">
            <span className="text-cs09 font-extrabold truncate text-right mb-2 block text-black">
              بخش مالی - اشتراک
            </span>
            <span className="text-cs75 font-normal truncate text-right block text-black/70">
              در این بخش می‌توانید پلن اشتراک مدنظر خود را خریداری یا تمدید کنید.
            </span>
          </div>
        </div>
        <SubscriptionType className='lg:col-span-2' />
      </div>
      <div className='grid lg:grid-cols-7 lg:gap-4 gap-[14px] lg:p-0 p-5'>
        <Subscription className='lg:col-span-2' />
        <AdminCreditCardInfo className='lg:col-span-5' />
      </div>
      <div className='grid lg:grid-cols-7 lg:gap-4 gap-[14px] lg:p-0 p-5'>
        <SubscriptionPicker className='lg:col-span-5 lg:h-[344px]' />
        <SubscriptionDetails className='lg:col-span-2 lg:h-[344px]' />
      </div>
      <div className='lg:p-0 p-5 lg:bg-transparent bg-white lg:border-none border-t border-t-gray-300'>
        {invoicesQuery.isLoading ? (
          <SubscriptionTable data={[]} loading />
        ) : invoicesQuery.isError ? (
          <ErrorTable
            refetch={invoicesQuery.refetch}
            className="lg:h-auto lg:py-12 bg-white lg:rounded-lg lg:border border-black/10"
          />
        ) : (
          <SubscriptionTable
            data={mappedInvoices}
            loading={false}
            paginationCount={invoiceCount}
            paginationActiveIndex={paginationNumber}
            setPaginationActiveIndex={setPaginationNumber}
          />
        )}
      </div>
    </main>
  );
}
