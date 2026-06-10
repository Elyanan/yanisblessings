import { siteConfig } from '@/lib/site-config'
import type { Product } from '@/lib/products'
import { SITE_NAME, SITE_URL } from './constants'
import { absoluteUrl } from './metadata'

const address = {
  '@type': 'PostalAddress' as const,
  addressLocality: 'Addis Ababa',
  addressRegion: 'Addis Ababa',
  addressCountry: 'ET',
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: 'customer service',
      areaServed: 'ET',
      availableLanguage: ['English', 'Amharic'],
    },
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
    address,
  }
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Premium homemade granola, cupcakes, cookies and gift boxes made with love in Addis Ababa, Ethiopia.',
    inLanguage: ['en', 'am'],
    publisher: { '@id': `${SITE_URL}/#organization` },
  }
}

export function buildLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Bakery'],
    '@id': `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    url: SITE_URL,
    image: absoluteUrl('/logo.png'),
    logo: absoluteUrl('/logo.png'),
    description:
      'Homemade granola, cupcakes, cookies, gift boxes and custom orders in Addis Ababa, Ethiopia.',
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 9.032,
      longitude: 38.7469,
    },
    areaServed: {
      '@type': 'City',
      name: 'Addis Ababa',
    },
    priceRange: '$$',
    servesCuisine: 'Bakery',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '17:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '15:00',
      },
    ],
    sameAs: [siteConfig.social.instagram, siteConfig.social.tiktok],
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  }
}

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function buildProductSchema(product: Product) {
  const url = absoluteUrl(`/menu/${product.id}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : absoluteUrl(product.image),
    url,
    sku: product.id,
    inLanguage: ['en', 'am'],
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'ETB',
      price: product.price,
      availability: product.available
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@id': `${SITE_URL}/#localbusiness` },
    },
  }
}

export function buildItemListSchema(products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${SITE_NAME} Menu`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 50).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: absoluteUrl(`/menu/${product.id}`),
      name: product.name,
    })),
  }
}

export function buildHomePageSchemas() {
  return [buildOrganizationSchema(), buildWebsiteSchema(), buildLocalBusinessSchema()]
}
