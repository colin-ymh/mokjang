/* eslint-disable @typescript-eslint/no-var-requires */
const base = require('../../next.config.base.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...base, // ✅ 공통 env 불러오기

  transpilePackages: [
    '@mokjang/components',
    '@mokjang/utils',
    '@mokjang/constants',
    '@mokjang/types',
    '@mokjang/assets',
    '@mokjang/models',
  ],

  webpack: (config) => {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });
    return config;
  },

  experimental: {
    turbo: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } },
  },

  compiler: { styledComponents: true },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'llpctyxwbynqhuikfmzn.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
