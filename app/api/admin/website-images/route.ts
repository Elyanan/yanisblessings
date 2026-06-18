import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { fetchWebsiteImagesFresh } from '@/lib/sanity/queries'
import { formatSanityError } from '@/lib/sanity/retry'
import { WEBSITE_IMAGE_SLOTS } from '@/lib/website-images/definitions'
import { resolveWebsiteImages } from '@/lib/website-images/resolve'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const slots = await fetchWebsiteImagesFresh()
    const images = resolveWebsiteImages(slots)
    return NextResponse.json(
      {
        slots,
        images,
        definitions: WEBSITE_IMAGE_SLOTS,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    console.error('[admin/website-images] Fetch failed', error)
    return NextResponse.json({ error: formatSanityError(error) }, { status: 500 })
  }
}
