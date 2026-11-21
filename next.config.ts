// Importing next config type
import type { NextConfig } from 'next';

// Defining configs of next.js
const nextConfig: NextConfig = {
  output: 'standalone',
  skipTrailingSlashRedirect: true,

  // هدایت خودکار درخواست‌های /api/v1 در محیط لوکال به بک‌اند جنگو
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      const backendUrl =
        process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL || 'http://127.0.0.1:8000';
      return [
        {
          source: '/api/v1/:path*/',
          destination: `${backendUrl}/api/v1/:path*/`,
        },
        {
          source: '/api/v1/:path*',
          destination: `${backendUrl}/api/v1/:path*`,
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
        hostname: 'safarnameh24.com',
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