/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.100.6'],
}

export default nextConfig
