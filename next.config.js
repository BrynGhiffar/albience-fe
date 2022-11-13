/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.wallpaperscraft.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      }
    ]
  }
}

module.exports = nextConfig
