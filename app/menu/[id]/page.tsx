import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLdScript } from '@/components/seo/json-ld-script'
import { getProductById } from '@/lib/get-products'
import { buildBreadcrumbSchema, buildProductSchema } from '@/lib/seo/json-ld'
import { buildPageMetadata } from '@/lib/seo/metadata'
import { ProductPageClient } from './product-page-client'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return buildPageMetadata({
    title: product.name,
    description: product.description || `${product.name} — homemade treat from Yani's Blessings in Addis Ababa.`,
    path: `/menu/${id}`,
    ogImage: product.image,
    ogType: 'product',
    keywords: [product.category.replace('-', ' '), product.name, 'Addis Ababa bakery'],
  })
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <>
      <JsonLdScript
        id="product-jsonld"
        data={[
          buildProductSchema(product),
          buildBreadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Menu', path: '/menu' },
            { name: product.name, path: `/menu/${id}` },
          ]),
        ]}
      />
      <ProductPageClient id={id} />
    </>
  )
}

export const revalidate = 300
