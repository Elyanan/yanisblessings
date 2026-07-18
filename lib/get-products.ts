import type { Product } from '@/lib/products'
import { buildGranolaSizes, isGranolaWithSizes } from '@/lib/granola-sizes'
import { optimizeSanityCdnUrl } from '@/lib/sanity/image'
import { fetchCategories, fetchMenuItems } from '@/lib/sanity/queries'
import type { SanityCategory, SanityMenuItem } from '@/lib/sanity/types'

export type CategoryFilter = {
  id: string
  name: string
  nameAm: string
}

export type HomeCategory = CategoryFilter & {
  description: string
  descriptionAm: string
  image?: string
  imageAlt: string
}

function mapSanityProduct(item: SanityMenuItem): Product {
  const slug = item.slug?.current ?? item._id
  const categorySlug = item.category?.slug?.current ?? 'uncategorized'

  const product: Product = {
    id: slug,
    name: item.title,
    nameAm: item.titleAm ?? item.title,
    description: item.description ?? '',
    descriptionAm: item.descriptionAm ?? item.description ?? '',
    price: item.price,
    image: optimizeSanityCdnUrl(item.image?.asset?.url, 800, 80),
    category: categorySlug,
    available: item.availability !== false,
    featured: item.featured ?? false,
    hasGranolaSizes: item.hasGranolaSizes,
    ingredients: item.ingredients,
  }

  if (isGranolaWithSizes({ id: slug, category: categorySlug, hasGranolaSizes: item.hasGranolaSizes })) {
    product.sizes = buildGranolaSizes(item.price)
  }

  return product
}

function mapSanityCategories(cats: SanityCategory[]): CategoryFilter[] {
  const mapped = cats.map((cat) => ({
    id: cat.slug?.current ?? cat._id,
    name: cat.title,
    nameAm: cat.titleAm ?? cat.title,
  }))
  return [{ id: 'all', name: 'All', nameAm: 'ሁሉም' }, ...mapped]
}

function mapHomeCategories(cats: SanityCategory[]): HomeCategory[] {
  return cats
    .filter((cat) => cat.showOnHome !== false)
    .map((cat) => ({
      id: cat.slug?.current ?? cat._id,
      name: cat.title,
      nameAm: cat.titleAm ?? cat.title,
      description: cat.description ?? '',
      descriptionAm: cat.descriptionAm ?? cat.description ?? '',
      image: optimizeSanityCdnUrl(cat.image?.asset?.url, 900, 82),
      imageAlt: cat.title,
    }))
}

export async function getProducts(): Promise<Product[]> {
  const sanityItems = await fetchMenuItems()
  return sanityItems.map(mapSanityProduct)
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const all = await getProducts()
  return all.find((p) => p.id === id)
}

export async function getCategories(): Promise<CategoryFilter[]> {
  const sanityCats = await fetchCategories()
  if (sanityCats.length === 0) {
    return [{ id: 'all', name: 'All', nameAm: 'ሁሉም' }]
  }
  return mapSanityCategories(sanityCats)
}

export async function getHomeCategories(): Promise<HomeCategory[] | undefined> {
  const sanityCats = await fetchCategories()
  if (sanityCats.length === 0) return undefined
  return mapHomeCategories(sanityCats)
}
