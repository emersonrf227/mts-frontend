/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  reactStrictMode: false,

  // ⬇️ Isso ignora os warnings do ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
