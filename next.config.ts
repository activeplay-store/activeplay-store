import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
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
