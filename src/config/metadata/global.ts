import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

// ------------------------------

export const metadataConfig: Metadata = {
  title: {
    default: SITE_CONFIG.nameEn,
    template: `%s | ${SITE_CONFIG.nameEn}`,
  },

  icons: {
    icon: SITE_CONFIG.logo.main.src,
  },

  description: SITE_CONFIG.sloganEn,
};
