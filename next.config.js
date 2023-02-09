/** @type {import('next').NextConfig} */
const config = {
  swcMinify: true,
  reactStrictMode: false,
  experimental: {
    appDir: false
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
};

module.exports = withTM(config);
