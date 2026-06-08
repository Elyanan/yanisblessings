import type { Metadata } from 'next'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata(pageSeo.contact)

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
