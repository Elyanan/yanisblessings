import type { Metadata } from 'next'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'
import { getWebsiteImages } from '@/lib/get-website-images'
import { WebsiteImagesProvider } from '@/lib/website-images/context'

export const metadata: Metadata = buildPageMetadata(pageSeo.about)
export const dynamic = 'force-dynamic'

export default async function AboutLayout({ children }: { children: React.ReactNode }) {
  const images = await getWebsiteImages()

  return <WebsiteImagesProvider images={images}>{children}</WebsiteImagesProvider>
}
