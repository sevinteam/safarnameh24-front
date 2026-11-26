import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import logo from '@/assets';
import { generalInstance } from '@/utils/services';
import { Skeleton } from '@/components/ui/skeleton';

type Data = {
  header_logo: string;
  header_title: string;
  header_sub_title: string;
};

type ApiResponse = {
  data: Data;
};

// --------------------------------

export default function DHeaderStatics() {
  const { data, status } = useQuery<ApiResponse>({
    queryKey: ['main-configs'],
    queryFn: () => generalInstance('/config/main'),
  });

  const title = data?.data.header_title;
  const subtitle = data?.data.header_sub_title;

  return (
    <Link href={'/'} className="flex items-center gap-3.5 hover:opacity-100 transition-none">
      <div className="flex-center size-16 p-1 overflow-hidden rounded-cs-10 transition-none">
        <Image
          src={logo}
          alt="logo"
          width={100}
          height={100}
          className="aspect-auto w-full transition-none hover:scale-100"
        />
      </div>

      {status === 'pending' ? (
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-40" />
        </div>
      ) : (
        <div className="max-w-48 space-y-0.5 text-cs08 text-zinc-800 transition-none">
          <span className="block truncate font-extrabold text-zinc-800 hover:text-zinc-800 hover:opacity-100 transition-none">{title}</span>
          <span className="block truncate font-inter font-semibold capitalize text-zinc-800 hover:text-zinc-800 hover:opacity-100 transition-none">
            {subtitle}
          </span>
        </div>
      )}
    </Link>
  );
}
