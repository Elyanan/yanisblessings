import { NextResponse } from 'next/server'
import { getCategories, getProducts } from '@/lib/get-products'

export const revalidate = 300

export async function GET() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  return NextResponse.json(
    { products, categories },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  )
}
