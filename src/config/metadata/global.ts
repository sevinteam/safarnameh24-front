import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';

// ------------------------------

export const metadataConfig: Metadata = {
  title: {
    default: SITE_CONFIG.name,
    template: `%s | ${SITE_CONFIG.name}`,
  },

  icons: {
    icon: SITE_CONFIG.logo.icon.src,
  },

  description: SITE_CONFIG.slogan,
};
