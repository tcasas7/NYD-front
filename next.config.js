/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '5d4lf267-3000.brs.devtunnels.ms',
        },
      ],
    },
  }
  
  module.exports = nextConfig
  