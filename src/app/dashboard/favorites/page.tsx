'use client';

import { ReactNode, useState } from 'react';
import Filter from '@/components/dashboard/favorites/filter';
import Collection from '@/components/dashboard/favorites/collection';
import ErrorTable from '@/components/dashboard/api/errorTable';
import EmptyTable from '@/components/dashboard/api/emptyTable';
import { useApiQuery } from '@/hooks/dashboard/useApiQuery';

type RawCollectionItem = {
  id: number | string;
  title: string;
  thumbnails?: string[];
  images?: string[];
};

// ----------------------------------------------

export default function DashboardFavoritesPage(): ReactNode {
  const [deleteState, setDeleteState] = useState<boolean>(false);

  const getData = useApiQuery<any>({
    url: '/favorite/collections/',
    queryKey: ['favorites', 'collections'],
    options: {
      staleTime: 30000,
    },
  });

  // استخراج ایمن آرایه کالکشن‌ها در هر حالت پاسخ بک‌اند
  const rawData = getData.data;
  const rawList: RawCollectionItem[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.results)
      ? rawData.results
      : Array.isArray(rawData?.data)
        ? rawData.data
        : [];

  // تبدیل thumbnails بک‌اند به آرایه ۳ تایی images مورد نیاز کامپوننت Collection
  const collections = rawList.map((item) => {
    const sourceThumbs = Array.isArray(item?.thumbnails)
      ? item.thumbnails
      : Array.isArray(item?.images)
        ? item.images
        : [];

    const images = [0, 1, 2].map(
      (idx) => sourceThumbs[idx] || 'EmptyCollectionImage',
    );

    return {
      id: item.id,
      title: item.title,
      images,
    };
  });

  const isLoading = getData.isLoading || getData.isRefetching;
  const safeRefetch = (() => getData.refetch()) as any;

  return (
    <main className="flex flex-col gap-[24px] p-0 px-[24px] pt-[24px] pb-[50px] lg:gap-5 lg:p-5 lg:px-5 lg:pb-5">
      {isLoading ? (
        <>
          <Filter
            deleteState={deleteState}
            setDeleteState={setDeleteState}
            loading={true}
            listIsEmpty={true}
            refetch={safeRefetch}
          />
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {[1, 2, 3, 4].map((n) => (
              <Collection
                key={n}
                loading={true}
                isDeletingByUser={false}
                data={{ id: n, title: '', images: [] } as any}
                refetch={safeRefetch}
              />
            ))}
          </div>
        </>
      ) : getData.isError ? (
        <ErrorTable refetch={safeRefetch} />
      ) : (
        <>
          <Filter
            deleteState={deleteState}
            setDeleteState={setDeleteState}
            loading={false}
            listIsEmpty={collections.length === 0}
            refetch={safeRefetch}
          />

          {collections.length === 0 ? (
            <EmptyTable
              className="col-span-1 border-none lg:col-span-4 lg:bg-transparent"
              title="هیچ لیست مورد علاقه‌ای فعلاً ندارید!"
              description="مشتری گرامی، برای ایجاد اولین لیست علاقه‌مندی از دکمه «ثبت لیست جدید» استفاده نمایید."
            />
          ) : (
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
              {collections.map((collection) => (
                <Collection
                  key={collection.id}
                  loading={false}
                  isDeletingByUser={deleteState}
                  data={collection as any}
                  refetch={safeRefetch}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}