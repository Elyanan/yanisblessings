import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { fetchCategories } from '@/lib/sanity/queries'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const categories = await fetchCategories()
  return NextResponse.json({ categories })
}
