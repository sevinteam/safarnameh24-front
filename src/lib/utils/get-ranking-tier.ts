export type RatingTier = {
  label: string;
  badgeClass: string;
};

export function getRatingTier(rating: number): RatingTier {
  if (rating >= 9.0) {
    return {
      label: 'فوق‌العاده',
      badgeClass: 'bg-emerald-500/10 text-emerald-500',
    };
  }
  if (rating >= 8.0) {
    return {
      label: 'عالی',
      badgeClass: 'bg-green-500/10 text-green-500',
    };
  }
  if (rating >= 7.0) {
    return {
      label: 'خیلی خوب',
      badgeClass: 'bg-teal-500/10 text-teal-500',
    };
  }
  if (rating >= 5.5) {
    return {
      label: 'خوب',
      badgeClass: 'bg-amber-500/10 text-amber-500',
    };
  }
  return {
    label: 'معمولی',
    badgeClass: 'bg-zinc-500/10 text-zinc-500',
  };
}
