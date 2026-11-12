import Filters from '@/components/pages/hotels/filters';
import HotelList from '@/components/pages/hotels/hotel-list';

export default async function Page(props: PageProps<'/hotels/[...slug]'>) {
  const { slug } = await props.params;
  console.log(slug);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[20rem_1fr]">
      <Filters />
      <HotelList />
    </div>
  );
}
