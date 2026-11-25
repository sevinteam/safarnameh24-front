// Importing next config type
import type { NextConfig } from 'next';

// Defining configs of next.js
const nextConfig: NextConfig = {
  output: 'standalone',
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: [
    '**.run.app',
    '*.run.app',
    '**.google.com',
    '**.googleusercontent.com',
    '**.corp.google.com',
    '127.0.0.1',
    'localhost',
  ],

  // هدایت خودکار درخواست‌های /api/v1 و /media در محیط لوکال به بک‌اند روی سرور
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      const rawBackendUrl = (
        process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || 'https://cps.safarnameh24.com'
      )
        .trim()
        .replace(/\/+$/, '');

      const backendUrl = /^https?:\/\//i.test(rawBackendUrl)
        ? rawBackendUrl
        : 'https://cps.safarnameh24.com';

      return [
        {
          source: '/media/:path*',
          destination: `${backendUrl}/media/:path*`,
        },
      ];
    }
    return [];
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cps.safarnameh24.com',
      },
      {
        protocol: 'https',
        hostname: 'www.cps.safarnameh24.com',
      },
      {
        protocol: 'https',
        hostname: 'safarnameh24.com',
      },
      {
        protocol: 'https',
        hostname: 'www.safarnameh24.com',
      },
      {
        protocol: 'http',
        hostname: 'cps.safarnameh24.com',
      },
      // پشتیبانی از لود تصاویر در محیط لوکال
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

// Exporting the configs
export default nextConfig;