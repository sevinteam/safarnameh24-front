import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep 'standalone' only if deploying via Docker / self-hosted Node server
  output: 'standalone',

  // Remove Next.js powered-by response header for cleaner security headers
  poweredByHeader: false,
  experimental: {
    agentUpgrade: 'security',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Example for production CDN:
      // {
      //   protocol: 'https',
      //   hostname: 'cdn.safarnameh24.ir',
      // },
    ],
  },

  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
