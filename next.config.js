const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n,
  eslint: {
    dirs: ['src/__tests__', 'src/pages', 'src/stores', 'src/utils'],
  },
  dir: './src',
};

module.exports = nextConfig;
