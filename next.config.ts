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
        process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || 'https://cps.zarvantrip.com'
      )
        .trim()
        .replace(/\/+$/, '');

      const backendUrl = /^https?:\/\//i.test(rawBackendUrl)
        ? rawBackendUrl
        : 'https://cps.zarvantrip.com';

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
        hostname: 'cps.zarvantrip.com',
      },
      {
        protocol: 'https',
        hostname: 'www.cps.zarvantrip.com',
      },
      {
        protocol: 'https',
        hostname: 'zarvantrip.com',
      },
      {
        protocol: 'https',
        hostname: 'www.zarvantrip.com',
      },
      {
        protocol: 'http',
        hostname: 'cps.zarvantrip.com',
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