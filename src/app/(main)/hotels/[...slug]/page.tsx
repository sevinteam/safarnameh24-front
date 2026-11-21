import { Filters, HotelList } from '@/components/pages/hotels';
import Banners from '@/components/pages/hotels/banners';
import { ViewSwitcher } from '@/components/pages/hotels/view-mode/view-switcher';
import { Sort } from '@/components/pages/hotels/sorting/sort';
import BreadCrumb from '@/components/pages/hotels/view/organisms/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StickySearchBar from '@/components/pages/hotels/sticky-search-bar/sticky-search-bar';
import { Container } from '@/components/layout/container';

// ------------------------------

export default async function Hotels(props: PageProps<'/hotels/[...slug]'>) {
  const { slug } = await props.params;
  console.log(slug);

  return (
    <>
      <StickySearchBar />

      <Container className="grid items-end gap-8 lg:mt-8 lg:grid-cols-[20rem_1fr]">
        <Filters />

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex-between items-center">
              <BreadCrumb />

              <div className="hidden items-center gap-2 lg:flex">
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

            <div className="hidden items-center justify-between gap-4 lg:flex">
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
