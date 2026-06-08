import { siteConfig } from '@/lib/site-config'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yanisblessings.com'

export const SITE_NAME = siteConfig.name

export const DEFAULT_OG_IMAGE = '/logo.png'

export const SEO_KEYWORDS = [
  'bakery',
  'homemade bakery',
  'granola',
  'cupcakes',
  'cookies',
  'gift boxes',
  'custom cakes',
  'Addis Ababa',
  'Ethiopia',
  'artisan bakery',
  'homemade treats',
  'blessing boxes',
  "Yani's Blessings",
  'የያኒስ በረከቶች',
  'ግራኖላ',
  'ካፕኬኮች',
  'ኩኪዎች',
] as const

export const SEO_LOCALE = {
  en: 'en_US',
  am: 'am_ET',
} as const
