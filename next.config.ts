/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
        port: '',
        pathname: '/private/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig