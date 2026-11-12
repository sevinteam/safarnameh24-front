import Link from 'next/link';
import Image from 'next/image';

import { MapPin, Star } from 'lucide-react';

import { cn, formatNumber, getRatingTier } from '@/lib/utils';
import hotel_image from '@/assets/images/background/hero-3.jpg';
import { HotelCard as HotelCardProps } from '@/lib/types/hotel';

type Props = HotelCardProps & {
  className?: string;
};

// ------------------------------

export default function HotelCard(props: Props) {
  const { className } = props;
  const { label, badgeClass } = getRatingTier(3);

  return <div className={cn('', className)}></div>;
}
