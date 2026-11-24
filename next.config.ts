import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.hrsports.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-6a38698c8f7d411694afe9e4dd678660.r2.dev',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' http://localhost:3001 http://localhost:3000 http://127.0.0.1:3001 http://127.0.0.1:3000 https://*.thehrsports.com https://thehrsports.com;",
          },
        ],
      },
    ];
  },
  experimental: {},
};

export default nextConfig;
