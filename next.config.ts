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
  experimental: {},
};

export default nextConfig;
