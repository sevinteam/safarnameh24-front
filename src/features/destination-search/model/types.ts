type CityDestination = {
  id: string;
  type: 'city';
  scope: DestinationScope;

  slug: string;
  name: string;

  country: string;
  country_slug: string;

  province?: string;
  accommodations_count: number;
};

// /hotels/${country_slug}/${slug}

type HotelDestination = {
  id: string;
  type: 'hotel';
  scope: DestinationScope;

  slug: string;
  name: string;

  city: string;
  city_slug: string;

  country: string;
  country_slug: string;

  stars: number;
};

// /hotel/${country_slug}/${city_slug}/${slug}

type DestinationType = Destination['type'];
type DestinationScope = 'domestic' | 'international';
type Destination = CityDestination | HotelDestination;

// ------------------------------

export type { Destination, DestinationType, CityDestination, HotelDestination };
