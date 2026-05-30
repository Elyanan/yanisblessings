import type { Product } from '@/lib/products'
import { fetchCategories, fetchMenuItems } from '@/lib/sanity/queries'
import type { SanityCategory, SanityMenuItem } from '@/lib/sanity/types'

export type CategoryFilter = {
  id: string
  name: string
  nameAm: string
}

function mapSanityProduct(item: SanityMenuItem): Product {
  const slug = item.slug?.current ?? item._id
  const categorySlug = item.category?.slug?.current ?? 'uncategorized'

  return {
    id: slug,
    name: item.title,
    nameAm: item.titleAm ?? item.title,
    description: item.description ?? '',
    descriptionAm: item.descriptionAm ?? item.description ?? '',
    price: item.price,
    image: item.image?.asset?.url ?? '/placeholder.svg',
    category: categorySlug,
    available: item.availability !== false,
    featured: item.featured ?? false,
    ingredients: item.ingredients,
  }
}

function mapSanityCategories(cats: SanityCategory[]): CategoryFilter[] {
  const mapped = cats.map((cat) => ({
    id: cat.slug?.current ?? cat._id,
    name: cat.title,
    nameAm: cat.titleAm ?? cat.title,
  }))
  return [{ id: 'all', name: 'All', nameAm: 'ሁሉም' }, ...mapped]
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
