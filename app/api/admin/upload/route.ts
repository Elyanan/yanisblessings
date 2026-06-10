import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getSanityWriteClient } from '@/lib/sanity/client'
import { formatSanityError, withSanityRetry } from '@/lib/sanity/retry'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = getSanityWriteClient()
  if (!client) {
    return NextResponse.json({ error: 'Sanity not configured' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await withSanityRetry(
      () =>
        client.assets.upload('image', buffer, {
          filename: file.name,
          contentType: file.type,
        }),
      'uploadImage',
    )

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
    })
  } catch (error) {
    console.error('[upload] Failed', error)
    return NextResponse.json({ error: formatSanityError(error) }, { status: 500 })
  }
}
