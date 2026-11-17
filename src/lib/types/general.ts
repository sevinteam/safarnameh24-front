import { StaticImageData } from 'next/image';
import { type LucideIcon } from 'lucide-react';

// ------------------------------

type City = {
  id: string;
  city: string;
  image: string;
  province: string;
};

type TopCities = City & {
  accommodations_count: number;
};

type FAQ = {
  answer: string;
  question: string;
};

type GeneralIcon = LucideIcon;

type GeneralBadge = {
  icon?: GeneralIcon;
  text: string;
};

type GeneralImage = {
  alt: string;
  src: StaticImageData | string;
};

// ------------------------------

export type { City, TopCities, FAQ, GeneralBadge, GeneralIcon, GeneralImage };
