import { Filters, HotelList } from '@/components/pages/hotels';

// ------------------------------

export default async function Hotels(props: PageProps<'/hotels/[...slug]'>) {
  const { slug } = await props.params;
  console.log(slug);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[20rem_1fr]">
      <Filters />
      <HotelList />
    </div>
  );
}
