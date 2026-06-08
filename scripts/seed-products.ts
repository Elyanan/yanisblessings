/**
 * One-time (idempotent) seed for Yani's Blessings menu items in Sanity.
 *
 * Maps your product fields → this project's `menuItem` documents:
 *   name → title, available → availability, category → category reference
 *
 * Requires SANITY_API_TOKEN with Editor permissions in .env.local
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient, type SanityClient } from '@sanity/client'
import { seedCategories, seedProducts } from './product-data'

const DOCUMENT_TYPE = 'menuItem'
const CATEGORY_TYPE = 'category'

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local')
  try {
    const text = readFileSync(envPath, 'utf8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    console.warn('[seed] .env.local not found — using existing environment variables')
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function createWriteClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  const token = process.env.SANITY_API_TOKEN

  if (!projectId) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
  }
  if (!token) {
    throw new Error('Missing SANITY_API_TOKEN in .env.local (Editor role required)')
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}

async function findBySlug(client: SanityClient, type: string, slug: string): Promise<string | null> {
  return client.fetch<string | null>(
    `*[_type == $type && slug.current == $slug][0]._id`,
    { type, slug },
  )
}

async function seedCategoryDocuments(client: SanityClient): Promise<Map<string, string>> {
  const categoryIds = new Map<string, string>()

  for (const cat of seedCategories) {
    const existingId = await findBySlug(client, CATEGORY_TYPE, cat.slug)
    if (existingId) {
      categoryIds.set(cat.title, existingId)
      console.log(`⏭  Category skipped (exists): ${cat.title}`)
      continue
    }

    const created = await client.create({
      _type: CATEGORY_TYPE,
      title: cat.title,
      titleAm: cat.titleAm,
      slug: { _type: 'slug', current: cat.slug },
      sortOrder: cat.sortOrder,
    })

    categoryIds.set(cat.title, created._id)
    console.log(`✅ Category created: ${cat.title}`)
  }

  return categoryIds
}

async function seedMenuItems(client: SanityClient, categoryIds: Map<string, string>) {
  let created = 0
  let skipped = 0

  for (let i = 0; i < seedProducts.length; i++) {
    const product = seedProducts[i]
    const slug = product.slug ?? slugify(product.name)
    const categoryId = categoryIds.get(product.category)

    if (!categoryId) {
      throw new Error(`Category not found for product "${product.name}": ${product.category}`)
    }

    const existingId = await findBySlug(client, DOCUMENT_TYPE, slug)
    if (existingId) {
      skipped++
      console.log(`⏭  Product skipped (exists): ${product.name}`)
      continue
    }

    await client.create({
      _type: DOCUMENT_TYPE,
      title: product.name,
      titleAm: product.titleAm,
      slug: { _type: 'slug', current: slug },
      description: product.description,
      descriptionAm: product.descriptionAm,
      price: product.price ?? 0,
      ingredients: product.ingredients,
      category: { _type: 'reference', _ref: categoryId },
      availability: product.available,
      featured: product.featured,
      sortOrder: i + 1,
    })

    created++
    const priceLabel = product.price === null ? 'price TBD (stored as 0)' : `${product.price} ETB`
    console.log(`✅ Product created: ${product.name} — ${priceLabel}`)
  }

  return { created, skipped }
}

async function main() {
  loadEnvLocal()
  const client = createWriteClient()

  console.log('\n🌱 Seeding Yani\'s Blessings products into Sanity...\n')

  try {
    const categoryIds = await seedCategoryDocuments(client)
    const { created, skipped } = await seedMenuItems(client, categoryIds)

    console.log('\n✨ Seed complete!')
    console.log(`   Categories: ${seedCategories.length} checked`)
    console.log(`   Products created: ${created}`)
    console.log(`   Products skipped: ${skipped}`)
    console.log(`   Total in seed data: ${seedProducts.length}\n`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('\n❌ Seed failed:', message)
    process.exit(1)
  }
}

main()
