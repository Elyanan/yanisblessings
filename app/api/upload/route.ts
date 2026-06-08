import { NextResponse } from 'next/server'
import { getSanityWriteClient } from '@/lib/sanity/client'
import { isAllowedOrigin } from '@/lib/security/origin'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const client = getSanityWriteClient()
  if (!client) {
    return NextResponse.json({ error: 'Upload not available' }, { status: 503 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, WebP, or GIF images are allowed' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    })

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      url: asset.url,
    })
  } catch (error) {
    console.error('[upload] Failed', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
