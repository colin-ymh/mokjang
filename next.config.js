const nextConfig = {
  reactStrictMode: false,

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // appDir: true,
  },

  compiler: {
    styledComponents: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3rowf2cf035m4.cloudfront.net',
        // pathname: '/**', // 모든 경로 허용 (필요시)
      },
    ],
  },
};

module.exports = nextConfig;
