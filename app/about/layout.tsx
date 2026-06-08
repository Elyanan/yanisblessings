import type { Metadata } from 'next'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata(pageSeo.about)

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children
}
