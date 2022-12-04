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
      {
        protocol: 'https',
        hostname: 's3-eu-west-1.amazonaws.com',
        port: ''
      },
    ],
  },
}

module.exports = nextConfig
