/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /**
   * We have special extensions here for page components, because we want to
   * test unit tests right beside our page, and having extension this way
   * can prevent next.js from regarding those files as page components.
   */
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  eslint: {
    dirs: ['src'],
  },
  env: {
    API_DOMAIN: process.env.API_DOMAIN || 'localhost:8080',
  },
};

module.exports = nextConfig;
