import type { Metadata } from 'next'
import { DEFAULT_OG_IMAGE, SEO_KEYWORDS, SEO_LOCALE, SITE_NAME, SITE_URL } from './constants'

type PageMetaInput = {
  title: string
  description: string
  path: string
  keywords?: string[]
  noIndex?: boolean
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

/** hreflang for cookie-based bilingual site (same URL serves both languages). */
export function buildLanguageAlternates(path: string) {
  const url = absoluteUrl(path)
  return {
    canonical: url,
    languages: {
      en: url,
      am: url,
      'x-default': url,
    },
  }
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
}: PageMetaInput): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const url = absoluteUrl(path)
  const allKeywords = [...SEO_KEYWORDS, ...keywords]

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: SITE_NAME }],
    alternates: buildLanguageAlternates(path),
    robots: noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: SEO_LOCALE.en,
      alternateLocale: [SEO_LOCALE.am],
      type: ogType === 'product' ? 'website' : ogType,
      images: [{ url: ogImage, width: 1200, height: 630, alt: SITE_NAME }],
      countryName: 'Ethiopia',
    },
    category: 'food & drink',
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  }
}

export const pageSeo = {
  home: {
    title: "Yani's Blessings | Homemade Granola, Cupcakes & Cookies in Addis Ababa",
    description:
      'A Little Blessing in Every Bite. Premium homemade granola, cupcakes, cookies and gift boxes made with love in Addis Ababa, Ethiopia. Order online for delivery.',
    path: '/',
  },
  menu: {
    title: 'Menu | Homemade Bakery Treats',
    description:
      'Browse our full menu of homemade granola, cupcakes, cookies, gift boxes and seasonal specials. Freshly baked in Addis Ababa with premium ingredients.',
    path: '/menu',
  },
  about: {
    title: 'About Us | Homemade Bakery in Addis Ababa',
    description:
      "Learn about Yani's Blessings — a homemade granola, cupcake, cake and sweets brand based in Addis Ababa, Ethiopia. Made with love and top-quality ingredients.",
    path: '/about',
  },
  contact: {
    title: 'Contact Us | Order & Inquiries',
    description:
      "Get in touch with Yani's Blessings in Addis Ababa. Call, WhatsApp, or send a message about orders, delivery, and custom bakery requests.",
    path: '/contact',
  },
  customOrders: {
    title: 'Custom Orders | Cakes, Cupcakes & Gift Boxes',
    description:
      'Request custom birthday cakes, cupcakes, corporate gift boxes and event orders from our Addis Ababa bakery. Personalized treats for every celebration.',
    path: '/custom-orders',
  },
  cart: {
    title: 'Your Cart',
    description: 'Review your order and checkout. Homemade treats from Yani\'s Blessings, delivered across Addis Ababa.',
    path: '/cart',
    noIndex: true,
  },
} as const
