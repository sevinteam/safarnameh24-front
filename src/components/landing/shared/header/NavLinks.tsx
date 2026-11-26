import NavLink from './NavLink';
import { useQuery } from '@tanstack/react-query';
import { generalInstance } from '@/utils/services';
import { Skeleton } from '@/components/ui/skeleton';

type Data = {
  page: {
    title: string;
    page: string;
    path: string;
  };
  order: number;
  title: string;

};

// --------------------------------------

export default function NavLinks() {
  const { data: rawData, isPending, isError } = useQuery<any>({
    queryKey: ['header-menus'],
    queryFn: async () => {
      const response = await generalInstance.get('/config/header-menus/');
      return response.data;
    },
  });

  const data = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData)
      ? rawData
      : [];

  return (
    <nav className="flex-center">
      {
        isPending
          ? (
            <div className="flex-center gap-4">
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <Skeleton key={index} className="w-20 h-6" />
                ))}
            </div>
          ) : isError ? false : !isPending && !isError && data.length > 0 ? data.map((item: Data, index: number) => (
            <NavLink key={index} href={item.page.path}>
              {item.title}
            </NavLink>
          ))
            : false
      }
    </nav>
  );
}
