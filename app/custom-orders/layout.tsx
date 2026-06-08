import type { Metadata } from 'next'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata(pageSeo.customOrders)

export default function CustomOrdersLayout({ children }: { children: React.ReactNode }) {
  return children
}
