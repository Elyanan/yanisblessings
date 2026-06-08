/**
 * Uploads product images from public/images to Sanity and attaches them to menu items by slug.
 * Safe to re-run: skips items that already have an image unless --force is passed.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient, type SanityClient } from '@sanity/client'
import { seedProducts } from './product-data'

const IMAGES_DIR = resolve(process.cwd(), 'public/images')

/** Legacy slugs from the first seed (slugify from title) → image file */
const slugAliases: Record<string, string> = {
  'classic-granola': 'granola-classic.png',
  'chocolate-granola': 'granola-chocolate.png',
  'date-granola': 'granola-date.png',
  'cinnamon-granola': 'granola-cinnamon.png',
  'mini-breakfast-granola-pack': 'granola-mini.png',
  'vanilla-blessing-cupcakes': 'cupcake-vanilla.png',
  'chocolate-love-cupcakes': 'cupcake-chocolate.png',
  'coffee-cupcakes': 'cupcake-coffee.png',
  'mini-cupcake-boxes': 'cupcake-mini-box.png',
  'oat-cookies': 'cookie-oat.png',
}

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), '.env.local')
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
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildSlugImageMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const product of seedProducts) {
    if (!product.image) continue
    const slug = product.slug ?? slugify(product.name)
    map.set(slug, product.image)
  }
  for (const [slug, file] of Object.entries(slugAliases)) {
    map.set(slug, file)
  }
  return map
}

function createWriteClient(): SanityClient {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
  const token = process.env.SANITY_API_TOKEN

  if (!projectId || !token) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN in .env.local')
  }

  return createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}

async function main() {
  const force = process.argv.includes('--force')
  loadEnvLocal()
  const client = createWriteClient()
  const slugImageMap = buildSlugImageMap()

  const menuItems = await client.fetch<
    Array<{ _id: string; title: string; slug?: { current?: string }; image?: { asset?: { _ref?: string } } }>
  >(`*[_type == "menuItem"]{ _id, title, slug, image }`)

  console.log('\n🖼  Uploading menu item images to Sanity...\n')

  let uploaded = 0
  let skipped = 0
  let missing = 0

  for (const item of menuItems) {
    const slug = item.slug?.current
    if (!slug) {
      console.log(`⏭  No slug: ${item.title}`)
      skipped++
      continue
    }

    const filename = slugImageMap.get(slug)
    if (!filename) {
      console.log(`⏭  No image mapping for slug "${slug}" (${item.title})`)
      missing++
      continue
    }

    if (item.image?.asset?._ref && !force) {
      console.log(`⏭  Already has image: ${item.title}`)
      skipped++
      continue
    }

    const filePath = resolve(IMAGES_DIR, filename)
    if (!existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`)
      missing++
      continue
    }

    try {
      const buffer = readFileSync(filePath)
      const asset = await client.assets.upload('image', buffer, {
        filename,
        contentType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
      })

      await client
        .patch(item._id)
        .set({
          image: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id },
          },
        })
        .commit()

      uploaded++
      console.log(`✅ ${item.title} ← ${filename}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.log(`❌ Failed: ${item.title} — ${message}`)
      missing++
    }
  }

  console.log('\n✨ Image upload complete!')
  console.log(`   Uploaded: ${uploaded}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   No mapping / missing file: ${missing}\n`)
}

main().catch((error) => {
  console.error('\n❌ Image seed failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
