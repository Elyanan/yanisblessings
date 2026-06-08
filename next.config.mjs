/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.100.6'],
  poweredByHeader: false,
}

export default nextConfig
