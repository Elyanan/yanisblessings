import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/get-products'
import { SITE_URL } from '@/lib/seo/constants'

const staticRoutes = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/menu', priority: 0.9, changeFrequency: 'daily' as const },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
  { path: '/custom-orders', priority: 0.8, changeFrequency: 'monthly' as const },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' as const },
  { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const products = await getProducts()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/menu/${product.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: product.featured ? 0.85 : 0.75,
  }))

  return [...staticEntries, ...productEntries]
}

export const revalidate = 3600
