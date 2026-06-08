import type { Metadata } from 'next'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata({
  ...pageSeo.cart,
  noIndex: true,
})

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
