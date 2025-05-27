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
    styledComponents: true, // styled-components 활성화
  },
};

module.exports = nextConfig;
