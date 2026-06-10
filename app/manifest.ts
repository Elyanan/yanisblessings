import type { MetadataRoute } from 'next'
import { SITE_NAME } from '@/lib/seo/constants'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Yani's Blessings",
    description:
      'Premium homemade granola, cupcakes, cookies and gift boxes made with love in Addis Ababa, Ethiopia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF7ED',
    theme_color: '#FFF7ED',
    lang: 'en',
    dir: 'ltr',
    id: '/',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
