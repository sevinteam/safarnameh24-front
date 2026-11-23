import { FiltersSticky, HotelList } from '@/components/pages/hotels';
import Banners from '@/components/pages/hotels/banners';
import { ViewSwitcher } from '@/components/pages/hotels/view-mode/view-switcher';
import { Sort } from '@/components/pages/hotels/sorting/sort';
import BreadCrumb from '@/components/pages/hotels/breadcrumb';
import { Badge } from '@/components/ui/badge';
import StickySearchBar from '@/components/pages/hotels/sticky-search-bar/sticky-search-bar';
import { Container } from '@/components/layout/container';

// ------------------------------

export default async function Hotels(props: PageProps<'/hotels/[...slug]'>) {
  const { slug } = await props.params;
  console.log(slug);

  return (
    <>
      <StickySearchBar />

      <Container className="mb-24 grid items-end gap-8 lg:mt-8 lg:grid-cols-[18rem_1fr]">
        <FiltersSticky />

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex-between items-center">
              <BreadCrumb />

              <div className="hidden items-center gap-2 sm:flex">
                <span className="text-sm font-medium">نتایج :</span>
                <Badge
                  variant={'secondary'}
                  className="rounded-md font-semibold"
                >
                  56 مورد
                </Badge>
              </div>
            </div>
            <Banners />

            <div className="hidden items-center justify-between gap-4 xl:flex">
              <Sort />
              <ViewSwitcher />
            </div>
          </div>

          <HotelList />
        </div>
      </Container>
    </>
  );
}
