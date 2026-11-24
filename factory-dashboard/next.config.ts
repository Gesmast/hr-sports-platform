import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, './'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pkbyeviilqdzlcvwndnd.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '185b745751f3401e5d3bb55121658f60.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'pub-*.r2.dev',
      },
    ],
  },
};

export default nextConfig;
