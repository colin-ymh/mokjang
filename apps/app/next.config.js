/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // ✅ packages/* 를 앱에서 사용하기 위해 필요
  transpilePackages: [
    '@mokjang/components',
    '@mokjang/utils',
    '@mokjang/constants',
    '@mokjang/types',
    '@mokjang/assets',
  ],

  // build(Webpack)에서 SVG 처리
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  // dev(Turbopack)에서 SVG 처리
  experimental: {
    turbo: {
      rules: {
        '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' },
      },
    },
    // appDir: true, // (기본 App Router면 불필요)
  },

  compiler: {
    styledComponents: true, // SWC 기반 styled-components 최적화
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3rowf2cf035m4.cloudfront.net',
        // pathname: '/**',
      },
    ],
  },

  // (선택) 도커/서버 배포 시 권장
  // output: 'standalone',
};

module.exports = nextConfig;
