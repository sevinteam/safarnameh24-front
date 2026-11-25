'use client';

import { THotelSlug } from '@/types/landing';
import { useQuery } from '@tanstack/react-query';
import { generalInstance } from '@/utils/services';

import SSPictures from '../molecules/pictures/SSPictures';
import LSPictures from '../molecules/pictures/LSPictures';

type Props = THotelSlug & { hotelName?: string };
type TResponse = string[];

// --------------------------------

export function Pictures(props: Props) {
  const { hotelSlug, hotelName } = props;

  const { data: pictures, status } = useQuery<TResponse>({
    queryKey: ['hotel-pictures', hotelSlug],
    queryFn: () =>
      generalInstance(`/hotel/hotels/${hotelSlug}/images`).then(
        (data) => data.data,
      ),
  });

  if (status !== 'pending' && (!pictures || !pictures?.length)) return null;

  return (
    <>
      <SSPictures
        pictures={pictures ?? []}
        isLoading={status === 'pending'}
        hotelName={hotelName}
      />
      <LSPictures
        hotelSlug={hotelSlug}
        hotelName={hotelName}
        pictures={pictures ?? []}
        isLoading={status === 'pending'}
      />
    </>
  );
}
