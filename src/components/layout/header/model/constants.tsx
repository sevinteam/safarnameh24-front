import { routes } from '@/config/routes';

import { UsersRound, Hotel, Newspaper, Phone } from 'lucide-react';

// ------------------------------

const NAV_ITEMS = [
  {
    id: 'hosting',
    icon: Hotel,
    label: 'رزرو هتل',
    href: '/hotels/iran/tehran',
  },
  {
    id: 'magazine',
    icon: Newspaper,
    label: 'مجله گردشگری',
    href: '',
  },
  {
    id: 'about-us',
    icon: UsersRound,
    label: 'درباره ما',
    href: routes.aboutUs,
  },
  {
    id: 'contact-us',
    icon: Phone,
    label: 'تماس با ما',
    href: routes.contactUs,
  },
];

const NON_STICKY_HEADER_PATTERNS: readonly RegExp[] = [
  /^\/hotels?(\/|$)/, // Hotel listings (all/country/city) & hotel detail pages
];

// ------------------------------

export { NON_STICKY_HEADER_PATTERNS, NAV_ITEMS };
