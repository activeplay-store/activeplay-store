import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  outputFileTracingRoot: '/var/www/activeplay-store',
async redirects() {
    return [
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/ym/:path*',
        destination: 'https://mc.yandex.ru/:path*',
      },
    ];
  },
};

export default nextConfig;
