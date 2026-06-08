import { policySite } from './constants'

type WebPageSchemaInput = {
  path: string
  name: string
  description: string
  dateModified?: string
}

export function buildPolicyWebPageSchema({ path, name, description, dateModified }: WebPageSchemaInput) {
  const url = `${policySite.url}${path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: policySite.name,
      url: policySite.url,
    },
    about: {
      '@type': 'Bakery',
      name: policySite.name,
      email: policySite.email,
      telephone: policySite.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Addis Ababa',
        addressCountry: 'ET',
      },
    },
    ...(dateModified ? { dateModified } : {}),
  }
}

export function buildBreadcrumbSchema(path: string, pageName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: policySite.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: pageName,
        item: `${policySite.url}${path}`,
      },
    ],
  }
}
