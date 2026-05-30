import { NextResponse } from 'next/server'
import { getCategories, getProducts } from '@/lib/get-products'

export async function GET() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])
  return NextResponse.json({ products, categories })
}
