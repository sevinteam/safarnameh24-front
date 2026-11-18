import { Filters, HotelList } from '@/components/pages/hotels';
import Banners from '@/components/pages/hotels/banners';
import { ViewSwitcher } from '@/components/pages/hotels/view-mode/view-switcher';
import { Sort } from '@/components/pages/hotels/sorting/sort';
import BreadCrumb from '@/components/pages/hotels/view/organisms/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StickySearchBar from '@/components/layout/sticky-search-bar/sticky-search-bar';
import SortWrapper from '@/components/pages/hotels/sorting/sort-wrapper';

// ------------------------------

export default async function Hotels(props: PageProps<'/hotels/[...slug]'>) {
  const { slug } = await props.params;
  console.log(slug);

  return (
    <div>
      <StickySearchBar />

      <div className="grid items-end gap-8 lg:mt-8 lg:grid-cols-[20rem_1fr]">
        <Filters />

        <div className="space-y-8">
          <div className="space-y-6">
            <div className="flex-between items-center">
              <BreadCrumb />

              <div className="flex items-center gap-2">
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
              {/* <SortWrapper /> */}
              {/* <BreadCrumb /> */}

              {/* <div className="mr-auto flex items-center gap-2">
                <Badge
                  variant={'secondary'}
                  className="h-8 rounded-lg px-2.5 text-sm"
                >
                  121 هتل در تهران
                </Badge>
              </div> */}

              {/* <Separator orientation="vertical" className={'my-1'} /> */}

              <ViewSwitcher />
            </div>
          </div>

          <HotelList />
        </div>
      </div>
    </div>
  );
}
