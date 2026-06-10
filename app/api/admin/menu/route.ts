import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { fetchMenuItemsFresh } from '@/lib/sanity/queries'
import { formatSanityError } from '@/lib/sanity/retry'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const items = await fetchMenuItemsFresh()
    return NextResponse.json(
      { items },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('[admin/menu] Fetch failed', error)
    return NextResponse.json({ error: formatSanityError(error), items: [] }, { status: 500 })
  }
}
