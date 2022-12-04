/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'retroachievements.org',
        port: ''
      },
    ],
  },
}

module.exports = nextConfig
