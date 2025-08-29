/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@mokjang/components',
    '@mokjang/utils',
    '@mokjang/constants',
    '@mokjang/types',
    '@mokjang/assets',
  ],

  webpack: (config) => {
    config.module.rules.push({ test: /\.svg$/, use: ['@svgr/webpack'] });
    return config;
  },

  experimental: {
    turbo: { rules: { '*.svg': { loaders: ['@svgr/webpack'], as: '*.js' } } },
  },

  compiler: { styledComponents: true },
  // images: { remotePatterns: [...] }, // 필요 시만
  // output: 'standalone',
};

module.exports = nextConfig;
