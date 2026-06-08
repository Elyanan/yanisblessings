import type { Metadata } from 'next'
import { JsonLdScript } from '@/components/seo/json-ld-script'
import { getProducts } from '@/lib/get-products'
import { buildItemListSchema } from '@/lib/seo/json-ld'
import { buildPageMetadata, pageSeo } from '@/lib/seo/metadata'

export const metadata: Metadata = buildPageMetadata(pageSeo.menu)

export const revalidate = 300

export default async function MenuLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts()

  return (
    <>
      <JsonLdScript data={buildItemListSchema(products)} id="menu-jsonld" />
      {children}
    </>
  )
}
