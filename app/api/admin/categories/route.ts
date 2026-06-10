import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { fetchCategoriesFresh } from '@/lib/sanity/queries'
import { formatSanityError } from '@/lib/sanity/retry'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const categories = await fetchCategoriesFresh()
    return NextResponse.json(
      { categories },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('[admin/categories] Fetch failed', error)
    return NextResponse.json({ error: formatSanityError(error), categories: [] }, { status: 500 })
  }
}
