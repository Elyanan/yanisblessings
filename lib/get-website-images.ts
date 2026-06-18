import { fetchWebsiteImages } from '@/lib/sanity/queries'
import { resolveWebsiteImages } from '@/lib/website-images/resolve'
import type { WebsiteImagesMap } from '@/lib/website-images/types'

export async function getWebsiteImages(): Promise<WebsiteImagesMap> {
  const slots = await fetchWebsiteImages()
  return resolveWebsiteImages(slots)
}
