import { Filters, HotelList } from '@/components/pages/hotels';
import Banners from '@/components/pages/hotels/banners';
import { ViewSwitcher } from '@/components/pages/hotels/view-mode/view-switcher';
import { Sort } from '@/components/pages/hotels/sorting/sort';
import BreadCrumb from '@/components/pages/hotels/view/organisms/breadcrumb';

// ------------------------------

export default async function Hotels(props: PageProps<'/hotels/[...slug]'>) {
  const { slug } = await props.params;
  console.log(slug);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[20rem_1fr]">
      <Filters />

      <div className="space-y-8">
        <div className="space-y-6">
          <BreadCrumb />
          <Banners />

          <div className="hidden items-center justify-between gap-4 lg:flex">
            <Sort />
            <ViewSwitcher />
          </div>
        </div>

        <HotelList />
      </div>
    </div>
  );
}
